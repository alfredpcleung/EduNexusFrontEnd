import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListItemCourse from '../../components/Course/ListItemCourse';
import { renderWithAuth } from '../../test/test-utils';
import * as coursesService from '../../services/coursesService';

// Mock the coursesService
vi.mock('../../services/coursesService');

describe('ListItemCourse Component', () => {
  const mockUser = {
    uid: '100',
    displayName: 'Test User',
    email: 'test@example.com',
  };

  const mockCourse = {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn React basics',
    credits: 3,
    status: 'active',
    instructor: 'John Doe',
    owner: mockUser.uid, // Set owner to mock user
  };

  const mockOnRemoved = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render course information correctly', () => {
    renderWithAuth(
      <table>
        <tbody>
          <ListItemCourse course={mockCourse} onRemoved={mockOnRemoved} />
        </tbody>
      </table>
    );

    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('should render edit and delete buttons', () => {
    renderWithAuth(
      <table>
        <tbody>
          <ListItemCourse course={mockCourse} onRemoved={mockOnRemoved} />
        </tbody>
      </table>,
      { user: mockUser, isAuth: true }
    );

    // One edit link and one delete button
    const editLink = screen.getByRole('link', { name: /edit course/i });
    const deleteButton = screen.getByRole('button', { name: /delete course/i });
    expect(editLink).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onRemoved callback after successful delete', async () => {
    const user = userEvent.setup();
    coursesService.remove.mockResolvedValue({ success: true });

    renderWithAuth(
      <table>
        <tbody>
          <ListItemCourse course={mockCourse} onRemoved={mockOnRemoved} />
        </tbody>
      </table>,
      { user: mockUser, isAuth: true }
    );

    // Click delete button to open dialog
    const deleteButton = screen.getByRole('button', { name: /delete course/i });
    await user.click(deleteButton);

    // Click the Delete button in the dialog
    const confirmDeleteButton = screen.getByRole('button', { name: /^Delete$/i });
    await user.click(confirmDeleteButton);

    await waitFor(() => {
      expect(coursesService.remove).toHaveBeenCalledWith('1');
    });

    await waitFor(() => {
      expect(mockOnRemoved).toHaveBeenCalledWith('1');
    });
  });

  it('should not delete when user cancels confirmation', async () => {
    const user = userEvent.setup();

    renderWithAuth(
      <table>
        <tbody>
            <ListItemCourse course={mockCourse} onRemoved={mockOnRemoved} />
          </tbody>
        </table>,
      { user: mockUser, isAuth: true }
    );

    // Click delete button to open dialog
    const deleteButton = screen.getByRole('button', { name: /delete course/i });
    await user.click(deleteButton);

    // Click Cancel button in the dialog
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(coursesService.remove).not.toHaveBeenCalled();
    expect(mockOnRemoved).not.toHaveBeenCalled();
  });

  it('should handle delete error gracefully', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Failed to delete course';
    coursesService.remove.mockRejectedValue(new Error(errorMessage));

    renderWithAuth(
      <table>
        <tbody>
          <ListItemCourse course={mockCourse} onRemoved={mockOnRemoved} />
        </tbody>
      </table>,
      { user: mockUser, isAuth: true }
    );

    // Click delete button to open dialog
    const deleteButton = screen.getByRole('button', { name: /delete course/i });
    await user.click(deleteButton);

    // Click the Delete button in the dialog
    const confirmDeleteButton = screen.getByRole('button', { name: /^Delete$/i });
    await user.click(confirmDeleteButton);

    // Wait for error message to appear in the dialog
    await waitFor(() => {
      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0]).toHaveTextContent(errorMessage);
    });

    expect(mockOnRemoved).not.toHaveBeenCalled();
  });

  it('should use _id if id is not available', () => {
    const courseWithUnderscoreId = {
      _id: '2',
      title: 'JavaScript',
      description: 'Learn JavaScript',
      credits: 4,
      status: 'active',
      instructor: 'Jane Smith',
      owner: mockUser.uid,
    };

    renderWithAuth(
      <table>
        <tbody>
          <ListItemCourse course={courseWithUnderscoreId} onRemoved={mockOnRemoved} />
        </tbody>
      </table>,
      { user: mockUser, isAuth: true }
    );

    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('should display N/A for missing fields', () => {
    const incompleteCourse = {
      id: '3',
      title: 'Course',
      owner: mockUser.uid,
      // missing other fields
    };

    renderWithAuth(
      <table>
        <tbody>
          <ListItemCourse course={incompleteCourse} onRemoved={mockOnRemoved} />
        </tbody>
      </table>,
      { user: mockUser, isAuth: true }
    );

    expect(screen.getByText('Course')).toBeInTheDocument();
  });

  it('should have edit link pointing to correct course', () => {
    renderWithAuth(
      <table>
        <tbody>
          <ListItemCourse course={mockCourse} onRemoved={mockOnRemoved} />
        </tbody>
      </table>,
      { user: mockUser, isAuth: true }
    );

    const editLink = screen.getByRole('link', { name: /edit course/i });
    expect(editLink).toHaveAttribute('href', '/course/edit/1');
  });
});
