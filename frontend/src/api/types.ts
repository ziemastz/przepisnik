export interface ApiResponseEnvelope<T> {
    success: boolean;
    errorMessages: string[];
    data: T | null;
}

export class ApiError extends Error {
    status: number;
    messages: string[];

    constructor(status: number, messages: string[] = []) {
        super(messages[0] ?? `Request failed with status ${status}.`);
        this.name = 'ApiError';
        this.status = status;
        this.messages = messages;
    }
}
