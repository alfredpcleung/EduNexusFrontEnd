import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

/**
 * Custom render function that wraps components with necessary providers
 */
export const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

/**
 * Mock fetch implementation for tests
 */
export const mockFetch = (data, options = {}) => {
  const { shouldFail = false, status = 200 } = options;

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => (shouldFail ? Promise.reject(new Error('Fetch failed')) : Promise.resolve(data)),
      ok: !shouldFail,
      status: status,
    })
  );
};

/**
 * Wait for async operations to complete
 */
export const waitForLoadingToFinish = async () => {
  const { waitFor } = require('@testing-library/react');
  await waitFor(() => {
    expect(document.querySelector('[role="progressbar"]')).not.toBeInTheDocument();
  });
};

/**
 * Create mock course data
 */
export const createMockCourse = (overrides = {}) => {
  return {
    id: '1',
    title: 'Test Course',
    description: 'Test Description',
    credits: 3,
    status: 'active',
    instructor: 'Test Instructor',
    ...overrides,
  };
};

/**
 * Create mock user data
 */
export const createMockUser = (overrides = {}) => {
  return {
    uid: '1',
    displayName: 'Test User',
    email: 'test@example.com',
    role: 'student',
    bio: 'Test Bio',
    ...overrides,
  };
};

export default {
  renderWithRouter,
  mockFetch,
  waitForLoadingToFinish,
  createMockCourse,
  createMockUser,
};
