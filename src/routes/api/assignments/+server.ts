import { json } from '@sveltejs/kit';
import type { PrismaClient } from '@prisma/client';

export async function GET({ locals, url }: { locals: App.Locals, url: URL }) {
    const prisma = locals.prisma as PrismaClient;
    const email = locals.claims['email'] as string;

    // Get URL params
    const page: string | null = decodeURIComponent(url.searchParams.get('page') || '');
    const class_id: string | null = decodeURIComponent(url.searchParams.get('class_id') || '');

    // Sanitize parameters
    const sanitizedPage: number = page ? parseInt(page.trim()) : 0;
    const sanitizedClassId: number = class_id ? parseInt(class_id.trim()) : 0;

    const assignments = await prisma.peer_review_assignments.findMany({
        where: {
            users: {
                email: email,
            },
            peer_reviews: {
                class_id: sanitizedClassId,
            },
        },
        include: {
            peer_reviews: {
                select: {
                    name: true,
                    due_date: true,
                    status: true,
                    templates: {
                        select: {
                            max_points: true,
                        }
                    }
                },
            }
        },
        skip: sanitizedPage * 20,
        take: 20,
    });
    

    const total_length = await prisma.peer_review_assignments.count({
        where: {
            users: {
                email: email,
            },
            peer_reviews: {
                class_id: sanitizedClassId,
            },
        },
    });

    return json(
        {
            message: 'Successfully retrieved assignments.',
            data: { assignments, length: assignments.length, total_length, pages: Math.ceil(total_length / 20) },
        },
        { status: 200 }
    );
}
