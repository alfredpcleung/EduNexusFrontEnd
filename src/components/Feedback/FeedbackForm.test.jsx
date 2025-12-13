import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedbackForm from './FeedbackForm';
import { renderWithAuth } from '../../test/test-utils';
import * as feedbackService from '../../services/feedbackService';

// Mock the feedbackService
vi.mock('../../services/feedbackService');

describe('FeedbackForm Component', () => {
  const mockOnFeedbackCreated = vi.fn();
  const projectId = 'test-project-123';

  const mockNewFeedback = {
    id: '1',
    projectId,
    rating: 5,
    comment: 'Test feedback',
    authorId: '100',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    feedbackService.create.mockResolvedValue(mockNewFeedback);
  });

  it('should render feedback form with all fields', () => {
    renderWithAuth(
      <FeedbackForm projectId={projectId} onFeedbackCreated={mockOnFeedbackCreated} />
    );

    expect(screen.getByText('Leave Feedback')).toBeInTheDocument();
    expect(screen.getByLabelText(/Rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Comment/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Feedback/i })).toBeInTheDocument();
  });

  it('should submit feedback successfully', async () => {
    const user = userEvent.setup();

    renderWithAuth(
      <FeedbackForm projectId={projectId} onFeedbackCreated={mockOnFeedbackCreated} />
    );

    // Fill in form
    const ratingInput = screen.getByLabelText(/Rating/i);
    const commentInput = screen.getByLabelText(/Comment/i);
    const submitButton = screen.getByRole('button', { name: /Submit Feedback/i });

    await user.clear(ratingInput);
    await user.type(ratingInput, '4');
    await user.type(commentInput, 'Great project!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(feedbackService.create).toHaveBeenCalledWith({
        projectId,
        rating: 4,
        comment: 'Great project!',
        labels: [],
      });
      expect(mockOnFeedbackCreated).toHaveBeenCalledWith(mockNewFeedback);
    });
  });

  it('should require comment field', async () => {
    const user = userEvent.setup();

    renderWithAuth(
      <FeedbackForm projectId={projectId} onFeedbackCreated={mockOnFeedbackCreated} />
    );

    // Try to submit with empty comment - form HTML5 validation prevents submission
    const ratingInput = screen.getByLabelText(/Rating/i);
    const commentInput = screen.getByLabelText(/Comment/i);
    // Submit button exists but not clicked - HTML5 validation prevents submission
    screen.getByRole('button', { name: /Submit Feedback/i });

    await user.clear(ratingInput);
    await user.type(ratingInput, '5');
    // Leave comment empty

    // Check that comment field is required
    expect(commentInput).toBeRequired();
    expect(feedbackService.create).not.toHaveBeenCalled();
  });

  it('should validate rating between 1-5', async () => {
    renderWithAuth(
      <FeedbackForm projectId={projectId} onFeedbackCreated={mockOnFeedbackCreated} />
    );

    // Check that rating field has min/max constraints
    const ratingInput = screen.getByLabelText(/Rating/i);
    expect(ratingInput).toHaveAttribute('min', '1');
    expect(ratingInput).toHaveAttribute('max', '5');
    expect(feedbackService.create).not.toHaveBeenCalled();
  });

  it('should handle 409 Conflict when user already gave feedback', async () => {
    const user = userEvent.setup();
    const conflictError = new Error('User already provided feedback');
    conflictError.status = 409;
    feedbackService.create.mockRejectedValueOnce(conflictError);

    renderWithAuth(
      <FeedbackForm projectId={projectId} onFeedbackCreated={mockOnFeedbackCreated} />
    );

    const ratingInput = screen.getByLabelText(/Rating/i);
    const commentInput = screen.getByLabelText(/Comment/i);
    const submitButton = screen.getByRole('button', { name: /Submit Feedback/i });

    await user.clear(ratingInput);
    await user.type(ratingInput, '5');
    await user.type(commentInput, 'New feedback');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/already provided feedback/i)).toBeInTheDocument();
      expect(mockOnFeedbackCreated).not.toHaveBeenCalled();
    });
  });

  it('should show warning severity for 409 Conflict', async () => {
    const user = userEvent.setup();
    const conflictError = new Error('Duplicate feedback');
    conflictError.status = 409;
    feedbackService.create.mockRejectedValueOnce(conflictError);

    renderWithAuth(
      <FeedbackForm projectId={projectId} onFeedbackCreated={mockOnFeedbackCreated} />
    );

    const ratingInput = screen.getByLabelText(/Rating/i);
    const commentInput = screen.getByLabelText(/Comment/i);
    const submitButton = screen.getByRole('button', { name: /Submit Feedback/i });

    await user.clear(ratingInput);
    await user.type(ratingInput, '5');
    await user.type(commentInput, 'Test');
    await user.click(submitButton);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('MuiAlert-colorWarning');
    });
  });

  it('should handle other errors as error severity', async () => {
    const user = userEvent.setup();
    feedbackService.create.mockRejectedValueOnce(new Error('Server error'));

    renderWithAuth(
      <FeedbackForm projectId={projectId} onFeedbackCreated={mockOnFeedbackCreated} />
    );

    const ratingInput = screen.getByLabelText(/Rating/i);
    const commentInput = screen.getByLabelText(/Comment/i);
    const submitButton = screen.getByRole('button', { name: /Submit Feedback/i });

    await user.clear(ratingInput);
    await user.type(ratingInput, '5');
    await user.type(commentInput, 'Test');
    await user.click(submitButton);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('MuiAlert-colorError');
    });
  });

  it('should reset form after successful submission', async () => {
    const user = userEvent.setup();

    renderWithAuth(
      <FeedbackForm projectId={projectId} onFeedbackCreated={mockOnFeedbackCreated} />
    );

    const ratingInput = screen.getByLabelText(/Rating/i);
    const commentInput = screen.getByLabelText(/Comment/i);
    const submitButton = screen.getByRole('button', { name: /Submit Feedback/i });

    await user.clear(ratingInput);
    await user.type(ratingInput, '4');
    await user.type(commentInput, 'Great!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(ratingInput).toHaveValue(5); // Reset to default
      expect(commentInput).toHaveValue(''); // Cleared
    });
  });

  it('should disable submit button while loading', async () => {
    const user = userEvent.setup();
    let resolveSubmit;
    feedbackService.create.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSubmit = resolve;
        })
    );

    renderWithAuth(
      <FeedbackForm projectId={projectId} onFeedbackCreated={mockOnFeedbackCreated} />
    );

    const ratingInput = screen.getByLabelText(/Rating/i);
    const commentInput = screen.getByLabelText(/Comment/i);
    const submitButton = screen.getByRole('button', { name: /Submit Feedback/i });

    await user.clear(ratingInput);
    await user.type(ratingInput, '5');
    await user.type(commentInput, 'Test');
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();

    resolveSubmit(mockNewFeedback);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
