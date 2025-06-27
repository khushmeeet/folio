// Define the API base URL using environment variables with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Type for the pocket link response from the server
export interface PocketLinkResponse {
    id: number;
    title: string | null;
    url: string;
    time_added: number;  // Unix timestamp
    tags: string | null;
    status: string;
    created_at: string;
}

// Type for the client PocketLink format
export interface PocketLink {
    id: string;
    title: string;
    url: string;
    time_added: number;
    tags: string | null;
    status: string;
    created_at: string;
}

// Convert API response to client PocketLink format
const convertToPocketLink = (response: PocketLinkResponse): PocketLink => ({
    id: response.id.toString(),
    title: response.title || response.url,
    url: response.url,
    time_added: response.time_added,
    tags: response.tags,
    status: response.status,
    created_at: response.created_at,
});

// Custom error class to include API response details
export class ApiError extends Error {
    status: number;
    detail?: string;

    constructor(status: number, message: string, detail?: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.detail = detail;
    }
}

// Helper function for API requests
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    });

    if (!response.ok) {
        // Try to get detailed error information from response
        let errorDetail: string | undefined;
        try {
            const errorData = await response.json();
            errorDetail = errorData.detail;
        } catch {
            // If we can't parse the error as JSON, continue without detail
        }

        throw new ApiError(response.status, `API request failed with status ${response.status}`, errorDetail);
    }

    return (await response.json()) as T;
}

// Fetch pocket links based on status filter
export const fetchPocketLinks = async (statusFilter: string = "unread"): Promise<PocketLink[]> => {
    try {
        const url = `/pocket-links/?status_filter=${statusFilter}`;
        const data = await apiRequest<PocketLinkResponse[]>(url);
        return data.map(convertToPocketLink);
    } catch (error) {
        console.error("Error fetching pocket links:", error);
        throw error;
    }
};
