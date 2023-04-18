import type { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';

export async function GET({ locals, url }) {
	// Get URL params
	const page: string | null = decodeURIComponent(url.searchParams.get('page') || '');

	// Get class
	const class_id: string | null = decodeURIComponent(url.searchParams.get('class_id') || '');

	// Sanitize email and code parameters
	const sanitizedPage: number = page ? parseInt(page.trim()) : 0;

	// Sanitize classId
	const sanitizedClassId: number = class_id ? parseInt(class_id.trim()) : 0;

	const errors: string[] = [];

	// Validate body
	if (!class_id) {
		errors.push('Missing class_id.');
	}

	if (errors.length > 0) {
		return json({ message: 'Missing or invalid fields.', errors }, { status: 400 });
	}

	// Prisma client
	const prisma = locals.prisma as PrismaClient;

    // Instructor
    const email = (locals.claims['email'] as string)?.toLowerCase();

    // Get instructor (instructor is given through user.id)

    const user = await prisma.users.findUnique({
        where: {
            email: email as string,
        },
    });

	// Get the class_students with a particular classId and instructorId
	const classStudents = await prisma.class_students.findMany({
		skip: sanitizedPage * 20,
		take: 20,
		where: {
			class_id: sanitizedClassId,
			classes: {
				instructor_id: user?.id,
			},
		},
		include: {
			users: true,
		},
	});

	if (!classStudents || classStudents.length === 0) {
		return json({ message: 'Class not found or no students in the class.' }, { status: 404 });
	}

    const total_length = await getStudentsCount(prisma, sanitizedClassId, user?.id as number);

	return json(
		{
			message: 'Students retrieved.',
            data: { students: classStudents.map((cs) => cs.users), length: classStudents.length, total_length, pages: Math.ceil(total_length / 20)}
		},
		{ status: 200 }
	);
}

async function getStudentsCount(prisma: PrismaClient, classId: number, instructorId: number) {
	const students = await prisma.class_students.findMany({
		where: {
			class_id: classId,
			classes: {
				instructor_id: instructorId,
			},
		},
	});

	return students.length;
}
