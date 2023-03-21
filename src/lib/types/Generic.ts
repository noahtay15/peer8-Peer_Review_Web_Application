export interface APIResponse {
    message: string;
    errors: string[];
    data: unknown | null;
}