/**
 * User Service
 * Handles all user-related API calls (authentication, user creation, etc.)
 */
import { getApiUrl } from './api.js';
import { authenticatedFetch } from '../components/auth/auth-helper.js';

/**
 * List all users (Public endpoint)
 * @param {string} queryString - Query string for filtering/searching
 * @returns {Promise<Array>} - Array of user objects
 */
const list = async (queryString = "") => {
    try {
        const url = queryString 
            ? `${getApiUrl('/users')}?${queryString}`
            : getApiUrl('/users');
        
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });
        return await response.json();
    } catch (err) {
        // Optionally log to an error reporting service
        throw err;
    }
};

/**
 * Get a single user by ID (Public endpoint)
 * @param {string} uid - User ID
 * @returns {Promise<Object>} - User object
 */
const read = async (uid) => {
    try {
        let response = await fetch(getApiUrl(`/users/${uid}`), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    } catch (err) {
        // Optionally log to an error reporting service
        throw err;
    }
};

/**
 * Update an existing user (Auth required)
 * @param {string} uid - User ID
 * @param {Object} user - Updated user data
 * @returns {Promise<Object>} - Updated user object
 */
const update = async (uid, user) => {
    try {
        let response = await authenticatedFetch(getApiUrl(`/users/${uid}`), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        return await response.json();
    } catch (err) {
        // Optionally log to an error reporting service
        throw err;
    }
};

/**
 * Delete a user (Auth required)
 * @param {string} uid - User ID
 * @returns {Promise<Object>} - Server response
 */
const remove = async (uid) => {
    try {
        let response = await authenticatedFetch(getApiUrl(`/users/${uid}`), {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    } catch (err) {
        // Optionally log to an error reporting service
        throw err;
    }
};

export { list, read, update, remove };
