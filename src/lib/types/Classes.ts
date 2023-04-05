export interface Class {
    id: number;
    code: string;
    name: string;
    updated_at: Date;
    created_at: Date;
}

export interface ClassData {
    classes: Class[];
    length: number;
    total_length: number;
}

export interface Student {
    email: string;
}


export interface StudentData {
    students: Student[];
}