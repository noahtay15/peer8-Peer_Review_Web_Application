import { recalculateScores } from '$lib/utils/recalculateScores';
import type { peer_review_assignments } from '@prisma/client';
import { json } from '@sveltejs/kit';

export async function GET({ url, locals }: { url: URL; locals: App.Locals }) {
    const review_id = url.searchParams.get('review_id');
    const page = url.searchParams.get('page') || '0';
    const group_id: string | null = decodeURIComponent(url.searchParams.get('group_id') || '');

    if (!review_id) {
        return json({ message: 'Missing review_id query parameter.' }, { status: 400 });
    }

    const prisma = locals.prisma;
    const sanitizedPage = parseInt(page.trim()) | 0;
    const sanitizedGroupId = parseInt(group_id.trim()) | 0;

    try {

        // get peer review
        const review = await prisma.peer_reviews.findUnique({
            where: {
                id: parseInt(review_id)
            },
            include: {
                templates: {
                    select: {
                        max_points: true
                    }
                }
            }
        });

        let assignments: peer_review_assignments[] = [];

        if (sanitizedGroupId !== 0) {
            assignments = await prisma.peer_review_assignments.findMany({
                where: {
                    peer_review_id: parseInt(review_id),
                    group_id: sanitizedGroupId
                },
                select: {
                    final_score: true,
                    student_id: true
                },
                skip: sanitizedPage * 20,
                take: 20,
            });
        } else {
            assignments = await prisma.peer_review_assignments.findMany({
                where: {
                    peer_review_id: parseInt(review_id)
                },
                select: {
                    final_score: true,
                    student_id: true
                },
                skip: sanitizedPage * 20,
                take: 20,
            });
        }


        const assignmentData = await Promise.all(
            assignments.map(async (assignment) => {
                const student = await prisma.users.findUnique({
                    where: {
                        id: assignment.student_id
                    },
                    select: {
                        name: true,
                        email: true
                    }
                });

                return {
                    final_score: assignment.final_score,
                    student_name: student.name,
                    student_email: student.email,
                    max_score: review?.templates.max_points
                };
            })
        );

        const total_length = await prisma.peer_review_assignments.count({
            where: {
                peer_review_id: parseInt(review_id)
            }
        });

        return json({ message: 'Successfully fetched assignments data.', data: {
            assignments: assignmentData,
            length: assignmentData.length,
            total_length,
            pages: Math.ceil(total_length / 20)
        } });
    } catch (error) {
        console.error(error);
        return json({ message: 'Failed to fetch assignments data.' }, { status: 500 });
    }
}
