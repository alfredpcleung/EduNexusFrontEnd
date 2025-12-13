import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Signin from './Signin';
import { AuthContext } from './AuthContext';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper to render with auth context
const renderWithAuth = (component, authValue = {}) => {
  const defaultAuth = {
    user: null,
    isAuth: false,
    loading: false,
    error: null,
    signin: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn(),
    ...authValue,
  };

  return render(
    <AuthContext.Provider value={defaultAuth}>
      <BrowserRouter>{component}</BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Signin Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render signin form with all fields', () => {
      renderWithAuth(<Signin />);

      // Check page title and form elements
      expect(screen.getAllByText(/sign in/i).length).toBeGreaterThanOrEqual(2); // heading + button
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should render link to signup page', () => {
      renderWithAuth(<Signin />);

      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/users/signup');
    });

    it('should have required fields', () => {
      renderWithAuth(<Signin />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });
  });

  describe('Form Interaction', () => {
    it('should update email field on input', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Signin />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      await user.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('should update password field on input', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Signin />);

      const passwordInput = screen.getByPlaceholderText('Enter your password');
      await user.type(passwordInput, 'password123');

      expect(passwordInput).toHaveValue('password123');
    });

    it('should mask password input', () => {
      renderWithAuth(<Signin />);

      const passwordInput = screen.getByPlaceholderText('Enter your password');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Submission', () => {
    it('should call signin with email and password on submit', async () => {
      const user = userEvent.setup();
      const mockSignin = vi.fn().mockResolvedValue({ success: true });
      renderWithAuth(<Signin />, { signin: mockSignin });

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSignin).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('should navigate to home on successful signin', async () => {
      const user = userEvent.setup();
      const mockSignin = vi.fn().mockResolvedValue({ success: true });
      renderWithAuth(<Signin />, { signin: mockSignin });

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      });
    });

    it('should display error message on failed signin', async () => {
      const user = userEvent.setup();
      const mockSignin = vi.fn().mockResolvedValue({ 
        success: false, 
        message: 'Invalid credentials' 
      });
      renderWithAuth(<Signin />, { signin: mockSignin });

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });

    it('should display default error message when no message provided', async () => {
      const user = userEvent.setup();
      const mockSignin = vi.fn().mockResolvedValue({ success: false });
      renderWithAuth(<Signin />, { signin: mockSignin });

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Sign in failed. Please try again.')).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('should disable submit button when loading', () => {
      renderWithAuth(<Signin />, { loading: true });

      const submitButton = screen.getByRole('button', { name: /signing in/i });
      expect(submitButton).toBeDisabled();
    });

    it('should show loading text on button when loading', () => {
      renderWithAuth(<Signin />, { loading: true });

      expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();
    });
  });

  describe('Auth Error Display', () => {
    it('should display auth context error when present', () => {
      renderWithAuth(<Signin />, { error: 'Session expired' });

      expect(screen.getByText('Session expired')).toBeInTheDocument();
    });
  });

  describe('Error Dismissal', () => {
    it('should allow dismissing error message', async () => {
      const user = userEvent.setup();
      const mockSignin = vi.fn().mockResolvedValue({ 
        success: false, 
        message: 'Invalid credentials' 
      });
      renderWithAuth(<Signin />, { signin: mockSignin });

      // Trigger error
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrong');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });

      // Dismiss error
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
      });
    });
  });
});
