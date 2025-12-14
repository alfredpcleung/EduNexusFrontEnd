// Helper to format labels for backend submission (if needed)
export function formatLabelsForSubmission(labels) {
	return Array.isArray(labels)
		? labels.map(label => ({ name: label, count: 1 }))
		: [];
}
export const PROJECT_LABELS = [
	"Reliable",
	"Collaborative",
	"Strong coder",
	"Good communicator",
	"Creative problem-solver"
];
/**
 * Predefined labels for feedback/reviews
 * These are used in feedback forms across the application
 */
