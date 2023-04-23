import type { APIResponse } from "$lib/types/Generic";
import type { SubmissionRequest, SubmissionsRequest } from "$lib/types/Requests";

export interface ExtendedAPIResponse extends APIResponse {
    status: number;
}

export const resendConfirmationCode = async (email: string): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/verify?email=${email}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
};

export const confirmEmail = async (email: string, code: string): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch("/api/verify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            code,
        }),
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const login = async (email: string, password: string): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const signup = async (email: string, password: string, name: string, type: string, class_code: string): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch("/api/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
            name,
            class_code,
            type,
        }),
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}
export const refreshUser = async (): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
            "":""
        }),
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const getUser = async (): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch("/api/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}


export const getClasses = async (page = 0): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/classes?page=${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const createClass = async (data: any): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;
    
    let status = 0;

    await fetch("/api/class", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
        body: JSON.stringify(data),
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const getTemplates = async (page = 0): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/templates?page=${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const createTemplate = async (data: any): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/templates`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
        body: JSON.stringify(data)
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const getStudents = async (data: any): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/students?page=${data.page ? data.page : 0}&class_id=${data.class_id ? data.class_id : -1}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}


interface AddStudent {
    FirstName: string;
    LastName: string;
    Email: string;
}
interface AddStudentsRequest {
    class_id?: number;
    students: AddStudent[];
}


export const addStudents = async (data: AddStudentsRequest): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/class/student`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
        body: JSON.stringify(data)
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

interface DeleteStudent {
    student_id: number;
}
interface DeleteStudentsRequest {
    class_id?: number;
    students: DeleteStudent[];
}

export const deleteStudent = async (data: DeleteStudentsRequest): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/class/student`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
        body: JSON.stringify(data)
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

interface DeleteGroupRequest {
    group_id: number;
}

export const deleteGroup = async (data: DeleteGroupRequest): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/group`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
        body: JSON.stringify(data)
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

interface UnOmitSubmissionRequest {
    submission_id: number;
}

export const unomitSubmission = async (data: UnOmitSubmissionRequest): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/submission`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
        body: JSON.stringify(data)
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const forgotPassword = async (email: string): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/forgot?email=${email}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const resetPassword = async (data: any): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/forgot`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
        body: JSON.stringify(data)
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

interface OmitSubmissionRequest {
    submission_id: number;
}

export const omitSubmission = async (data: OmitSubmissionRequest): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/submission`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
        body: JSON.stringify(data)
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const getReview = async (data: any): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;

    await fetch(`/api/review?peer_review_id=${data.peer_review_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const getPeerReviews = async (data: any): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/reviews?page=${data.page ? data.page : 0}&class_id=${data.class_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const createGroup = async (data: any): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/group`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
        body: JSON.stringify(data)
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const fetchGroups = async (data: any): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/groups?page=${data.page}&peer_review_id=${data.peer_review_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

interface RandomizeGroupRequest {
    peer_review_id: number;
}

export const randomizeGroups = async (data: RandomizeGroupRequest): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;
    
    let status = 0;

    await fetch(`/api/groups`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
        body: JSON.stringify(data)
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}


export const getPeerReviewAssignments = async (data: any): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/assignments?class_id=${data.class_id}&page=${data.page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const getClassInfo = async (class_id: number): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/class?class_id=${class_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const getAssignment = async (assignment_id: number): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/assignment?id=${assignment_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

export const sendSubmission = async (data: SubmissionRequest): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/submission`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
        body: JSON.stringify(data)
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}


export const getSubmissions = async (data: SubmissionsRequest): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/submissions?page=${data.page}&peer_review_id=${data.peer_review_id}&group_id=${data.group_id ? data.group_id : 0}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}


interface PeerReviewRequest {
    name: string;
    template_id: number;
    due_date: string;
    class_id: number;
}

export const createPeerReview = async (data: PeerReviewRequest): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/review`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
        body: JSON.stringify(data)
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

interface EditPeerReviewRequest {
    name: string;
    due_date: string;
    review_id: number;
}

export const editPeerReview = async (data: EditPeerReviewRequest): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/review`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
        body: JSON.stringify(data)
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

interface ClosePeerReviewRequest {
    review_id: number;
}

export const closePeerReview = async (data: ClosePeerReviewRequest): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/review`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
        body: JSON.stringify(data)
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}

interface ScoresRequest {
    review_id: number;
    page: number;
    group_id?: number;
}

export const getScores = async (data: ScoresRequest): Promise<ExtendedAPIResponse> => {
    let res = {
        message: "Unknown error.",
        errors: [],
        data: null
    } as APIResponse;

    let status = 0;
    
    await fetch(`/api/report?review_id=${data.review_id}&page=${data.page}&group_id=${data.group_id ? data.group_id : 0}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            AuthorizationId: `Bearer ${localStorage.getItem("id_token")}`,
        },
    }).then(async (response) => {
        res = await response.json() as APIResponse;
        status = response.status;
    });

    return {
        status: status,
        ...res
    } as ExtendedAPIResponse;
}
