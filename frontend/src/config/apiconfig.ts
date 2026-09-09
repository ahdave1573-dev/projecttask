import axios, { Method } from 'axios';

// Use environment variable for backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ==========================================
// PROGRAMMER CONDITION FOR STATIC DATA
// ==========================================
// Set this to `true` if you want to use the live API (backend). Set to `false` if API is off and you need static UI.
export const USE_BACKEND_API = true;

export const makeApiCall = async (
    method: Method | string,
    endpoint: string,
    data: any = null,
    isFormData: boolean = false
) => {
    try {
        const cleanBaseUrl = API_BASE_URL.replace(/\/+$/, '');
        const cleanEndpoint = endpoint.replace(/^\/+/, '');
        const finalUrl = cleanBaseUrl ? `${cleanBaseUrl}/${cleanEndpoint}` : `/${cleanEndpoint}`;

        const headers: Record<string, string> = {};
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        const axiosConfig: any = {
            method,
            url: finalUrl,
            headers,
            withCredentials: true,
            timeout: 10000,
        };

        if (data !== null && data !== undefined) {
            axiosConfig.data = data;
        }

        const response = await axios(axiosConfig);

        return {
            data: response.data
        };

    } catch (error: any) {
        // Suppress 404 errors from logging to prevent Next.js from displaying them
        if (error?.response?.status !== 404) {
            console.warn(`[API Error] Request failed for ${endpoint}:`, error?.response?.data || error.message);
        }

        return {
            data: null,
            message: error?.response?.data?.message || error.message || 'API Call Failed'
        };
    }
};