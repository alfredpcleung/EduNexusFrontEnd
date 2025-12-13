import { authenticatedFetch } from "../components/auth/auth-helper";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * Get all projects (public endpoint)
 * @param {string} queryString - Optional query parameters (e.g., "search=test&status=active")
 * @returns {Promise<Array>} Array of projects
 */
export const list = async (queryString = "") => {
  try {
    const url = queryString 
      ? `${API_BASE_URL}/projects?${queryString}`
      : `${API_BASE_URL}/projects`;
    const response = await fetch(url, {
      cache: 'no-store' // Prevent browser caching
    });
    const data = await response.json();
    if (data.success) {
      return data.projects || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

/**
 * Get single project by ID (public endpoint)
 * @param {string} id - Project ID
 * @returns {Promise<Object>} Project object
 */
export const read = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`);
    const data = await response.json();
    if (data.success) {
      return data.project;
    }
    throw new Error(data.message || "Failed to fetch project");
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

/**
 * Create new project (authenticated)
 * @param {Object} data - Project data { title, description?, courseId?, tags?, status? }
 * @returns {Promise<Object>} Created project object
 */
export const create = async (data) => {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.success) {
      return result.project;
    }
    throw new Error(result.message || "Failed to create project");
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

/**
 * Update project (authenticated + owner only)
 * @param {string} id - Project ID
 * @param {Object} data - Updated project data
 * @returns {Promise<Object>} Updated project object
 */
export const update = async (id, data) => {
  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/projects/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    if (result.success) {
      return result.project;
    }
    throw new Error(result.message || "Failed to update project");
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

/**
 * Delete project (authenticated + owner only)
 * @param {string} id - Project ID
 * @returns {Promise<Object>} Success response
 */
export const remove = async (id) => {
  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/projects/${id}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();
    if (result.success) {
      return result;
    }
    throw new Error(result.message || "Failed to delete project");
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
