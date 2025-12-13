import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import FeedbackList from './FeedbackList';
import { renderWithAuth } from '../../test/test-utils';

describe('FeedbackList Component', () => {
  const mockFeedback = [
    {
      id: '1',
      _id: '1',
      authorId: '100',
      author: {
        displayName: 'User One',
      },
      rating: 5,
      comment: 'Excellent project!',
      createdAt: '2025-12-10T10:00:00Z',
    },
    {
      id: '2',
      _id: '2',
      authorId: '200',
      author: {
        displayName: 'User Two',
      },
      rating: 4,
      comment: 'Good project!',
      createdAt: '2025-12-09T10:00:00Z',
    },
  ];

  const mockOnFeedbackDeleted = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render feedback list header with count', () => {
    renderWithAuth(
      <FeedbackList
        feedbackList={mockFeedback}
        onFeedbackDeleted={mockOnFeedbackDeleted}
        feedbackError=""
      />
    );

    expect(screen.getByText(/💬 Feedback/)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render all feedback items', () => {
    renderWithAuth(
      <FeedbackList
        feedbackList={mockFeedback}
        onFeedbackDeleted={mockOnFeedbackDeleted}
        feedbackError=""
      />
    );

    expect(screen.getByText('Rating: 5/5')).toBeInTheDocument();
    expect(screen.getByText('Rating: 4/5')).toBeInTheDocument();
    expect(screen.getByText('Excellent project!')).toBeInTheDocument();
    expect(screen.getByText('Good project!')).toBeInTheDocument();
  });

  it('should display empty state when no feedback', () => {
    renderWithAuth(
      <FeedbackList
        feedbackList={[]}
        onFeedbackDeleted={mockOnFeedbackDeleted}
        feedbackError=""
      />
    );

    expect(
      screen.getByText('No feedback yet. Be the first to share your thoughts!')
    ).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should display error alert when feedbackError provided', () => {
    const errorMessage = 'Failed to load feedback';

    renderWithAuth(
      <FeedbackList
        feedbackList={mockFeedback}
        onFeedbackDeleted={mockOnFeedbackDeleted}
        feedbackError={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should not display error alert when no error', () => {
    renderWithAuth(
      <FeedbackList
        feedbackList={mockFeedback}
        onFeedbackDeleted={mockOnFeedbackDeleted}
        feedbackError=""
      />
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should update count when feedback list changes', () => {
    const { unmount } = renderWithAuth(
      <FeedbackList
        feedbackList={mockFeedback}
        onFeedbackDeleted={mockOnFeedbackDeleted}
        feedbackError=""
      />
    );

    // Count should be 2
    expect(screen.getByText('2')).toBeInTheDocument();
    unmount();

    // Render with single feedback
    const singleFeedback = mockFeedback.slice(0, 1);
    renderWithAuth(
      <FeedbackList
        feedbackList={singleFeedback}
        onFeedbackDeleted={mockOnFeedbackDeleted}
        feedbackError=""
      />
    );

    // Count should now be 1
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should pass onFeedbackDeleted callback to FeedbackItem', () => {
    renderWithAuth(
      <FeedbackList
        feedbackList={mockFeedback}
        onFeedbackDeleted={mockOnFeedbackDeleted}
        feedbackError=""
      />
    );

    // Just verify that FeedbackItems are rendered
    // The callback is tested more thoroughly in FeedbackItem.test.jsx
    expect(screen.getByText('Excellent project!')).toBeInTheDocument();
    expect(screen.getByText('Good project!')).toBeInTheDocument();
  });
});
