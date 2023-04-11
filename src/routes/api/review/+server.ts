import type { PrismaClient, peer_reviews } from '@prisma/client';
import { json } from '@sveltejs/kit';

interface Question {
	id: number;
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
							peer_review_submissions: { create: [] },
							groups: { create: [] },
							peer_review_responses: {
								create: (
									(await prisma.templates.findFirst({
										where: { id: template_id },
										orderBy: { last_updated: 'desc' },
										select: { questions: { select: { id: true } } }
									})) as { questions: Question[] }
								).questions.map(({ id }) => ({
									question_id: id,
									score: null,
                  student_id
								}))
							}
						}))
					)
				}
			},
			include: { peer_review_assignments: { include: { peer_review_responses: true } } }
		});
		return json({ message: "Created a peer review.", data: peerReview }, { status: 201 });
	} catch (error) {
		console.error(error);
		return json({ message: 'Failed to create peer review.' }, { status: 500 });
	}
}
