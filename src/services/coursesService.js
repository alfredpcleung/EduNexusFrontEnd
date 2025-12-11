/**
 * Courses Service
 * Handles all course-related API calls (CRUD operations)
 */
import { getApiUrl } from './api';
import { getToken } from '../components/auth/auth-helper';

/**
 * List all courses
 * @returns {Promise<Array>} - Array of course objects
 */
const list = async () => {
    try {
        let response = await fetch(getApiUrl('/api/courses'), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    } catch (err) {
        console.log('List courses error:', err);
        throw err;
    }
};

/**
 * Get a single course by ID
 * @param {string|number} id - Course ID
 * @returns {Promise<Object>} - Course object
 */
const read = async (id) => {
    try {
        let response = await fetch(getApiUrl(`/api/courses/${id}`), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    } catch (err) {
        console.log('Read course error:', err);
        throw err;
    }
};

/**
 * Create a new course
 * @param {Object} course - Course data
 * @returns {Promise<Object>} - Created course object
 */
const create = async (course) => {
    try {
        let response = await fetch(getApiUrl('/api/courses'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(course)
        });
        return await response.json();
    } catch (err) {
        console.log('Create course error:', err);
        throw err;
    }
};

/**
 * Update an existing course
 * @param {string|number} id - Course ID
 * @param {Object} course - Updated course data
 * @returns {Promise<Object>} - Updated course object
 */
const update = async (id, course) => {
    try {
        let response = await fetch(getApiUrl(`/api/courses/${id}`), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(course)
        });
        return await response.json();
    } catch (err) {
        console.log('Update course error:', err);
        throw err;
    }
};

/**
 * Delete a course
 * @param {string|number} id - Course ID
 * @returns {Promise<Object>} - Server response
 */
const remove = async (id) => {
    try {
        let response = await fetch(getApiUrl(`/api/courses/${id}`), {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        });
        return await response.json();
    } catch (err) {
        console.log('Delete course error:', err);
        throw err;
    }
};

export { list, read, create, update, remove };
