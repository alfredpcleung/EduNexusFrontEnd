/**
 * Courses Service
 * Handles all course-related API calls (CRUD operations)
 */
import { getApiUrl } from './api';
import { authenticatedFetch } from '../components/auth/auth-helper';

/**
 * List all courses (Public endpoint)
 * @returns {Promise<Array>} - Array of course objects
 */
const list = async () => {
    try {
        let response = await fetch(getApiUrl('/courses'), {
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
 * Get a single course by ID (Public endpoint)
 * @param {string|number} id - Course ID
 * @returns {Promise<Object>} - Course object
 */
const read = async (id) => {
    try {
        let response = await fetch(getApiUrl(`/courses/${id}`), {
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
 * Create a new course (Auth required)
 * @param {Object} course - Course data
 * @returns {Promise<Object>} - Created course object
 */
const create = async (course) => {
    try {
        let response = await authenticatedFetch(getApiUrl('/courses'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(course)
        });
        
        const data = await response.json();
        
        // Check for HTTP errors
        if (!response.ok) {
            if (response.status === 403) {
                data.message = data.message || 'You do not have permission to create courses.';
            }
            throw { status: response.status, ...data };
        }
        
        return data;
    } catch (err) {
        console.log('Create course error:', err);
        throw err;
    }
};

/**
 * Update an existing course (Auth + Ownership required)
 * @param {string|number} id - Course ID
 * @param {Object} course - Updated course data
 * @returns {Promise<Object>} - Updated course object
 */
const update = async (id, course) => {
    try {
        let response = await authenticatedFetch(getApiUrl(`/courses/${id}`), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
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
 * Delete a course (Auth + Ownership required)
 * @param {string|number} id - Course ID
 * @returns {Promise<Object>} - Server response
 */
const remove = async (id) => {
    try {
        let response = await authenticatedFetch(getApiUrl(`/courses/${id}`), {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    } catch (err) {
        console.log('Delete course error:', err);
        throw err;
    }
};

export { list, read, create, update, remove };
