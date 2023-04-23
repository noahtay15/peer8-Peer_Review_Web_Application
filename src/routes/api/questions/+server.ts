import { json } from '@sveltejs/kit';
import type { PrismaClient } from '@prisma/client';

export async function GET({ locals, url }: { locals: App.Locals; url: URL }) {
	const prisma = locals.prisma as PrismaClient;

	// Get URL params
	const page: string | null = decodeURIComponent(url.searchParams.get('page') || '');
	const template_id: string | null = decodeURIComponent(
		url.searchParams.get('template_id') || ''
	);

	// Sanitize parameters
	const sanitizedPage: number = page ? parseInt(page.trim()) : 0;
	const sanitizedTemplateId: number = template_id ? parseInt(template_id.trim()) : 0;

	const questions = await prisma.questions.findMany({
        where: {
            template_id: sanitizedTemplateId,
        },
        skip: sanitizedPage * 20,
        take: 20,
    });

	const total_length = await prisma.questions.count({
        where: {
            template_id: sanitizedTemplateId,
        },
    });

	return json(
		{
			message: 'Successfully retrieved groups.',
			data: { questions, length: questions.length, total_length, pages: Math.ceil(total_length / 20) }
		},
		{ status: 200 }
	);
}