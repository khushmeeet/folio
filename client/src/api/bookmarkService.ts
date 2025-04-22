import { Bookmark } from "../components/BookmarkTable";

// Define the API base URL using environment variables with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Type for the bookmark response from the server
export interface BookmarkResponse {
    id: number;
    url: string;
    title: string | null;
    description: string | null;
    archived: boolean;
    created_at: string;
}

// Convert API response to client Bookmark format
const convertToBookmark = (response: BookmarkResponse): Bookmark => ({
    id: response.id.toString(),
    url: response.url,
    title: response.title || response.url,
    description: response.description || "",
    archived: response.archived,
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
        credentials: 'include',  // Include cookies and auth headers
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

// Fetch bookmarks based on archived status
export const fetchBookmarks = async (archived: boolean = false): Promise<Bookmark[]> => {
    try {
        const url = `/bookmarks/?archived=${archived}`;
        const data = await apiRequest<BookmarkResponse[]>(url);
        return data.map(convertToBookmark);
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        throw error;
    }
};

// Create a new bookmark
export const createBookmark = async (url: string): Promise<Bookmark> => {
    try {
        const data = await apiRequest<BookmarkResponse>("/bookmarks/", {
            method: "POST",
            body: JSON.stringify({ url }),
        });
        return convertToBookmark(data);
    } catch (error) {
        console.error("Error creating bookmark:", error);
        throw error;
    }
};

// Archive a bookmark
export const archiveBookmark = async (id: string): Promise<Bookmark> => {
    try {
        const data = await apiRequest<BookmarkResponse>(`/bookmarks/${id}/archive`, {
            method: "PATCH",
        });
        return convertToBookmark(data);
    } catch (error) {
        console.error("Error archiving bookmark:", error);
        throw error;
    }
};
