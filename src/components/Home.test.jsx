import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import * as authHelper from './auth/auth-helper';

// Mock auth-helper
vi.mock('./auth/auth-helper');

// Mock fetch globally
const mockStatsResponse = {
  registeredStudents: 150,
  coursesWithReviews: 45,
  activeStudents: 89,
  projectsRecruiting: 23,
};

global.fetch = vi.fn();

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock fetch for /stats/homepage endpoint
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockStatsResponse),
    });
    vi.mocked(authHelper.isAuthenticated).mockReturnValue(false);
  });

  describe('Unauthenticated User', () => {
    it('should render hero section with welcome message', async () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('Welcome to EduNexus')).toBeInTheDocument();
      expect(screen.getByText(/Make informed decisions about your education/)).toBeInTheDocument();
    });

    it('should display signup and signin buttons for unauthenticated user', async () => {
      renderWithRouter(<Home />);
      
      const createButtons = screen.getAllByText('Create Free Account');
      expect(createButtons.length).toBeGreaterThan(0);
      
      const signInButtons = screen.getAllByText('Sign In');
      expect(signInButtons.length).toBeGreaterThan(0);
    });

    it('should display statistics section title', async () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('Join Our Community')).toBeInTheDocument();
    });

    it('should fetch statistics on mount', async () => {
      renderWithRouter(<Home />);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it('should display explore platform section with 3 cards', async () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('Explore Our Platform')).toBeInTheDocument();
      expect(screen.getByText('Browse Courses')).toBeInTheDocument();
      expect(screen.getByText('Connect with Peers')).toBeInTheDocument();
      expect(screen.getByText('Showcase Projects')).toBeInTheDocument();
    });

    it('should display view buttons for all three sections', async () => {
      renderWithRouter(<Home />);
      
      const viewCoursesButtons = screen.getAllByText('View Courses');
      expect(viewCoursesButtons.length).toBeGreaterThan(0);
      
      const viewProfilesButtons = screen.getAllByText('View Profiles');
      expect(viewProfilesButtons.length).toBeGreaterThan(0);
      
      const viewProjectsButtons = screen.getAllByText('View Projects');
      expect(viewProjectsButtons.length).toBeGreaterThan(0);
    });

    it('should display final CTA section', async () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('Ready to Explore?')).toBeInTheDocument();
      expect(screen.getByText(/Join thousands of students/)).toBeInTheDocument();
    });
  });

  describe('Authenticated User', () => {
    beforeEach(() => {
      vi.mocked(authHelper.isAuthenticated).mockReturnValue(true);
    });

    it('should not display signup button for authenticated user', async () => {
      renderWithRouter(<Home />);
      
      // There should be no "Create Free Account" button for authenticated user
      const createButtons = screen.queryAllByText('Create Free Account');
      expect(createButtons.length).toBe(0);
    });

    it('should display explore platform buttons for authenticated user', async () => {
      renderWithRouter(<Home />);
      
      await waitFor(() => {
        const viewCoursesButtons = screen.getAllByText('View Courses');
        expect(viewCoursesButtons.length).toBeGreaterThan(0);
      });
    });

    it('should display Start Exploring button for authenticated user', async () => {
      renderWithRouter(<Home />);
      
      await waitFor(() => {
        expect(screen.getByText('Start Exploring Now')).toBeInTheDocument();
      });
    });
  });

  describe('Layout', () => {
    it('should render without errors', async () => {
      renderWithRouter(<Home />);
      
      await waitFor(() => {
        expect(screen.getByText('Welcome to EduNexus')).toBeInTheDocument();
      });
    });

    it('should have all major sections', async () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('Welcome to EduNexus')).toBeInTheDocument();
      expect(screen.getByText('Join Our Community')).toBeInTheDocument();
      expect(screen.getByText('Explore Our Platform')).toBeInTheDocument();
      expect(screen.getByText('Ready to Explore?')).toBeInTheDocument();
    });

    it('should not display technology stack section', async () => {
      renderWithRouter(<Home />);
      
      // Technology stack section should not be present
      expect(screen.queryByText('Built With Modern Technologies')).not.toBeInTheDocument();
    });
  });
});
