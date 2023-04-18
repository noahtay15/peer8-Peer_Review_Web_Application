export interface SubmissionRequest {
    assignment_id: number;
    responses: SubmissionResponsesObject[]; 
}

export interface SubmissionResponsesObject {
    question_id: number;
    scores: SubmissionScoresObject[];
}

export interface SubmissionScoresObject {
    student_id: number;
    score: number;
    comment: string;
}

export interface SubmissionsRequest {
    peer_review_id: number;
    page: number;
    group_id?: number;
}