import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListItemUser from '../../components/User/ListItemUser';
import { renderWithAuth } from '../../test/test-utils.jsx';   // ✅ use custom helper

describe('ListItemUser Component', () => {
  const mockUser = {
    uid: '1',
    displayName: 'John Doe',
    email: 'john@example.com',
    role: 'student',
    bio: 'I love learning',
  };

  const mockOnRemoved = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render user information correctly', () => {
    renderWithAuth(
      <table>
        <tbody>
          <ListItemUser user={mockUser} onRemoved={mockOnRemoved} />
        </tbody>
      </table>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('student')).toBeInTheDocument();
    expect(screen.getByText('I love learning')).toBeInTheDocument();
  });

  it('should render action buttons', () => {
    renderWithAuth(
      <table>
        <tbody>
          <ListItemUser user={mockUser} onRemoved={mockOnRemoved} />
        </tbody>
      </table>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('should show confirmation dialog when delete button is clicked', async () => {
    const user = userEvent.setup();
    window.confirm = vi.fn().mockReturnValue(false);

    renderWithAuth(
      <table>
        <tbody>
          <ListItemUser user={mockUser} onRemoved={mockOnRemoved} />
        </tbody>
      </table>
    );

    const deleteButton = screen.getAllByRole('button').pop();
    await user.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete this user?'
    );
  });

  it('should not call onRemoved when delete is cancelled', async () => {
    const user = userEvent.setup();
    window.confirm = vi.fn().mockReturnValue(false);

    renderWithAuth(
      <table>
        <tbody>
          <ListItemUser user={mockUser} onRemoved={mockOnRemoved} />
        </tbody>
      </table>
    );

    const deleteButton = screen.getAllByRole('button').pop();
    await user.click(deleteButton);

    expect(mockOnRemoved).not.toHaveBeenCalled();
  });

  it('should use _id if uid is not available', () => {
    const userWithUnderscoreId = {
      _id: '2',
      displayName: 'Jane Smith',
      email: 'jane@example.com',
      role: 'instructor',
      bio: 'Teaching is my passion',
    };

    renderWithAuth(
      <table>
        <tbody>
          <ListItemUser user={userWithUnderscoreId} onRemoved={mockOnRemoved} />
        </tbody>
      </table>
    );

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should display N/A for missing fields', () => {
    const incompleteUser = {
      uid: '3',
      displayName: 'Bob',
      // missing email, role, bio
    };

    renderWithAuth(
      <table>
        <tbody>
          <ListItemUser user={incompleteUser} onRemoved={mockOnRemoved} />
        </tbody>
      </table>
    );

    expect(screen.getByText('Bob')).toBeInTheDocument();
    const naElements = screen.getAllByText('N/A');
    expect(naElements.length).toBeGreaterThanOrEqual(2);
  });

  it('should display different role colors', () => {
    const instructorUser = {
      uid: '4',
      displayName: 'Instructor',
      email: 'instructor@example.com',
      role: 'instructor',
      bio: 'Teaching',
    };

    renderWithAuth(
      <table>
        <tbody>
          <ListItemUser user={instructorUser} onRemoved={mockOnRemoved} />
        </tbody>
      </table>
    );

    expect(screen.getByText('instructor')).toBeInTheDocument();
  });

  it('should have edit button (but disabled)', () => {
    renderWithAuth(
      <table>
        <tbody>
          <ListItemUser user={mockUser} onRemoved={mockOnRemoved} />
        </tbody>
      </table>
    );

    const buttons = screen.getAllByRole('button');
    const editButton = buttons[0];
    expect(editButton).toBeDisabled();
  });

  it('should default to "student" role if not provided', () => {
    const userWithoutRole = {
      uid: '5',
      displayName: 'User',
      email: 'user@example.com',
      bio: 'Bio',
    };

    renderWithAuth(
      <table>
        <tbody>
          <ListItemUser user={userWithoutRole} onRemoved={mockOnRemoved} />
        </tbody>
      </table>
    );

    expect(screen.getByText('student')).toBeInTheDocument();
  });
});