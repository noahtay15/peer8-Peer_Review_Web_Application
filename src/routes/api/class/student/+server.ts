import { json } from '@sveltejs/kit';
import type { PrismaClient } from '@prisma/client';

export async function DELETE({ request, locals }: { request: Request, locals: any }) {
    const body = await request.json();

    const { emails, classId } = body as { emails: string[], classId: number };

    const errors: string[] = [];

    // Validate body
    if (!classId) {
        errors.push('Please specify a class to remove students from.');
    }

    if (!emails || emails.length === 0) {
        errors.push('Please provide at least one student email to remove.');
    }

    if (errors.length > 0) {
        return json({ message: "Missing or invalid fields.", errors }, { status: 400 });
    }

    // Prisma client
    const prisma = locals.prisma as PrismaClient;

    // Get email based on token
    const instructor_email = (locals.claims['email'] as string)?.toLowerCase();

    try {
        const user = await prisma.users.findUnique({
            where: {
                email: instructor_email,
            },
        });

        // Get the class and students to be removed
        const classObj = await prisma.classes.findFirst({
            where: {
                id: classId,
                instructor_id: user?.id || -1,
            },
            include: {
                class_students: {
                    where: {
                        users: {
                            email: {
                                in: emails,
                            },
                        },
                    },
                },
            },
        });

        if (!classObj) {
            return json({ message: "Class not found." }, { status: 404 });
        }

        const studentsToRemove = classObj.class_students.map(cs => cs.student_id);

        // Remove the students from the class
        await prisma.class_students.deleteMany({
            where: {
                class_id: classId,
                student_id: {
                    in: studentsToRemove,
                },
            },
        });
    } catch (error) {
        return json({ message: "Error removing students from class.", error }, { status: 500 });
    }

    return json({
        message: "Students removed from class.",
    }, { status: 200 });
}


export async function POST({ request, locals }) {
    const body = await request.json();

    const { emails, classId } = body as { emails: string[], classId: number };

    const errors: string[] = [];

    // Validate body
    if (!emails || emails.length === 0) {
        errors.push('Please provide student emails to add.');
    }

    if (!classId) {
        errors.push('Please specify a class to add students to.');
    }

    if (errors.length > 0) {
        return json({ message: "Missing or invalid fields.", errors }, { status: 400 });
    }

    // Prisma client
    const prisma = locals.prisma as PrismaClient;

    // Get email based on token
    const instructor_email = (locals.claims['email'] as string)?.toLowerCase();

    try {
        const user = await prisma.users.findUnique({
            where: {
                email: instructor_email,
            },
        });

        // Get the class to add students to
        const classObj = await prisma.classes.findFirst({
            where: {
                id: classId,
                instructor_id: user?.id || -1,
            },
        });

        if (!classObj) {
            return json({ message: "Class not found." }, { status: 404 });
        }

        const uniqueEmails = [...new Set(emails)];

        // Get user objects for each email address
        const studentsToAdd = await Promise.all(uniqueEmails.map(async (email) => {
            const student = await prisma.users.findUnique({
                where: {
                    email: email.toLowerCase(),
                },
            });

            if (!student) {
                errors.push(`User with email ${email} not found.`);
            }

            return student;
        }));

        // Filter out any null or undefined students
        const validStudents = studentsToAdd.filter(student => student != null);

        // Create the new class-student relations
        const newClassStudents = validStudents.map(student => {
            return {
                class_id: classId,
                student_id: student?.id as number,
                accepted: false,
            };
        });

        // Insert the new students into the class
        await prisma.class_students.createMany({
            data: newClassStudents,
            skipDuplicates: true,
        });

        if (errors.length > 0) {
            return json({ message: "Errors encountered while adding students.", errors }, { status: 400 });
        }

        return json({
            message: "Students added to class.",
        }, { status: 200 });

    } catch (error) {
        return json({ message: "Error adding students to class.", error }, { status: 500 });
    }
}
