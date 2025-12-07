import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ListItemCourse from '../../components/Course/ListItemCourse';
import * as coursesService from '../../services/coursesService';

// Mock the coursesService
vi.mock('../../services/coursesService');

describe('ListItemCourse Component', () => {
  const mockCourse = {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn React basics',
    credits: 3,
    status: 'active',
    instructor: 'John Doe',
  };

  const mockOnRemoved = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render course information correctly', () => {
    render(
      <BrowserRouter>
        <table>
          <tbody>
            <ListItemCourse course={mockCourse} onRemoved={mockOnRemoved} />
          </tbody>
        </table>
      </BrowserRouter>
    );

    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('should render edit and delete buttons', () => {
    render(
      <BrowserRouter>
        <table>
          <tbody>
            <ListItemCourse course={mockCourse} onRemoved={mockOnRemoved} />
          </tbody>
        </table>
      </BrowserRouter>
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

    window.confirm = vi.fn().mockReturnValue(true);

    render(
      <BrowserRouter>
        <table>
          <tbody>
            <ListItemCourse course={mockCourse} onRemoved={mockOnRemoved} />
          </tbody>
        </table>
      </BrowserRouter>
    );

    // Find and click delete button (typically the last button)
    const deleteButton = screen.getAllByRole('button').pop();
    await user.click(deleteButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this course?');
    });

    await waitFor(() => {
      expect(coursesService.remove).toHaveBeenCalledWith('1');
    });

    await waitFor(() => {
      expect(mockOnRemoved).toHaveBeenCalledWith('1');
    });
  });

  it('should not delete when user cancels confirmation', async () => {
    const user = userEvent.setup();
    window.confirm = vi.fn().mockReturnValue(false);

    render(
      <BrowserRouter>
        <table>
          <tbody>
            <ListItemCourse course={mockCourse} onRemoved={mockOnRemoved} />
          </tbody>
        </table>
      </BrowserRouter>
    );

    const deleteButton = screen.getAllByRole('button').pop();
    await user.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(coursesService.remove).not.toHaveBeenCalled();
    expect(mockOnRemoved).not.toHaveBeenCalled();
  });

  it('should handle delete error gracefully', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Failed to delete course';
    coursesService.remove.mockRejectedValue(new Error(errorMessage));

    window.confirm = vi.fn().mockReturnValue(true);
    window.alert = vi.fn();

    render(
      <BrowserRouter>
        <table>
          <tbody>
            <ListItemCourse course={mockCourse} onRemoved={mockOnRemoved} />
          </tbody>
        </table>
      </BrowserRouter>
    );

    const deleteButton = screen.getAllByRole('button').pop();
    await user.click(deleteButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
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
    };

    coursesService.remove.mockResolvedValue({ success: true });
    window.confirm = vi.fn().mockReturnValue(true);

    render(
      <BrowserRouter>
        <table>
          <tbody>
            <ListItemCourse course={courseWithUnderscoreId} onRemoved={mockOnRemoved} />
          </tbody>
        </table>
      </BrowserRouter>
    );

    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('should display N/A for missing fields', () => {
    const incompleteCourse = {
      id: '3',
      title: 'Course',
      // missing other fields
    };

    render(
      <BrowserRouter>
        <table>
          <tbody>
            <ListItemCourse course={incompleteCourse} onRemoved={mockOnRemoved} />
          </tbody>
        </table>
      </BrowserRouter>
    );

    expect(screen.getByText('Course')).toBeInTheDocument();
    const naElements = screen.getAllByText('N/A');
    expect(naElements.length).toBeGreaterThan(0);
  });

  it('should have edit link pointing to correct course', () => {
    render(
      <BrowserRouter>
        <table>
          <tbody>
            <ListItemCourse course={mockCourse} onRemoved={mockOnRemoved} />
          </tbody>
        </table>
      </BrowserRouter>
    );

    const editLink = screen.getByRole('link', { name: /edit course/i });
    expect(editLink).toHaveAttribute('href', '/course/edit/1');
  });
});
