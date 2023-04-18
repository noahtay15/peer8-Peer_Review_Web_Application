import { json } from '@sveltejs/kit';
import type { Student } from '$lib/types/Classes';
import type { PrismaClient } from '@prisma/client';

export async function POST({ request, locals }: { request: Request, locals: any }) {
    const body = await request.json();

    const { name, students } = body as { name: string, students: Student[] };

    const emailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

    const errors: string[] = [];

    // Validate body
    if (!name) {
        errors.push('Please provide a class name.');
    }

    if (!students) {
        errors.push('Please provide a list of students.');
    }

    let invalidEmail = false;
    for (const student of students) {
        if (!student.Email) {
            errors.push('Please provide a name and email for each student.');
            break;
        }

        if (!emailRegex.test(student.Email)) {
            invalidEmail = true;
        }

        if (!student['First Name'] || !student['Last Name']) {
            errors.push('Please provide a name and email for each student.');
            break;
        }
    }

    if (invalidEmail) {
        errors.push('Please provide a valid email for each student.');
    }

    // Check for duplicate emails
    const emails = students.map(student => student.Email);
    const uniqueEmails = [...new Set(emails)];

    if (emails.length !== uniqueEmails.length) {
        errors.push('Please provide unique emails for each student.');
    }

    if (errors.length > 0) {
        return json({ message: "Missing or invalid fields.", errors }, { status: 400 });
    }

    const prisma = locals.prisma as PrismaClient;

    const instructorEmail = locals.claims["email"]; // Replace with actual instructor id
    let instructor_id = -1;

    try {
        const instructor = await prisma.users.findUnique({
            where: {
                email: instructorEmail as string
            }
        });

        if (!instructor) {
            return json({ message: "Instructor does not exist." }, { status: 400 });
        }

        instructor_id = instructor.id;
    } catch (error) {
        console.error(error);
        return json({ message: 'Error creating class.' }, { status: 500 });
    }

    // const classCode = generateClassCode(); // Function to generate a unique class code

    try {
        // Create class
        const newClass = await prisma.classes.create({
            data: {
                name,
                instructor_id: instructor_id,
            }
        });

        // Create students
        for (const student of students) {
            const existingUser = await prisma.users.findUnique({
                where: {
                    email: student.Email
                }
            });

            if (existingUser) {
                // User already exists
                await prisma.class_students.create({
                    data: {
                        class_id: newClass.id,
                        student_id: existingUser.id,
                        accepted: false
                    }
                });
            } else {
                // User does not exist, create new user
                const newUser = await prisma.users.create({
                    data: {
                        email: student.Email,
                        type: "student",
                        name: `${student['First Name']} ${student['Last Name']}`
                    }
                });

                await prisma.class_students.create({
                    data: {
                        class_id: newClass.id,
                        student_id: newUser.id,
                        accepted: false
                    }
                });
            }
        }
        return json({ message: 'Class created successfully.', data: newClass }, { status: 201 });
    } catch (error) {
        console.error(error);
        return json({ message: 'Error creating class.'}, { status: 500 });
    }
}

export async function GET({ locals, url }: { locals: App.Locals, url: URL }) {
    const prisma = locals.prisma as PrismaClient;
    
    // Get URL params
    const class_id: string | null = decodeURIComponent(url.searchParams.get('class_id') || '');

    // Sanitize parameters
    const sanitizedClassId: number = class_id ? parseInt(class_id.trim()) : 0;

    if (!sanitizedClassId) {
        return json({ message: "Missing or invalid class_id." }, { status: 400 });
    }

    try {
        const classInfo = await prisma.classes.findUnique({
            where: {
                id: sanitizedClassId,
            },
            /*include: {
                class_students: {
                    select: {
                        student_id: true,
                        users: {
                            select: {
                                id: true,
                                email: true,
                                name: true,
                            },
                        },
                    },
                },
            },*/
        });

        if (!classInfo) {
            return json({ message: "Class not found." }, { status: 404 });
        }

        return json({ message: 'Successfully retrieved class information.', data: classInfo }, { status: 200 });
    } catch (error) {
        console.error(error);
        return json({ message: 'Error retrieving class information.' }, { status: 500 });
    }
}
