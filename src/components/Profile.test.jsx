import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from './Profile';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { read, update } from '../services/usersService';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

vi.mock('../services/usersService', () => ({
    read: vi.fn(),
    update: vi.fn(),
}));

const mockUserData = {
    firstName: 'John',
    lastName: 'Doe',
    schoolName: 'Example University',
    programName: 'Computer Science',
    github: 'https://github.com/johndoe',
    personalWebsite: 'https://johndoe.com',
    linkedin: 'https://www.linkedin.com/in/johndoe',
    bio: 'A passionate developer.',
    profilePic: 'https://via.placeholder.com/150',
};

// Create a helper function to render Profile with MemoryRouter
const renderWithRouter = (ui) => {
    return render(
        <MemoryRouter>
            {ui}
        </MemoryRouter>
    );
};

describe('Profile Page', () => {
    beforeEach(async () => {
        vi.spyOn(window, 'confirm').mockImplementation(() => true);
        read.mockResolvedValue(mockUserData);
        update.mockResolvedValue();
        await act(async () => {
            renderWithRouter(<Profile />);
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('loads and displays user data', async () => {
        expect(await screen.findByDisplayValue('John')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Example University')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Computer Science')).toBeInTheDocument();
        expect(screen.getByDisplayValue('https://github.com/johndoe')).toBeInTheDocument();
        expect(screen.getByDisplayValue('https://johndoe.com')).toBeInTheDocument();
        expect(screen.getByDisplayValue('https://www.linkedin.com/in/johndoe')).toBeInTheDocument();
        expect(screen.getByDisplayValue('A passionate developer.')).toBeInTheDocument();
    });

    it('validates LinkedIn and GitHub URLs', async () => {
        const saveButton = await screen.findByRole('button', { name: /Save/i });

        await act(async () => {
            fireEvent.change(screen.getByLabelText(/GitHub/i), { target: { value: 'invalid-url' } });
            fireEvent.change(screen.getByLabelText(/LinkedIn/i), { target: { value: 'invalid-url' } });
            fireEvent.click(saveButton);
        });

        await waitFor(() => {
            expect(screen.getByText('Please enter a valid GitHub URL')).toBeInTheDocument();
            expect(screen.getByText('Please enter a valid LinkedIn URL')).toBeInTheDocument();
        });
    });

    it('autosaves changes', async () => {
        vi.useFakeTimers();
        const firstNameInput = await screen.findByLabelText(/First Name/i);

        await act(async () => {
            fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
        });

        // Advance timers by 30 seconds to trigger autosave
        await act(async () => {
            vi.advanceTimersByTime(30000);
        });
        // Flush pending promises and effects
        await act(async () => { await Promise.resolve(); });
        await act(async () => { await Promise.resolve(); });
        await act(async () => { await Promise.resolve(); });

        await waitFor(() => {
            expect(update).toHaveBeenCalledWith('current-user-id', expect.objectContaining({ firstName: 'Jane' }));
        });
        vi.useRealTimers();
    }, 15000);

    it('shows confirmation dialog on cancel with unsaved changes', async () => {
        const firstNameInput = await screen.findByLabelText(/First Name/i);
        await act(async () => {
            fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
        });
        const cancelButton = await screen.findByRole('button', { name: /Cancel/i });
        await act(async () => {
            fireEvent.click(cancelButton);
        });
        await waitFor(() => {
            expect(window.confirm).toHaveBeenCalledWith('You have unsaved changes. Are you sure you want to cancel?');
        });
    }, 10000);
});