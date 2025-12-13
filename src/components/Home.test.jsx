import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import * as coursesService from '../services/coursesService';
import * as usersService from '../services/usersService';
import * as projectsService from '../services/projectsService';
import * as authHelper from './auth/auth-helper';

// Mock the services
vi.mock('../services/coursesService');
vi.mock('../services/usersService');
vi.mock('../services/projectsService');
vi.mock('./auth/auth-helper');

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    vi.mocked(coursesService.list).mockResolvedValue([
      { id: '1', title: 'Course 1' },
      { id: '2', title: 'Course 2' },
    ]);
    vi.mocked(usersService.list).mockResolvedValue([
      { uid: '1', displayName: 'User 1' },
      { uid: '2', displayName: 'User 2' },
      { uid: '3', displayName: 'User 3' },
    ]);
    vi.mocked(projectsService.list).mockResolvedValue([
      { id: '1', title: 'Project 1' },
      { id: '2', title: 'Project 2' },
      { id: '3', title: 'Project 3' },
      { id: '4', title: 'Project 4' },
    ]);
    vi.mocked(authHelper.isAuthenticated).mockReturnValue(false);
  });

  describe('Unauthenticated User', () => {
    it('should render hero section with welcome message', async () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText('Welcome to EduNexus')).toBeInTheDocument();
      expect(screen.getByText(/Your LinkedIn for teamwork/)).toBeInTheDocument();
    });

    it('should display signup and signin buttons in hero for unauthenticated user', async () => {
      renderWithRouter(<Home />);
      
      const createButtons = screen.getAllByText('Create Account');
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
        expect(vi.mocked(coursesService.list)).toHaveBeenCalled();
        expect(vi.mocked(usersService.list)).toHaveBeenCalled();
        expect(vi.mocked(projectsService.list)).toHaveBeenCalled();
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
      
      // There should be no "Create Account" button in the hero section
      const createButtons = screen.queryAllByText('Create Account');
      expect(createButtons.length).toBe(0);
    });

    it('should display explore platform buttons for authenticated user', async () => {
      renderWithRouter(<Home />);
      
      await waitFor(() => {
        const viewCoursesButtons = screen.getAllByText('View Courses');
        expect(viewCoursesButtons.length).toBeGreaterThan(0);
      });
    });

    it('should display personalized message in CTA for authenticated user', async () => {
      renderWithRouter(<Home />);
      
      await waitFor(() => {
        expect(screen.getByText('Start exploring courses, find teammates, and share your feedback today!')).toBeInTheDocument();
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
