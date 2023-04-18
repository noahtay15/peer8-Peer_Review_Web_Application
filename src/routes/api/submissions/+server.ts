import { json } from '@sveltejs/kit';
import type { PrismaClient, peer_review_submissions } from '@prisma/client';

export async function GET({ locals, url }: { locals: App.Locals; url: URL }) {
	const prisma = locals.prisma as PrismaClient;
	const email = locals.claims['email'];

	// Get URL params
	const page: string | null = decodeURIComponent(url.searchParams.get('page') || '');
	const peer_review_id: string | null = decodeURIComponent(
		url.searchParams.get('peer_review_id') || ''
	);
	const group_id: string | null = decodeURIComponent(url.searchParams.get('group_id') || '');

	// Sanitize parameters
	const sanitizedPage: number = page ? parseInt(page.trim()) : 0;
	const sanitizedPeerReviewId: number = peer_review_id ? parseInt(peer_review_id.trim()) : 0;
	const sanitizedGroupId: number = group_id ? parseInt(group_id.trim()) : 0;

	let submissions: peer_review_submissions[] = [];
	let total_length = 0;

	if (sanitizedGroupId === 0) {
		submissions = await prisma.peer_review_submissions.findMany({
			where: {
				peer_review_id: sanitizedPeerReviewId
			},
			include: {
				users: {
					select: {
						name: true,
						email: true
					}
				}
			},
			skip: sanitizedPage * 20,
			take: 20
		});

		total_length = await prisma.peer_review_submissions.count({
			where: {
				peer_review_id: sanitizedPeerReviewId
			}
		});
	} else {
		submissions = await prisma.peer_review_submissions.findMany({
			where: {
				peer_review_id: sanitizedPeerReviewId,
                peer_review_group_id: sanitizedGroupId
			},
			include: {
				users: {
					select: {
						name: true,
						email: true
					}
				}
			}
		});
	}

	return json(
		{
			message: 'Successfully retrieved peer review submissions.',
			data: {
				submissions,
				length: submissions.length,
				total_length,
				pages: Math.ceil(total_length / 20)
			}
		},
		{ status: 200 }
	);
}
