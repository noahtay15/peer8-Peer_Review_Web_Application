import { json } from '@sveltejs/kit';
import type { PrismaClient } from '@prisma/client';

// request to GET /api/assignment?id={peer_review_assignment}

export async function GET({ locals, url }: { locals: App.Locals; url: URL }) {
	const prisma = locals.prisma as PrismaClient;
	const email = locals.claims['email'] as string;

	const id = url.searchParams.get('id');

	const assignmentId = parseInt(id || '-1');

	const assignment = await prisma.peer_review_assignments.findFirst({
		where: {
			id: assignmentId,
			users: {
				email: email
			}
		},
		include: {
			peer_reviews: {
				include: {
					templates: {
						include: {
							questions: true
						}
					}
				}
			}
		}
	});

	const group = await prisma.users.findMany({
		where: {
			peer_review_assignments: {
				some: {
					group_id: assignment?.group_id
				}
			}
		},
	});

	if (!assignment?.group_id) {
		return json(
			{
				message: 'No group assigned.'
			},
			{ status: 400 }
		);
	}

	const groupInfo = await prisma.peer_review_groups.findUnique({
		where: {
			id: assignment?.group_id as number
		}
	});

	return json(
		{
			message: 'Successfully retrieved assignment.',
			data: {
				assignment: {
					id: assignment?.id,
					peer_review_id: assignment?.peer_review_id,
					status: assignment?.status,
					template: {
						id: assignment?.peer_reviews?.templates?.id,
						name: assignment?.peer_reviews?.templates?.name,
					},
					questions: assignment?.peer_reviews?.templates?.questions?.map((question) => {
						return {
							id: question.id,
							question: question.question,
							max_score: question.max_points
						};
					})
				},
				group: {
					id: assignment?.group_id,
					name: groupInfo?.name,
					students: group.map((student) => {
						return {
							id: student.id,
							name: student.name,
							email: student.email
						};
					})
				}
			}
		},
		{ status: 200 }
	);
}
