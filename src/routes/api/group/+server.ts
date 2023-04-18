import type { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }: { request: Request; locals: App.Locals }) {
	const body = await request.json();

	// Extract peer_review_id and student_ids from the request body
	const { name, peer_review_id, student_ids } = body;

	const errors: string[] = [];

	// Validate body
	if (!peer_review_id || !student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
		errors.push('Missing peer_review_id or student_ids.');
	}

	if (errors.length > 0) {
		return json({ message: 'Missing or invalid fields.', errors }, { status: 400 });
	}

	const prisma = locals.prisma as PrismaClient;

	// Start a transaction
	const newGroupData = await prisma.$transaction(async (prisma) => {
		// Create a new group with the provided peer_review_id
		const newGroup = await prisma.peer_review_groups.create({
			data: {
				peer_review_id: peer_review_id,
				name: name
			}
		});

		// Update assignments for all students in the list to point to the new group
		await Promise.all(
			student_ids.map(async (student_id: number) => {
				return await prisma.peer_review_assignments.updateMany({
					where: {
						student_id,
						peer_review_id
					},
					data: {
						group_id: newGroup.id
					}
				});
			})
		);

		return {
			...newGroup
		};
	});

	return json(
		{
			message: 'Successfully retrieved new group.',
			data: { group: newGroupData }
		},
		{ status: 200 }
	);
}
