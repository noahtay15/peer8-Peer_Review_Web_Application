import { json } from '@sveltejs/kit';
import type { PrismaClient } from '@prisma/client';

// POST /api/templates
interface NewQuestionInput {
	question: string;
	max_points: number;
}

interface NewTemplateInput {
	name: string;
	questions: NewQuestionInput[];
}

export async function POST({ request, locals, params }) {
	const body = (await request.json()) as NewTemplateInput;

	params;
	// Validate the input
	const { name, questions } = body;

	if (!name) {
		return json({ message: 'Please provide a name for the template.' }, { status: 400 });
	}

	// Check that there is at least one question
	if (!Array.isArray(questions) || questions.length === 0) {
		return json(
			{ message: 'Please provide at least one question for the template.' },
			{ status: 400 }
		);
	}

	// Calculate the max points for the template
	let max_points = 0;

	// Check that each question has a question and max points
	for (const question of questions) {
		if (!question.question) {
			return json({ message: 'Please provide a question for each question.' }, { status: 400 });
		}

		if (!question.max_points) {
			return json({ message: 'Please provide a max points for each question.' }, { status: 400 });
		}

		max_points += question.max_points;
	}

	const prisma = locals.prisma as PrismaClient;
	const email = locals.claims['email'];

	try {
		// Retrieve user
		const user = await prisma.users.findUnique({
			where: {
				email: email as string
			}
		});

		// Create the template and its questions in a transaction
		const newTemplate = await prisma.templates.create({
			data: {
				name,
				max_points,
				creator_id: user.id as number,
				questions: {
					createMany: {
						data: questions.map((q) => ({
							question: q.question,
							max_points: q.max_points
						}))
					}
				}
			},
			include: {
				questions: true
			}
		});

		return json({ message: 'Template created successfully.', data: newTemplate }, { status: 201 });
	} catch (error) {
		return json({ message: 'Error creating template.', error }, { status: 500 });
	}
}

// GET /api/templates
export async function GET({ locals, url }: { locals: App.Locals; url: URL }) {
	// Get URL params
	const page: string | null = decodeURIComponent(url.searchParams.get('page') || '');

	// Sanitize email and code parameters
	const sanitizedpage: number = page ? parseInt(page.trim()) : 0;

	const prisma = locals.prisma as PrismaClient;

	// User email
	const email = locals.claims['email'];

	try {
		// Retrieve user
		const user = await prisma.users.findUnique({
			where: {
				email: email as string
			}
		});


		// Retrieve paginated templates associated with the instructor that created them
		const templates = await prisma.templates.findMany({
			skip: sanitizedpage * 5,
			take: 5,
			where: {
				creator_id: user.id as number
			},
		});

		return json({ message: 'Retrieved templates successfully.', data: templates }, { status: 200 });
	} catch (error) {
		return json({ message: 'Error retrieving templates.', error }, { status: 500 });
	}
}
