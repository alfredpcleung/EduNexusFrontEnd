/**
 * User Service
 * Handles all user-related API calls (authentication, user creation, etc.)
 */
import { getApiUrl } from './api';
import { getToken } from '../components/auth/auth-helper';

/**
 * Sign in a user
 * @param {Object} user - User credentials (email, password)
 * @returns {Promise<Object>} - Server response with user data or error
 */
const signin = async (user) => {
    try {
        let response = await fetch(getApiUrl('/auth/signin'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        return await response.json();
    } catch (err) {
        console.log('Signin error:', err);
        throw err;
    }
};

/**
 * Create a new user (register)
 * @param {Object} user - User data (name, email, password, etc.)
 * @returns {Promise<Object>} - Server response with created user data or error
 */
const create = async (user) => {
    try {
        let response = await fetch(getApiUrl('/users'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        return await response.json();
    } catch (err) {
        console.log('User creation error:', err);
        throw err;
    }
};

/**
 * List all users (admin only)
 * @returns {Promise<Array>} - Array of user objects
 */
const list = async () => {
    try {
        let response = await fetch(getApiUrl('/users'), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        });
        return await response.json();
    } catch (err) {
        console.log('List users error:', err);
        throw err;
    }
};

/**
 * Get a single user by ID
 * @param {string} uid - User ID
 * @returns {Promise<Object>} - User object
 */
const read = async (uid) => {
    try {
        let response = await fetch(getApiUrl(`/users/${uid}`), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        });
        return await response.json();
    } catch (err) {
        console.log('Read user error:', err);
        throw err;
    }
};

/**
 * Update an existing user
 * @param {string} uid - User ID
 * @param {Object} user - Updated user data
 * @returns {Promise<Object>} - Updated user object
 */
const update = async (uid, user) => {
    try {
        let response = await fetch(getApiUrl(`/users/${uid}`), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
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
 * Delete a user (admin only)
 * @param {string} uid - User ID
 * @returns {Promise<Object>} - Server response
 */
const remove = async (uid) => {
    try {
        let response = await fetch(getApiUrl(`/users/${uid}`), {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        });
        return await response.json();
    } catch (err) {
        console.log('Delete user error:', err);
        throw err;
    }
};

export { signin, create, list, read, update, remove };
