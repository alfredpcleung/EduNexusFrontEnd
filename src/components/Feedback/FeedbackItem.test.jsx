import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedbackItem from './FeedbackItem';
import { renderWithAuth } from '../../test/test-utils';
import * as feedbackService from '../../services/feedbackService';

// Mock the feedbackService
vi.mock('../../services/feedbackService');

describe('FeedbackItem Component', () => {
  const mockUser = {
    uid: '100',
    displayName: 'Test User',
    email: 'test@example.com',
    role: 'student',
  };

  const mockFeedback = {
    id: '1',
    _id: '1',
    authorId: '100',
    author: {
      displayName: 'John Doe',
    },
    rating: 4,
    comment: 'Great project!',
    createdAt: '2025-12-10T10:00:00Z',
  };

  const mockOnFeedbackDeleted = vi.fn();
  const mockOnFeedbackEdit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render feedback information correctly', () => {
    renderWithAuth(
      <FeedbackItem
        feedback={mockFeedback}
        onFeedbackDeleted={mockOnFeedbackDeleted}
        onFeedbackEdit={mockOnFeedbackEdit}
      />
    );

    expect(screen.getByText('Rating: 4/5')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Great project!')).toBeInTheDocument();
  });

  it('should display delete button for feedback owner', () => {
    renderWithAuth(
      <FeedbackItem
        feedback={mockFeedback}
        onFeedbackDeleted={mockOnFeedbackDeleted}
        onFeedbackEdit={mockOnFeedbackEdit}
      />,
      { user: mockUser }
    );

    const deleteButton = screen.getByRole('button', { name: /🗑️/ });
    expect(deleteButton).toBeInTheDocument();
  });

  it('should not display delete button for non-owner', () => {
    const otherUser = {
      uid: '200',
      displayName: 'Other User',
      email: 'other@example.com',
      role: 'student',
    };

    renderWithAuth(
      <FeedbackItem
        feedback={mockFeedback}
        onFeedbackDeleted={mockOnFeedbackDeleted}
        onFeedbackEdit={mockOnFeedbackEdit}
      />,
      { user: otherUser }
    );

    const deleteButton = screen.queryByRole('button', { name: /🗑️/ });
    expect(deleteButton).not.toBeInTheDocument();
  });

  it('should display delete button for admin user', () => {
    const adminUser = {
      uid: '300',
      displayName: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    };

    renderWithAuth(
      <FeedbackItem
        feedback={mockFeedback}
        onFeedbackDeleted={mockOnFeedbackDeleted}
        onFeedbackEdit={mockOnFeedbackEdit}
      />,
      { user: adminUser }
    );

    const deleteButton = screen.getByRole('button', { name: /🗑️/ });
    expect(deleteButton).toBeInTheDocument();
  });

  it('should handle delete feedback with confirmation', async () => {
    const user = userEvent.setup();
    feedbackService.remove.mockResolvedValueOnce({});

    renderWithAuth(
      <FeedbackItem
        feedback={mockFeedback}
        onFeedbackDeleted={mockOnFeedbackDeleted}
        onFeedbackEdit={mockOnFeedbackEdit}
      />,
      { user: mockUser }
    );

    // Mock window.confirm
    window.confirm = vi.fn(() => true);

    const deleteButton = screen.getByRole('button', { name: /🗑️/ });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(feedbackService.remove).toHaveBeenCalledWith('1');
      expect(mockOnFeedbackDeleted).toHaveBeenCalledWith('1');
      expect(window.confirm).toHaveBeenCalledWith('Delete this feedback?');
    });
  });

  it('should not delete feedback if user cancels confirmation', async () => {
    const user = userEvent.setup();

    renderWithAuth(
      <FeedbackItem
        feedback={mockFeedback}
        onFeedbackDeleted={mockOnFeedbackDeleted}
        onFeedbackEdit={mockOnFeedbackEdit}
      />,
      { user: mockUser }
    );

    // Mock window.confirm to return false
    window.confirm = vi.fn(() => false);

    const deleteButton = screen.getByRole('button', { name: /🗑️/ });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(feedbackService.remove).not.toHaveBeenCalled();
      expect(mockOnFeedbackDeleted).not.toHaveBeenCalled();
    });
  });

  it('should handle delete error gracefully', async () => {
    const user = userEvent.setup();
    const deleteError = new Error('Failed to delete feedback');
    deleteError.status = 403;
    feedbackService.remove.mockRejectedValueOnce(deleteError);

    renderWithAuth(
      <FeedbackItem
        feedback={mockFeedback}
        onFeedbackDeleted={mockOnFeedbackDeleted}
        onFeedbackEdit={mockOnFeedbackEdit}
      />,
      { user: mockUser }
    );

    window.confirm = vi.fn(() => true);

    const deleteButton = screen.getByRole('button', { name: /🗑️/ });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(feedbackService.remove).toHaveBeenCalled();
      expect(mockOnFeedbackDeleted).not.toHaveBeenCalled();
    });
  });

  it('should format date correctly', () => {
    const feedbackWithDate = {
      ...mockFeedback,
      createdAt: '2025-12-10T10:00:00Z',
    };

    renderWithAuth(
      <FeedbackItem
        feedback={feedbackWithDate}
        onFeedbackDeleted={mockOnFeedbackDeleted}
        onFeedbackEdit={mockOnFeedbackEdit}
      />
    );

    expect(screen.getByText(/Dec \d+, \d+/)).toBeInTheDocument();
  });

  it('should use authorName fallback if displayName not available', () => {
    const feedbackWithoutDisplayName = {
      ...mockFeedback,
      author: undefined,
      authorName: 'Fallback Name',
    };

    renderWithAuth(
      <FeedbackItem
        feedback={feedbackWithoutDisplayName}
        onFeedbackDeleted={mockOnFeedbackDeleted}
        onFeedbackEdit={mockOnFeedbackEdit}
      />
    );

    expect(screen.getByText('Fallback Name')).toBeInTheDocument();
  });

  it('should show Anonymous if no author name available', () => {
    const feedbackNoAuthor = {
      ...mockFeedback,
      author: undefined,
      authorName: undefined,
    };

    renderWithAuth(
      <FeedbackItem
        feedback={feedbackNoAuthor}
        onFeedbackDeleted={mockOnFeedbackDeleted}
        onFeedbackEdit={mockOnFeedbackEdit}
      />
    );

    expect(screen.getByText('Anonymous')).toBeInTheDocument();
  });
});
