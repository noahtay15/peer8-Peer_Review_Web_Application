import type { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';

export async function GET({ locals, url }) {
	// Get URL params
	const page: string | null = decodeURIComponent(url.searchParams.get('page') || '');
	const class_id: string | null = decodeURIComponent(url.searchParams.get('class_id') || '');

	// Sanitize page parameter
	const sanitizedPage: number = page ? parseInt(page.trim()) : 0;
	const sanitizedClassId: number = class_id ? parseInt(class_id.trim()) : 0;

	// Prisma client
	const prisma = locals.prisma as PrismaClient;

	// Instructor
	const email = (locals.claims['email'] as string)?.toLowerCase();

	// Get instructor (instructor is given through user.id)
	const user = await prisma.users.findUnique({
		where: {
			email: email as string
		}
	});

	// Get all peer reviews created by the instructor
	const peerReviews = await prisma.peer_reviews.findMany({
		skip: sanitizedPage * 20,
		take: 20,
		where: {
			classes: {
				instructor_id: user?.id as number,
				id: sanitizedClassId || -1
			}
		}
	});

	// Update the peer reviews above to check if they are past the due date
	// If they are, then update the peer review to be completed
	peerReviews.forEach(async (peerReview) => {
		const dueDate = new Date(peerReview.due_date);
		const now = new Date();

		if (dueDate < now) {
			await prisma.peer_reviews.update({
				where: {
					id: peerReview.id
				},
				data: {
					status: 'closed'
				}
			});

			// Also update any peer review assignments that are still open
			await prisma.peer_review_assignments.updateMany({
				where: {
					peer_review_id: peerReview.id,
					status: 'assigned'
				},
				data: {
					status: 'closed'
				}
			});
		}
	});

	if (!peerReviews || peerReviews.length === 0) {
		return json({ message: 'No peer reviews found.' }, { status: 404 });
	}

	const total_length = await getPeerReviewsCount(prisma, user?.id as number);

	return json(
		{
			message: 'Peer reviews retrieved.',
			data: {
				peer_reviews: peerReviews,
				length: peerReviews.length,
				total_length,
				pages: Math.ceil(total_length / 20)
			}
		},
		{ status: 200 }
	);
}

async function getPeerReviewsCount(prisma: PrismaClient, instructorId: number) {
	// Get all peer reviews created by the instructor
	const peerReviews = await prisma.peer_reviews.findMany({
		where: {
			classes: {
				instructor_id: instructorId
			}
		}
	});

	return peerReviews.length;
}
