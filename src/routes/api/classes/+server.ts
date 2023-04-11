import { json } from '@sveltejs/kit';
import type { PrismaClient } from '@prisma/client';
import type { Class } from '$lib/types/Classes';

export async function GET({ locals, url }: { locals: App.Locals, url: URL }) {
    const prisma = locals.prisma as PrismaClient;
    const email = locals.claims['email'];

    // Get URL params
    const page: string | null = decodeURIComponent(url.searchParams.get('page') || '');

    // Sanitize email and code parameters
    const sanitizedpage: number = page ? parseInt(page.trim()) : 0;

    // Get class data based on user type
    const user_type = (locals.claims['custom:user_type'] as string)?.toLowerCase();

    let classes: Class[] = [];
    let total_length = 0;

    if (user_type === "instructor") {
        classes = await getInstructorClassData(prisma, email as string, sanitizedpage);
        total_length = await getInstructorClassCount(prisma, email as string);
    } else if (user_type === "student") {
        classes = await getStudentClassData(prisma, email as string, sanitizedpage);
        total_length = await getStudentClassCount(prisma, email as string);
    }

    return json({ message: 'Successfully retrieved classes.', data: { classes, length: classes.length, total_length, pages: Math.ceil(total_length / 5) } }, { status: 200 });
}

async function getInstructorClassData(prisma: PrismaClient, email: string, page: number) {
    const sanitizedpage = page < 0 ? 0 : page;
    const instructor_classes: Class[] = [];

    const users = await prisma.users.findMany({
        where: {
            email: email as string,
        },
    });

    if (users.length === 0) {
        return [];
    }

    const classes = await prisma.classes.findMany({
        skip: sanitizedpage * 5,
        take: 5,
        where: {
            instructor_id: users[0].id,
        },
    });

    classes.forEach(class_data => {
        const classObj: Class = {
            id: class_data.id,
            name: class_data.name,
            code: class_data.code,
            created_at: class_data.created_at,
            updated_at: class_data.last_updated,
        };
        instructor_classes.push(classObj);
    });

    return instructor_classes;
}

async function getInstructorClassCount(prisma: PrismaClient, email: string) {
    const users = await prisma.users.findMany({
        where: {
            email,
        },
    });

    if (users.length === 0) {
        return 0;
    }

    const count = await prisma.classes.count({
        where: {
            instructor_id: users[0].id,
        },
    });

    return count;
}

async function getStudentClassData(prisma: PrismaClient, email: string, page: number) {
    const sanitizedpage = page < 0 ? 0 : page;
    const student_classes: Class[] = [];
  
    const users = await prisma.users.findMany({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });
  
    if (users.length === 0) {
      return [];
    }

    /*select: {
        classes: {
          select: {
            id: true,
            name: true,
            code: true,
            created_at: true,
            last_updated: true,
          },
        },
      },*/
  
    const class_students = await prisma.class_students.findMany({
      where: {
        student_id: users[0].id,
      },
      select: {
        classes: {
          select: {
            id: true,
            name: true,
            code: true,
            created_at: true,
            last_updated: true,
          },
        },
      },
    });

    
    class_students.forEach((class_student) => {
        const classObj: Class = {
            id: class_student.classes.id,
            name: class_student.classes.name,
            code: class_student.classes.code,
            created_at: class_student.classes.created_at,
            updated_at: class_student.classes.last_updated,
        };
        student_classes.push(classObj);
    });
    console.log(class_students);
  
    return student_classes;
  }
  
  async function getStudentClassCount(prisma: PrismaClient, email: string) {
    const users = await prisma.users.findMany({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });
  
    if (users.length === 0) {
      return 0;
    }
  
    const class_students_count = await prisma.class_students.count({
      where: {
        student_id: users[0].id,
      },
    });
  
    return class_students_count;
  }
  