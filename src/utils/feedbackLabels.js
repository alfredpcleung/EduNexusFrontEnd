/**
 * Predefined labels for feedback/reviews
 * These are used in feedback forms across the application
 */

export const COURSE_LABELS = [
    "Heavy workload",
    "Clear grading",
    "Engaging lectures",
    "Practical assignments",
    "Lots of reading"
];

export const PROJECT_LABELS = [
    "Reliable",
    "Collaborative",
    "Strong coder",
    "Good communicator",
    "Creative problem-solver"
];

/**
 * Get labels based on context type
 * @param {string} type - 'course' or 'project'
 * @returns {string[]} Array of label options
 */
export const getLabelsByType = (type) => {
    return type === 'course' ? COURSE_LABELS : PROJECT_LABELS;
};

/**
 * Format labels for backend submission
 * @param {string[]} selectedLabels - Array of selected label strings
 * @returns {Array} Array of label objects with name and count
 */
export const formatLabelsForSubmission = (selectedLabels) => {
    return selectedLabels.map(label => ({
        name: label,
        count: 1  // Will be aggregated on backend
    }));
};
