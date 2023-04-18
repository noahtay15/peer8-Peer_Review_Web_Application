import type { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }: { request: Request; locals: any }) {
	const body = await request.json();

	const { assignment_id, responses } = body;

	const prisma = locals.prisma as PrismaClient;
	const email = locals.claims['email'] as string;

	// Check if peer review is closed
	const peer_review = await prisma.peer_review_assignments.findFirst({
		where: {
			id: assignment_id,
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
		return json({message: 'Assignment not found.'}, {status: 400});
	}

	if (peer_review?.peer_reviews?.status === 'closed') {
		return json({message: 'Peer review is closed.'}, {status: 400});
	}

	// Check if peer review is over
	const assignment = await prisma.peer_review_assignments.findFirst({
		where: {
			id: assignment_id,
		},
		include:{
			peer_reviews: {
				select: {
					due_date: true
				}
			}
		}
	});

	if (!assignment) {
		return json({message: 'Assignment not found.'}, {status: 400});
	}

	if (assignment?.peer_reviews?.due_date < new Date()) {
		return json({message: 'Peer review is over.'}, {status: 400});
	}

	try {
		// Pull assignment so we can get the group id
		const assignment = await prisma.peer_review_assignments.findFirst({
			where: {
				id: assignment_id
			}
		});

		if (!assignment || !assignment.group_id) {
			return json({ message: `Assignment not found or student does not have an associated group.` }, { status: 400 });
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

		// Create new submission
		const submission = await prisma.peer_review_submissions.create({
			data: {
				peer_review_assignment_id: assignment_id,
				student_id: user?.id as number,
				peer_review_group_id: assignment?.group_id as number,
				peer_review_id: assignment?.peer_review_id as number
			}
		});

		// Check that each response object's score does not exceed the max score for the corresponding question
		const questions = await prisma.questions.findMany({
			where: { id: { in: responses.map((r) => r.question_id) } },
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

		// Create peer review responses
		await prisma.peer_review_responses.createMany({
			data: responses.flatMap((response) =>
				response.scores.map((score) => ({
					question_id: response.question_id,
					peer_review_assignment_id: assignment_id,
					student_id: score.student_id,
					score: score.score,
					comments: score.comment,
					peer_review_submission_id: submission.id
				}))
			)
		});

		// Create peer review scores
		await Promise.all(
			group.map(async (student) => {
				await prisma.peer_review_scores.create({
					data: {
						submission_id: submission?.id,
						studentId: student.id,
						scorerId: user?.id as number,
						score: getTotalScoreByStudentId(responses, student.id)
					}
				});
			})
		);

		// Get most recent submission for each student in the group
		const submissions = await Promise.all(
			group.map(async (student) => {
				const submission = await prisma.peer_review_submissions.findFirst({
					where: {
						student_id: student.id,
						peer_review_group_id: assignment?.group_id as number
					},
					orderBy: {
						created_at: 'desc'
					},
					include: {
						peer_review_responses: true
					}
				});

				return submission;
			})
		);

		// Variable to track if all students have submitted
		let allCompleted = false;

		// Check that all students have submitted their reviews
		allCompleted = submissions.every((submission) => submission !== null);

		// Calculate and assign grades if all students have submitted
		if (allCompleted) {
			const allScores = [];

			// Filter by student
			group.map(async (student) => {
				// we need to use peer_review_scores to get the total score for each student and update
				await Promise.all(
					// Go through each student
					submissions.map(async (sb) => {
						// Get all scores for each student
						const scores = await prisma.peer_review_scores.findMany({
							where: {
								studentId: student.id,
								submission_id: sb?.id
							}
						});

						scores.map((score) => allScores.push(score));
					})
				);

				const scores = allScores.filter((score) => score.studentId === student.id);

				// get average
				const average = scores.reduce((acc, score) => acc + score.score, 0) / scores.length;

				console.log(average);

				// get the correct submission to update
				const sub = submissions.filter((sbs) => sbs?.student_id === student.id)[0];

				// update the submission
				await prisma.peer_review_submissions.update({
					where: {
						id: sub?.id
					},
					data: {
						score: average
					}
				});

				// Update peer review assignment final_score
				await prisma.peer_review_assignments.updateMany({
					where: {
					 	student_id: student.id,
						peer_review_id: sub?.peer_review_id as number
					},
					data: {
						final_score: average
					}
				});
			});
		}

		return json(
			{ message: 'Successfully submitted peer review responses' },
			{ status: 201 }
		);
	} catch (error) {
		console.error(error);
		return json({ message: 'Failed to submit.' }, { status: 500 });
	}
}

function getTotalScoreByStudentId(responses, studentId) {
	let totalScore = 0;

	responses.forEach((response) => {
		const studentScore = response.scores.find((score) => score.student_id === studentId);

		if (studentScore) {
			totalScore += studentScore.score;
		}
	});

	return totalScore;
}