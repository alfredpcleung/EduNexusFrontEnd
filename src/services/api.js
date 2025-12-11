/**
 * API URL Helper
 * Constructs the correct API URL based on the environment (development or production)
 * 
 * In development mode:
 *   - Returns `/api${path}` for Vite proxy to forward to http://localhost:3000
 * 
 * In production mode:
 *   - Prepends VITE_API_BASE_URL from environment variables
 *   - Supports both http/https URLs
 * 
 * @param {string} path - The API endpoint path (e.g., '/users', '/courses/1')
 * @returns {string} - The full API URL
 */
export const getApiUrl = (path) => {
    const isDevelopment = import.meta.env.MODE === 'development';
    
    if (isDevelopment) {
        // In development, use relative paths prefixed with /api for Vite proxy
        return `/api${path}`;
    } else {
        // In production, prepend the base URL from environment variables
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        
        if (!baseUrl) {
            console.warn(
                'VITE_API_BASE_URL is not defined in production environment. ' +
                'Falling back to relative path. This may cause CORS issues. ' +
                'Please set VITE_API_BASE_URL in your .env or .env.production file.'
            );
            return `/api${path}`;
        }
        
        // Remove trailing slash from baseUrl if present to avoid double slashes
        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        return `${cleanBaseUrl}${path}`;
    }
};
