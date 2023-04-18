export interface Class {
    id: number;
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
    "Email": string;
    "First Name": string;
    "Last Name": string;
}


export interface StudentData {
    students: Student[];
}