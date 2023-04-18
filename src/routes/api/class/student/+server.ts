import { json } from '@sveltejs/kit';
import type { PrismaClient } from '@prisma/client';

interface DeleteStudent {
	student_id: number;
}

export async function DELETE({ request, locals }) {
	const body = await request.json();

	const { students, class_id } = body as { students: DeleteStudent[]; class_id: number };

	const errors: string[] = [];

	// Validate body
	if (!students || students.length === 0) {
		errors.push('Please provide student emails to add.');
	}

	if (!class_id) {
		errors.push('Please specify a class to add students to.');
	}

	for (const student of students) {
		if (!student.student_id) {
			errors.push('Please provide a valid id for each student.');
		}
	}

	if (errors.length > 0) {
		return json({ message: 'Missing or invalid fields.', errors }, { status: 400 });
	}

	// Prisma client
	const prisma = locals.prisma as PrismaClient;

	// Get email based on token
	const instructor_email = (locals.claims['email'] as string)?.toLowerCase();

	try {
		const user = await prisma.users.findUnique({
			where: {
				email: instructor_email
			}
		});

		// Get the class to add students to
		const classObj = await prisma.classes.findFirst({
			where: {
				id: class_id,
				instructor_id: user?.id || -1
			}
		});

		if (!classObj) {
			return json({ message: 'Class not found.' }, { status: 404 });
		}

		// Delete students from the class
		await prisma.class_students.deleteMany({
			where: {
				class_id: class_id,
				student_id: {
					in: students.map((s) => s.student_id)
				}
			}
		});

		// Get peer_review_assignments for the deleted students in the specified class
		const peerReviewAssignments = await prisma.peer_review_assignments.findMany({
			where: {
				student_id: {
					in: students.map((s) => s.student_id)
				},
				peer_reviews: {
					class_id: class_id
				}
			}
		});

		// Delete peer_review_responses for the deleted students
		await prisma.peer_review_responses.deleteMany({
			where: {
				peer_review_assignment_id: {
					in: peerReviewAssignments.map((assignment) => assignment.id)
				}
			}
		});

		// Delete peer_review_submissions for the deleted students
		await prisma.peer_review_submissions.deleteMany({
			where: {
				peer_review_assignment_id: {
					in: peerReviewAssignments.map((assignment) => assignment.id)
				}
			}
		});

		// Delete peer_review_assignments for the deleted students
		await prisma.peer_review_assignments.deleteMany({
			where: {
				id: {
					in: peerReviewAssignments.map((assignment) => assignment.id)
				}
			}
		});

		if (errors.length > 0) {
			return json(
				{ message: 'Errors encountered while deleting students.', errors },
				{ status: 400 }
			);
		}

		return json(
			{
				message: 'Students deleted from class.'
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);

		return json({ message: 'Error deleting students to class.', error }, { status: 500 });
	}
}

interface Student {
	Email: string;
	FirstName: string;
	LastName: string;
}

export async function POST({ request, locals }) {
	const body = await request.json();

	const { students, class_id } = body as { students: Student[]; class_id: number };

	const errors: string[] = [];

	// Validate body
	if (!students || students.length === 0) {
		errors.push('Please provide student emails to add.');
	}

	if (!class_id) {
		errors.push('Please specify a class to add students to.');
	}

	for (const student of students) {
		if (!student.Email) {
			errors.push('Please provide a valid email address for each student.');
		}

		if (!student['FirstName'] || !student['LastName']) {
			errors.push('Please provide a name for each student.');
		}
	}

	// Check for duplicate emails
	const emails = students.map((student) => student.Email);
	const uniqueEmails = [...new Set(emails)];

	if (emails.length !== uniqueEmails.length) {
		errors.push('Please provide unique emails for each student.');
	}

	if (errors.length > 0) {
		return json({ message: 'Missing or invalid fields.', errors }, { status: 400 });
	}

	// Prisma client
	const prisma = locals.prisma as PrismaClient;

	// Get email based on token
	const instructor_email = (locals.claims['email'] as string)?.toLowerCase();

	try {
		const user = await prisma.users.findUnique({
			where: {
				email: instructor_email
			}
		});

		// Get the class to add students to
		const classObj = await prisma.classes.findFirst({
			where: {
				id: class_id,
				instructor_id: user?.id || -1
			}
		});

		if (!classObj) {
			return json({ message: 'Class not found.' }, { status: 404 });
		}

		// Get or create user objects for each email address
		const studentsToAdd = await Promise.all(
			students.map(async (s) => {
				let student = await prisma.users.findUnique({
					where: {
						email: s.Email.toLowerCase()
					}
				});

				if (!student) {
					// Create temporary user
					student = await prisma.users.create({
						data: {
							email: s.Email.toLowerCase(),
							type: 'student',
							name: `${s['FirstName']} ${s['LastName']}`
						}
					});
				}

				return student;
			})
		);

		// Filter out any null or undefined students
		const validStudents = studentsToAdd.filter((student) => student != null);

		// Create the new class-student relations
		const newClassStudents = validStudents.map((student) => {
			return {
				class_id: class_id,
				student_id: student?.id as number,
				accepted: false
			};
		});

		// Insert the new students into the class
		await prisma.class_students.createMany({
			data: newClassStudents,
			skipDuplicates: true
		});

		if (errors.length > 0) {
			return json(
				{ message: 'Errors encountered while adding students.', errors },
				{ status: 400 }
			);
		}

		return json(
			{
				message: 'Students added to class.'
			},
			{ status: 200 }
		);
	} catch (error) {
		return json({ message: 'Error adding students to class.', error }, { status: 500 });
	}
}
