import type { PrismaClient, peer_reviews } from '@prisma/client';
import { json } from '@sveltejs/kit';

interface Question {
	id: number;
}

export async function GET({ request, locals, url }: { request: Request; locals: any; url: URL }) {
	// Get URL params
	const peer_review_id: string | null = decodeURIComponent(
		url.searchParams.get('peer_review_id') || ''
	);

	// Sanitize parameters
	const sanitizedPeerReviewId: number = peer_review_id ? parseInt(peer_review_id.trim()) : 0;

	const errors: string[] = [];

	if (!peer_review_id) {
		errors.push('Please provide a review id.');
	}

	if (errors.length > 0) {

		return json({ message: 'Missing or invalid fields.', errors }, { status: 400 });
	}

	const prisma = locals.prisma as PrismaClient;

	try {
		const peerReview: peer_reviews = await prisma.peer_reviews.findUnique({
			where: {
				id: sanitizedPeerReviewId,
			},
		}) as peer_reviews;

		return json({ message: 'Successfully retrieved peer review.', data: {
			...peerReview,
		} }, { status: 200 });
	} catch (error) {
		console.error(error);
		return json({ message: 'Failed to retrieve peer review.' }, { status: 500 });
	}
}

export async function POST({ request, locals }: { request: Request; locals: any }) {
	const body = await request.json();

	const { name, template_id, due_date, class_id } = body as {
		name: string;
		template_id: number;
		due_date: string;
		class_id: number;
	};

	const errors: string[] = [];

	// Validate body
	if (!name) {
		errors.push('Please provide a name for the peer review.');
	}

	if (!template_id) {
		errors.push('Please provide a template id.');
	}

	if (!due_date) {
		errors.push('Please provide a due date for the peer review.');
	}

	if (due_date && new Date(due_date) < new Date()) {
		errors.push('Please provide a due date in the future.');
	}

	if (!class_id) {
		errors.push('Please provide a class id.');
	}

	if (errors.length > 0) {
		return json({ message: 'Missing or invalid fields.', errors }, { status: 400 });
	}

	const prisma = locals.prisma as PrismaClient;

	try {
		const peerReview: peer_reviews = await prisma.peer_reviews.create({
			data: {
				name,
				class_id,
				due_date: new Date(due_date),
				status: 'assigned',
				template_id,
				peer_review_assignments: {
					create: await Promise.all(
						(
							await prisma.class_students.findMany({
								where: { class_id },
								select: { student_id: true }
							})
						).map(async ({ student_id }) => ({
							status: 'assigned',
							final_score: 0,
							created_at: new Date(),
							last_updated: new Date(),
							users: { connect: { id: student_id } },
							peer_review_submissions: { create: [] }
						}))
					)
				}
			}
		});

		return json({ message: 'Created a peer review.', data: peerReview }, { status: 201 });
	} catch (error) {
		console.error(error);
		return json({ message: 'Failed to create peer review.' }, { status: 500 });
	}
}

export async function PATCH({ request, locals }: { request: Request; locals: any }) {
	const body = await request.json();

	const { name, due_date, review_id } = body as {
		name: string;
		due_date: string;
		review_id: number;
	};

	const errors: string[] = [];

	// Validate body
	if (!name) {
		errors.push('Please provide a name for the peer review.');
	}

	if (!due_date) {
		errors.push('Please provide a due date for the peer review.');
	}

	if (due_date && new Date(due_date) < new Date()) {
		errors.push('Please provide a due date in the future.');
	}

	if (!review_id) {
		errors.push('Please provide a review id.');
	}

	if (errors.length > 0) {
		return json({ message: 'Missing or invalid fields.', errors }, { status: 400 });
	}

	const prisma = locals.prisma as PrismaClient;

	try {
		const peerReview: peer_reviews = await prisma.peer_reviews.update({
			where: {
				id: review_id
			},
			data: {
				name,
				due_date: new Date(due_date)
			}
		});

		return json(
			{ message: 'Successfully updated the peer review.', data: peerReview },
			{ status: 201 }
		);
	} catch (error) {
		console.error(error);
		return json({ message: 'Failed to create peer review.' }, { status: 500 });
	}
}

export async function DELETE({ request, locals }: { request: Request; locals: any }) {
	const body = await request.json();

	const { review_id } = body as {
		review_id: number;
	};

	const errors: string[] = [];

	// Validate body

	if (!review_id) {
		errors.push('Please provide a review id.');
	}

	if (errors.length > 0) {
		return json({ message: 'Missing or invalid fields.', errors }, { status: 400 });
	}

	const prisma = locals.prisma as PrismaClient;

	try {
		// Update peer review to closed
		const peerReview: peer_reviews = await prisma.peer_reviews.update({
			where: {
				id: review_id
			},
			data: {
				status: 'closed'
			}
		});

		// Update all peer review assignments to closed
		await prisma.peer_review_assignments.updateMany({
			where: {
				peer_review_id: review_id
			},
			data: {
				status: 'closed'
			}
		});

		// Update all final scores to latest submission from every student

		// Get all students for the class
		const students = await prisma.class_students.findMany({
			where: {
				class_id: peerReview.class_id
			},
			select: {
				student_id: true
			}
		});

		// Get latest submission for each student
		await Promise.all(
			students.map(async (student) => {
				// Get latest submission for the current student
				const submission = await prisma.peer_review_submissions.findFirst({
					where: {
						student_id: student.student_id,
						peer_review_id: review_id
					},
					orderBy: {
						created_at: 'desc'
					},
					select: {
						score: true
					}
				});

				// Check if the student has a submission
				if (submission) {
					// Update the peer_review_assignment for the current student
					await prisma.peer_review_assignments.updateMany({
						where: {
							student_id: student.student_id,
							peer_review_id: review_id,
							status: 'closed'
						},
						data: {
							final_score: submission.score
						}
					});
				}
			})
		);

		// Update the

		return json(
			{ message: 'Successfully updated the peer review.', data: peerReview },
			{ status: 201 }
		);
	} catch (error) {
		console.error(error);
		return json({ message: 'Failed to update peer review.' }, { status: 500 });
	}
}
