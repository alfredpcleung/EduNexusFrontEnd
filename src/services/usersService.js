/**
 * User Service
 * Handles all user-related API calls (authentication, user creation, etc.)
 */
import { getApiUrl } from './api';
import { authenticatedFetch } from '../components/auth/auth-helper';

/**
 * List all users (Public endpoint)
 * @returns {Promise<Array>} - Array of user objects
 */
const list = async () => {
    try {
        let response = await fetch(getApiUrl('/users'), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    } catch (err) {
        console.log('List users error:', err);
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
        console.log('Read user error:', err);
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
        console.log('Update user error:', err);
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
        console.log('Delete user error:', err);
        throw err;
    }
};

export { list, read, update, remove };
