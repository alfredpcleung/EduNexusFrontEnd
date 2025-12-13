/* global global */
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

  describe('Key Benefits Section', () => {
    it('should display 4 key benefit cards in hero section', async () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('Choose the Right Teammates')).toBeInTheDocument();
      expect(screen.getByText('Discover the Best Electives')).toBeInTheDocument();
      expect(screen.getByText('Get Insights on Core Courses')).toBeInTheDocument();
      expect(screen.getByText('Benefit from Peer Feedback')).toBeInTheDocument();
    });

    it('should display benefit descriptions', async () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('See peer ratings and pick reliable collaborators.')).toBeInTheDocument();
      expect(screen.getByText('Learn from feedback and maximize your GPA.')).toBeInTheDocument();
      expect(screen.getByText('Know what to expect and how to succeed.')).toBeInTheDocument();
      expect(screen.getByText('Make smarter academic choices with community reviews.')).toBeInTheDocument();
    });
  });

  describe('Statistics Section', () => {
    it('should display 4 statistics cards', async () => {
      renderWithRouter(<Home />);
      
      await waitFor(() => {
        expect(screen.getByText('Registered Students')).toBeInTheDocument();
        expect(screen.getByText('Courses with Reviews')).toBeInTheDocument();
        expect(screen.getByText('Active Students')).toBeInTheDocument();
        expect(screen.getByText('Projects Recruiting')).toBeInTheDocument();
      });
    });

    it('should display statistics values after loading', async () => {
      renderWithRouter(<Home />);
      
      await waitFor(() => {
        expect(screen.getByText('150')).toBeInTheDocument(); // registeredStudents
        expect(screen.getByText('45')).toBeInTheDocument();  // coursesWithReviews
        expect(screen.getByText('89')).toBeInTheDocument();  // activeStudents
        expect(screen.getByText('23')).toBeInTheDocument();  // projectsRecruiting
      });
    });

    it('should call the correct API endpoint', async () => {
      renderWithRouter(<Home />);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/stats/homepage')
        );
      });
    });

    it('should display dash when stats are null', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          registeredStudents: null,
          coursesWithReviews: null,
          activeStudents: null,
          projectsRecruiting: null,
        }),
      });
      
      renderWithRouter(<Home />);
      
      await waitFor(() => {
        const dashes = screen.getAllByText('—');
        expect(dashes.length).toBe(4);
      });
    });

    it('should handle API error gracefully', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
      });
      
      renderWithRouter(<Home />);
      
      // Component should still render without crashing
      await waitFor(() => {
        expect(screen.getByText('Welcome to EduNexus')).toBeInTheDocument();
      });
    });
  });
});
