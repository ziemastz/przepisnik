import { ApiError, ApiResponseEnvelope } from './types';
import { tokenStorage } from './tokenStorage';
import constants from '../constants';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions<TBody> {
    method?: HttpMethod;
    body?: TBody;
    authenticated?: boolean;
    allowEmptyData?: boolean;
}

interface ParsedResponse<T> {
    envelope: ApiResponseEnvelope<T> | null;
    rawText: string;
}

const buildHeaders = (authenticated: boolean): HeadersInit => {
    const headers: Record<string, string> = {
        [constants.api.headers.contentType]: constants.api.headers.contentTypeValue,
    };

    if (authenticated) {
        const token = tokenStorage.getToken();
        if (token) {
            headers[constants.api.headers.authorization] = `${constants.api.headers.bearerPrefix}${token}`;
        }
    }

    return headers;
};

const parseEnvelope = async <T>(response: Response): Promise<ParsedResponse<T>> => {
    const text = await response.text();
    if (!text) {
        return {
            envelope: null,
            rawText: '',
        };
    }

    try {
        return {
            envelope: JSON.parse(text) as ApiResponseEnvelope<T>,
            rawText: text,
        };
    } catch {
        return {
            envelope: null,
            rawText: text,
        };
    }
};

const isHtmlLikeResponse = (rawText: string): boolean => {
    const normalized = rawText.trim().toLowerCase();
    return normalized.startsWith('<!doctype') || normalized.startsWith('<html') || normalized.startsWith('<');
};

const toTransportErrorMessage = (status: number, rawText: string): string => {
    if (status === 404 && isHtmlLikeResponse(rawText)) {
        return constants.api.errors.noApiConnection;
    }

    if (status === 401 && !rawText.trim()) {
        return constants.api.errors.unauthorizedConfig;
    }

    if (status >= 500) {
        return constants.api.errors.serverUnavailable;
    }

    return constants.api.errors.requestFailed;
};

const request = async <TData, TBody = undefined>(
    path: string,
    options: RequestOptions<TBody> = {},
): Promise<TData> => {
    const method = options.method ?? 'GET';
    const authenticated = options.authenticated ?? false;
    const allowEmptyData = options.allowEmptyData ?? false;

    let response: Response;

    try {
        response = await fetch(path, {
            method,
            headers: buildHeaders(authenticated),
            body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        });
    } catch {
        throw new ApiError(0, [constants.api.errors.noServerConnection]);
    }

    const parsedResponse = await parseEnvelope<TData>(response);
    const envelope = parsedResponse.envelope;

    if (!response.ok || envelope?.success === false) {
        const messages = envelope?.errorMessages?.length
            ? envelope.errorMessages
            : [toTransportErrorMessage(response.status, parsedResponse.rawText)];
        throw new ApiError(response.status, messages);
    }

    if (!envelope) {
        if (allowEmptyData) {
            return null as TData;
        }
        throw new ApiError(response.status, [constants.api.errors.missingPayload]);
    }

    if (envelope.data === null) {
        if (allowEmptyData) {
            return null as TData;
        }

        throw new ApiError(response.status, [constants.api.errors.missingPayload]);
    }

    return envelope.data;
};

export const apiClient = {
    get<TData>(path: string, authenticated = false): Promise<TData> {
        return request<TData>(path, { method: 'GET', authenticated });
    },
    post<TData, TBody>(path: string, body: TBody, authenticated = false): Promise<TData> {
        return request<TData, TBody>(path, { method: 'POST', body, authenticated });
    },
    postVoid<TBody>(path: string, body: TBody, authenticated = false): Promise<void> {
        return request<null, TBody>(path, {
            method: 'POST',
            body,
            authenticated,
            allowEmptyData: true,
        }).then(() => undefined);
    },
};
