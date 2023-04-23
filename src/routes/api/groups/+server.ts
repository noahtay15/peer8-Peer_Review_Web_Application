import { json } from '@sveltejs/kit';
import type { PrismaClient } from '@prisma/client';

export async function GET({ locals, url }: { locals: App.Locals; url: URL }) {
	const prisma = locals.prisma as PrismaClient;
	const email = locals.claims['email'];

	// Get URL params
	const page: string | null = decodeURIComponent(url.searchParams.get('page') || '');
	const peer_review_id: string | null = decodeURIComponent(
		url.searchParams.get('peer_review_id') || ''
	);

	// Sanitize parameters
	const sanitizedPage: number = page ? parseInt(page.trim()) : 0;
	const sanitizedPeerReviewId: number = peer_review_id ? parseInt(peer_review_id.trim()) : 0;

	const groups = await prisma.peer_review_groups.findMany({
		where: {
			peer_review_id: sanitizedPeerReviewId
			/*AND: [
                {
                    peer_reviews: {
                        class_id: sanitizedClassId,
                    },
                },
            ],*/
		},
		skip: sanitizedPage * 20,
		take: 20
	});

	const total_length = await prisma.peer_review_groups.count({
		where: {
			peer_review_id: sanitizedPeerReviewId
			/*AND: [
                {
                    peer_reviews: {
                        class_id: sanitizedClassId,
                    },
                },
            ],*/
		}
	});

	return json(
		{
			message: 'Successfully retrieved groups.',
			data: { groups, length: groups.length, total_length, pages: Math.ceil(total_length / 20) }
		},
		{ status: 200 }
	);
}

export async function POST({ request, locals, url }: { request: Request, locals: App.Locals, url: URL }) {
    const prisma = locals.prisma as PrismaClient;
    const email = locals.claims['email'];

    const { peer_review_id } = await request.json();

    // Fetch all students participating in the peer review
    let students = await prisma.peer_review_assignments.findMany({
        where: {
            peer_review_id: parseInt(peer_review_id),
        },
        select: {
            student_id: true,
        },
    });

    // Delete any existing groups
    const grs = await prisma.peer_review_groups.deleteMany({
        where: {
            peer_review_id: parseInt(peer_review_id),
        },
    });

    if (grs.count > 0) {
        // re-create peer review assignments
        // get students
        const cls = await prisma.classes.findUnique({
            where: {
                id: parseInt(peer_review_id),
            },
            select: {
                id: true,
            },
        });

        const studs = await prisma.class_students.findMany({
            where: {
                class_id: cls?.id,
            },
            select: {
                student_id: true,
            },
        });

        for (const stud of studs) {
            await prisma.peer_review_assignments.create({
                data: {
                    student_id: stud.student_id,
                    peer_review_id: parseInt(peer_review_id),
                    status: 'assigned',
                },
            });
        }

        // Re-fetch students
        students = await prisma.peer_review_assignments.findMany({
            where: {
                peer_review_id: parseInt(peer_review_id),
            },
            select: {
                student_id: true,
            },
        });
    }


    // Shuffle the students array to randomize group assignments
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    const shuffledStudents = shuffle([...students]);

    // Determine the number of groups based on the number of students
    const number_of_groups = Math.ceil(Math.sqrt(shuffledStudents.length)) - 1;

    // Create new groups and assign students
    const groups = [];
    const studentsPerGroup = Math.floor(shuffledStudents.length / number_of_groups);
    const extraStudents = shuffledStudents.length % number_of_groups;

    let studentIndex = 0;

    console.log(shuffledStudents.length, number_of_groups, studentsPerGroup)
    for (let i = 0; i < number_of_groups; i++) {
        const newGroup = await prisma.peer_review_groups.create({
            data: {
                peer_review_id: parseInt(peer_review_id),
                name: `Group ${i + 1}`,
            },
        });

        const groupSize = studentsPerGroup + (i < extraStudents ? 1 : 0);

        for (let j = 0; j < groupSize; j++) {
            // console.log(shuffledStudents[studentIndex].student_id, peer_review_id)

            await prisma.peer_review_assignments.updateMany({
                where: {
                    student_id: shuffledStudents[studentIndex].student_id,
                    peer_review_id: parseInt(peer_review_id),
                },
                data: {
                    group_id: newGroup.id,
                },
            });

            studentIndex++;
        }

        groups.push(newGroup);
    }

    return json(
        {
            message: 'Successfully created and assigned groups',
            data: { groups },
        },
        { status: 200 }
    );
}

