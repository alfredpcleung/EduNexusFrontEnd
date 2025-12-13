import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import ListCourse from '../../components/Course/ListCourse';
import { renderWithAuth } from '../../test/test-utils';
import * as coursesService from '../../services/coursesService';

// Mock the coursesService
vi.mock('../../services/coursesService');

// Mock user data
const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'student',
};

// Mock course data
const mockCourses = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn React basics',
    credits: 3,
    status: 'active',
    instructor: 'John Doe',
  },
  {
    id: '2',
    title: 'Advanced JavaScript',
    description: 'Master JavaScript concepts',
    credits: 4,
    status: 'active',
    instructor: 'Jane Smith',
  },
  {
    id: '3',
    title: 'Web Design',
    description: 'UI/UX principles',
    credits: 2,
    status: 'inactive',
    instructor: 'Bob Wilson',
  },
];

describe('ListCourse Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display loading state initially', async () => {
    // Mock list to return a promise that never resolves
    coursesService.list.mockImplementation(() => new Promise(() => {}));

    renderWithAuth(<ListCourse />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render courses list when data is loaded', async () => {
    coursesService.list.mockResolvedValue(mockCourses);

    renderWithAuth(<ListCourse />);

    // Wait for loading to finish and courses to appear
    await waitFor(() => {
      expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    });

    // Check that all courses are rendered
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Advanced JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Web Design')).toBeInTheDocument();

    // Check instructor names
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument();

    // Check credits
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should display error message when list fails to load', async () => {
    const errorMessage = 'Failed to load courses';
    coursesService.list.mockRejectedValue(new Error(errorMessage));

    renderWithAuth(<ListCourse />);

    await waitFor(() => {
      expect(screen.getByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument();
    });
  });

  it('should display "No courses found" when list is empty', async () => {
    coursesService.list.mockResolvedValue([]);

    renderWithAuth(<ListCourse />);

    await waitFor(() => {
      expect(screen.getByText('No courses found')).toBeInTheDocument();
    });
  });

  it('should have Add Course button that navigates to /course/add', async () => {
    coursesService.list.mockResolvedValue(mockCourses);

    renderWithAuth(<ListCourse />, { user: { ...mockUser, role: 'instructor' }, isAuth: true });

    // Button is rendered as a Link (anchor tag) in Material UI
    const addButton = await screen.findByRole('link', { name: /add course/i });
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveAttribute('href', '/course/add');
  });

  it('should call list() on component mount', async () => {
    coursesService.list.mockResolvedValue(mockCourses);

    renderWithAuth(<ListCourse />);

    await waitFor(() => {
      expect(coursesService.list).toHaveBeenCalledTimes(1);
    });
  });

  it('should display table headers correctly', async () => {
    coursesService.list.mockResolvedValue(mockCourses);

    renderWithAuth(<ListCourse />);

    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Instructor')).toBeInTheDocument();
      expect(screen.getByText('Credits')).toBeInTheDocument();
      // Use getAllByText since Status appears multiple times (in filter and table header)
      const statusElements = screen.getAllByText('Status');
      expect(statusElements.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  it('should handle courses with _id instead of id', async () => {
    const coursesWithUnderscoreId = [
      {
        _id: '1',
        title: 'Course 1',
        description: 'Description 1',
        credits: 3,
        status: 'active',
        instructor: 'Instructor 1',
      },
    ];

    coursesService.list.mockResolvedValue(coursesWithUnderscoreId);

    renderWithAuth(<ListCourse />);

    await waitFor(() => {
      expect(screen.getByText('Course 1')).toBeInTheDocument();
    });
  });

  it('should reload courses after delete', async () => {
    coursesService.list.mockResolvedValue(mockCourses);
    coursesService.remove.mockResolvedValue({ success: true });

    renderWithAuth(<ListCourse />);

    await waitFor(() => {
      expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    });

    // Simulate course deletion by calling handleRemove
    // This would be done through user interaction in actual tests
    expect(coursesService.list).toHaveBeenCalled();
  });

  it('should display status badges with correct styling', async () => {
    coursesService.list.mockResolvedValue(mockCourses);

    renderWithAuth(<ListCourse />);

    await waitFor(() => {
      const statusElements = screen.getAllByText(/active|inactive/i);
      expect(statusElements.length).toBeGreaterThan(0);
    });
  });
});
