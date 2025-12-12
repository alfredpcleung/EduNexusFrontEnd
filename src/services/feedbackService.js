import { authenticatedFetch } from "../components/auth/auth-helper";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * Get feedback for a specific project
 * @param {string} projectId - Project ID
 * @returns {Promise<Array>} Array of feedback objects
 */
export const listByProject = async (projectId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/feedback?projectId=${projectId}`
    );
    const data = await response.json();
    if (data.success) {
      return data.feedback || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }
};

/**
 * Create feedback for a project (authenticated)
 * @param {Object} data - Feedback data { projectId, rating, comment }
 * @returns {Promise<Object>} Created feedback object
 */
export const create = async (data) => {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.success) {
      return result.feedback;
    }
    throw new Error(result.message || "Failed to create feedback");
  } catch (error) {
    console.error("Error creating feedback:", error);
    throw error;
  }
};

/**
 * Update feedback (authenticated + author only)
 * @param {string} id - Feedback ID
 * @param {Object} data - Updated feedback data { rating?, comment? }
 * @returns {Promise<Object>} Updated feedback object
 */
export const update = async (id, data) => {
  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/feedback/${id}`,
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
      return result.feedback;
    }
    throw new Error(result.message || "Failed to update feedback");
  } catch (error) {
    console.error("Error updating feedback:", error);
    throw error;
  }
};

/**
 * Delete feedback (authenticated + author only)
 * @param {string} id - Feedback ID
 * @returns {Promise<Object>} Success response
 */
export const remove = async (id) => {
  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/feedback/${id}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();
    if (result.success) {
      return result;
    }
    throw new Error(result.message || "Failed to delete feedback");
  } catch (error) {
    console.error("Error deleting feedback:", error);
    throw error;
  }
};
