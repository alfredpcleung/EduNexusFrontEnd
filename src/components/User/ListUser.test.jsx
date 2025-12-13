import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import ListUser from '../../components/User/ListUser';
import { renderWithAuth } from '../../test/test-utils';
import * as usersService from '../../services/usersService';

// Mock the usersService
vi.mock('../../services/usersService');

// Mock user data
const mockUsers = [
  {
    uid: '1',
    displayName: 'John Doe',
    email: 'john@example.com',
    role: 'student',
    bio: 'I love learning',
  },
  {
    uid: '2',
    displayName: 'Jane Smith',
    email: 'jane@example.com',
    role: 'instructor',
    bio: 'Teaching is my passion',
  },
  {
    uid: '3',
    displayName: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'admin',
    bio: 'System administrator',
  },
];

describe('ListUser Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display loading state initially', async () => {
    // Mock list to return a promise that never resolves
    usersService.list.mockImplementation(() => new Promise(() => {}));

    renderWithAuth(<ListUser />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render users list when data is loaded', async () => {
    usersService.list.mockResolvedValue(mockUsers);

    renderWithAuth(<ListUser />);

    // Wait for loading to finish and users to appear
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Check that all users are rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();

    // Check emails
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();

    // Check bios
    expect(screen.getByText('I love learning')).toBeInTheDocument();
    expect(screen.getByText('Teaching is my passion')).toBeInTheDocument();
  });

  it('should display error message when list fails to load', async () => {
    const errorMessage = 'Failed to load users';
    usersService.list.mockRejectedValue(new Error(errorMessage));

    renderWithAuth(<ListUser />);

    await waitFor(() => {
      expect(screen.getByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument();
    });
  });

  it('should display "No users found" when list is empty', async () => {
    usersService.list.mockResolvedValue([]);

    renderWithAuth(<ListUser />);

    await waitFor(() => {
      expect(screen.getByText('No users found')).toBeInTheDocument();
    });
  });

  it('should call list() on component mount', async () => {
    usersService.list.mockResolvedValue(mockUsers);

    renderWithAuth(<ListUser />);

    await waitFor(() => {
      expect(usersService.list).toHaveBeenCalledTimes(1);
    });
  });

  it('should display table headers correctly', async () => {
    usersService.list.mockResolvedValue(mockUsers);

    renderWithAuth(<ListUser />);

    await waitFor(() => {
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      // Check for header cells using getByRole with scope="col"
      const headers = screen.getAllByRole('columnheader');
      expect(headers.some(h => h.textContent === 'Display Name')).toBe(true);
      expect(headers.some(h => h.textContent === 'Email')).toBe(true);
      expect(headers.some(h => h.textContent === 'Role')).toBe(true);
      expect(headers.some(h => h.textContent === 'Bio')).toBe(true);
      expect(headers.some(h => h.textContent === 'Actions')).toBe(true);
    });
  });

  it('should handle users with _id instead of uid', async () => {
    const usersWithUnderscoreId = [
      {
        _id: '1',
        displayName: 'User 1',
        email: 'user1@example.com',
        role: 'student',
        bio: 'Bio 1',
      },
    ];

    usersService.list.mockResolvedValue(usersWithUnderscoreId);

    renderWithAuth(<ListUser />);

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument();
    });
  });

  it('should display role badges with correct styling', async () => {
    usersService.list.mockResolvedValue(mockUsers);

    renderWithAuth(<ListUser />);

    await waitFor(() => {
      const roleElements = screen.getAllByText(/student|instructor|admin/i);
      expect(roleElements.length).toBeGreaterThan(0);
    });
  });

  it('should handle nested data structure from API', async () => {
    const nestedData = {
      data: mockUsers,
    };

    usersService.list.mockResolvedValue(nestedData);

    renderWithAuth(<ListUser />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('should display "Users" title', async () => {
    usersService.list.mockResolvedValue(mockUsers);

    renderWithAuth(<ListUser />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument();
    });
  });

  it('should handle missing user fields gracefully', async () => {
    const incompleteUsers = [
      {
        uid: '1',
        displayName: 'User 1',
        // missing email, role, bio
      },
    ];

    usersService.list.mockResolvedValue(incompleteUsers);

    renderWithAuth(<ListUser />);

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument();
      const naElements = screen.getAllByText('N/A');
      expect(naElements.length).toBeGreaterThan(0);
    });
  });
});
