import type { PrismaClient } from '@prisma/client';
import { recalculateScores } from '$lib/utils/recalculateScores';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }: { request: Request; locals: any }) {
	const body = await request.json();

	const { assignment_id, responses } = body;

	const prisma = locals.prisma as PrismaClient;
	const email = locals.claims['email'] as string;

	// Check if peer review is closed
	const peer_review = await prisma.peer_review_assignments.findFirst({
		where: {
			id: assignment_id
		},
		include: {
			peer_reviews: {
				select: {
					status: true
				}
			}
		}
	});

	if (!peer_review) {
		return json({ message: 'Assignment not found.' }, { status: 400 });
	}

	if (peer_review?.peer_reviews?.status === 'closed') {
		return json({ message: 'Peer review is closed.' }, { status: 400 });
	}

	// Check if peer review is over
	const assignment = await prisma.peer_review_assignments.findFirst({
		where: {
			id: assignment_id
		},
		include: {
			peer_reviews: {
				select: {
					due_date: true
				}
			}
		}
	});

	if (!assignment) {
		return json({ message: 'Assignment not found.' }, { status: 400 });
	}

	if (assignment?.peer_reviews?.due_date && assignment?.peer_reviews?.due_date < new Date()) {
		return json({ message: 'Peer review is over.' }, { status: 400 });
	}

	try {
		// Pull assignment so we can get the group id
		const assignment = await prisma.peer_review_assignments.findFirst({
			where: {
				id: assignment_id
			}
		});

		if (!assignment || !assignment.group_id) {
			return json(
				{ message: `Assignment not found or student does not have an associated group.` },
				{ status: 400 }
			);
		}

		// Get all students in the group
		const group = await prisma.users.findMany({
			where: {
				peer_review_assignments: {
					some: {
						group_id: assignment?.group_id
					}
				}
			}
		});

		// get user
		const user = await prisma.users.findFirst({
			where: {
				email: email
			}
		});

		// Check if the user already has a submission for this assignment
		let existingSubmission = await prisma.peer_review_submissions.findFirst({
			where: {
				peer_review_assignment_id: assignment_id,
				student_id: user?.id as number
			}
		});

		if (!existingSubmission) {
			// Create new submission
			existingSubmission = await prisma.peer_review_submissions.create({
				data: {
					peer_review_assignment_id: assignment_id,
					student_id: user?.id as number,
					peer_review_group_id: assignment?.group_id as number,
					peer_review_id: assignment?.peer_review_id as number
				}
			});
		} else {
			// Update existing submission
			await prisma.peer_review_submissions.update({
				where: {
					id: existingSubmission?.id as number
				},
				data: {
					last_updated: new Date()
				}
			});
		}

		// Check that each response object's score does not exceed the max score for the corresponding question
		const questions = await prisma.questions.findMany({
			where: { id: { in: responses.map((r: any) => r.question_id) } },
			select: { id: true, max_points: true }
		});

		for (const response of responses) {
			const question = questions.find((q) => q.id === response.question_id);

			if (!question) {
				return json(
					{ message: `Question ${response.question_id} not found in assignment ${assignment_id}` },
					{ status: 400 }
				);
			}

			for (const score of response.scores) {
				if (score.score > question.max_points) {
					return json(
						{ message: `Score for question ${question.id} exceeds max score` },
						{ status: 400 }
					);
				}
			}
		}

		// Create peer review responses if they don't already exist for a given submission
		await Promise.all(
			responses.flatMap(async (response: any) => {
				const existingResponse = await prisma.peer_review_responses.findFirst({
					where: {
						peer_review_submission_id: existingSubmission?.id as number,
						question_id: response.question_id
					}
				});

				if (!existingResponse) {
					await prisma.peer_review_responses.createMany({
						data: responses.flatMap((response: any) =>
							response.scores.map((score: any) => ({
								question_id: response.question_id,
								peer_review_assignment_id: assignment_id,
								student_id: score.student_id,
								score: score.score,
								comments: score.comment,
								peer_review_submission_id: existingSubmission?.id as number
							}))
						)
					});
				} else {
					// Go through each group member and update their score and comments
					await Promise.all(
						response.scores.map(async (score: any) => {
							await prisma.peer_review_responses.update({
								where: {
									id: existingResponse.id
								},
								data: {
									score: score.score,
									comments: score.comment
								}
							});
						})
					);
				}
			})
		);

		// Create peer review scores for each student in the group if they don't already exist

		await Promise.all(
			group.map(async (student) => {
				const existingScore = await prisma.peer_review_scores.findFirst({
					where: {
						submission_id: existingSubmission?.id as number,
						studentId: student.id,
						scorerId: user?.id as number
					}
				});

				if (!existingScore) {
					await prisma.peer_review_scores.create({
						data: {
							submission_id: existingSubmission?.id as number,
							studentId: student.id,
							scorerId: user?.id as number,
							score: getTotalScoreByStudentId(responses, student.id)
						}
					});
				} else {
					await prisma.peer_review_scores.update({
						where: {
							id: existingScore.id
						},
						data: {
							score: getTotalScoreByStudentId(responses, student.id)
						}
					});
				}
			})
		);

		// Recalculate scores
		await recalculateScores(prisma, assignment?.group_id as number);

		return json({ message: 'Successfully submitted peer review responses' }, { status: 201 });
	} catch (error) {
		console.error(error);
		return json({ message: 'Failed to submit.' }, { status: 500 });
	}
}

export async function PATCH({ request, locals }: { request: Request; locals: any }) {
	const body = await request.json();

	const { submission_id } = body;

	const prisma = locals.prisma as PrismaClient;
	// const email = locals.claims['email'] as string;

	// Unomit a submission
	const sub = await prisma.peer_review_submissions.update({
		where: {
			id: submission_id
		},
		data: {
			omit: false
		}
	});

	// Recalculate scores
	await recalculateScores(prisma, sub.peer_review_group_id as number);

	return json({ message: 'Successfully omitted peer review submission' }, { status: 200 });
}

export async function DELETE({ request, locals }: { request: Request; locals: any }) {
	const body = await request.json();

	const { submission_id } = body;

	const prisma = locals.prisma as PrismaClient;
	// const email = locals.claims['email'] as string;

	// Omit a submission
	const sub = await prisma.peer_review_submissions.update({
		where: {
			id: submission_id
		},
		data: {
			omit: true
		}
	});

	// Recalculate scores
	await recalculateScores(prisma, sub.peer_review_group_id as number);

	return json({ message: 'Successfully omitted peer review submission' }, { status: 200 });
}

function getTotalScoreByStudentId(responses: any, studentId: any) {
	let totalScore = 0;

	responses.forEach((response: any) => {
		const studentScore = response.scores.find((score: any) => score.student_id === studentId);

		if (studentScore) {
			totalScore += studentScore.score;
		}
	});

	return totalScore;
}
