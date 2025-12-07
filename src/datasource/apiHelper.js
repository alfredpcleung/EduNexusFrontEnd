/**
 * Helper function to construct API URLs
 * In development: uses relative paths for Vite proxy (/api/...)
 * In production: prepends VITE_API_BASE_URL from environment variables
 * @param {string} path - The API path (e.g., '/users', '/courses/1')
 * @returns {string} - The full API URL
 */
export const getApiUrl = (path) => {
    const isDevelopment = !import.meta.env.PROD;
    
    if (isDevelopment) {
        // In development, use relative paths for Vite proxy
        return path;
    } else {
        // In production, prepend the base URL from environment variables
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        if (!baseUrl) {
            console.warn('VITE_API_BASE_URL is not defined in production environment');
            return path; // Fallback to relative path
        }
        return `${baseUrl}${path}`;
    }
};
