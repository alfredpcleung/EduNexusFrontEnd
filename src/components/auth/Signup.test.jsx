
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from './Signup';
import { AuthProvider } from './AuthContext';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Signup form', () => {
  it('renders all required fields', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/Enter your first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your school/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your field of study/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter a password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirm your password/i)).toBeInTheDocument();
  });

  it('shows error if required fields are empty', async () => {
    const { container } = render(
      <MemoryRouter>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </MemoryRouter>
    );
    const form = container.querySelector('form');
    fireEvent.submit(form);
    await waitFor(() => {
      // Debug: log the DOM for inspection
      // eslint-disable-next-line no-console
      console.log(document.body.innerHTML);
      // Try to find the error message by text as a fallback
      expect(
        screen.queryByText(/first name is required/i)
      ).toBeInTheDocument();
    });
  });

  it('shows error if passwords do not match', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/Enter your first name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your last name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your school/i), { target: { value: 'Test School' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your field of study/i), { target: { value: 'CS' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter a password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/Passwords don't match/i)).toBeInTheDocument();
    });
  });

  // Add more tests for successful signup and backend error display as needed
});
