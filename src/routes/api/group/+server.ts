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

		// Update all prior submissions for all students in the list to point to the new group
		await Promise.all(
			student_ids.map(async (student_id: number) => {
				return await prisma.peer_review_submissions.updateMany({
					where: {
						student_id,
						peer_review_id
					},
					data: {
						peer_review_group_id: newGroup.id
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


// Delete group route

export async function DELETE({ request, locals }: { request: Request; locals: App.Locals }) {
	const body = await request.json();

	// Extract group_id from the request body
	const { group_id } = body;

	const errors: string[] = [];

	// Validate body
	if (!group_id) {
		errors.push('Missing group_id.');
	}

	if (errors.length > 0) {
		return json({ message: 'Missing or invalid fields.', errors }, { status: 400 });
	}

	const prisma = locals.prisma as PrismaClient;

	// Start a transaction
	const deletedGroupData = await prisma.$transaction(async (prisma) => {
		console.log(group_id);

		// Delete the group
		const deletedGroup = await prisma.peer_review_groups.delete({
			where: {
				id: group_id
			}
		});

		return {
			...deletedGroup
		};
	});

	return json(
		{
			message: 'Successfully deleted group.',
			data: { group: deletedGroupData }
		},
		{ status: 200 }
	);
}