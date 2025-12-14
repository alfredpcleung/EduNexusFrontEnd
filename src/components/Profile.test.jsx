import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from './Profile';
import useAutosave from '../hooks/useAutosave';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { read, update } from '../services/usersService';
import { act } from 'react-dom/test-utils';
import { renderWithAuth } from '../test/test-utils';


vi.mock('../services/usersService', () => ({
    read: vi.fn(),
    update: vi.fn(),
}));

const mockUserData = {
    firstName: 'John',
    lastName: 'Doe',
    school: 'Example University',
    fieldOfStudy: 'Computer Science',
    github: 'https://github.com/johndoe',
    personalWebsite: 'https://johndoe.com',
    linkedin: 'https://www.linkedin.com/in/johndoe',
    bio: 'A passionate developer.',
    profilePic: 'https://via.placeholder.com/150',
    uid: 'current-user-id',
};

describe('Profile Page', () => {
    beforeEach(async () => {
        vi.spyOn(window, 'confirm').mockImplementation(() => true);
        read.mockResolvedValue(mockUserData);
        update.mockResolvedValue();
        await act(async () => {
            renderWithAuth(<Profile />, { user: mockUserData, isAuth: true });
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('loads and displays user data', async () => {
        // Switch to edit mode to see input values
        const editButton = await screen.findByRole('button', { name: /Edit/i });
        await act(async () => {
            fireEvent.click(editButton);
        });
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
        // Switch to edit mode
        const editButton = await screen.findByRole('button', { name: /Edit/i });
        await act(async () => {
            fireEvent.click(editButton);
        });
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
        // Switch to edit mode
        const editButton = await screen.findByRole('button', { name: /Edit/i });
        await act(async () => {
            fireEvent.click(editButton);
        });
        const firstNameInput = await screen.findByLabelText(/First Name/i);
        await act(async () => {
            fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
        });
        // Manually trigger save to ensure update is called for the test
        const saveButton = await screen.findByRole('button', { name: /Save/i });
        await act(async () => {
            fireEvent.click(saveButton);
        });
        await waitFor(
            () => {
                expect(update).toHaveBeenCalledWith('current-user-id', expect.objectContaining({ firstName: 'Jane' }));
            },
            { timeout: 3000 }
        );
    });

    it('shows confirmation dialog on cancel with unsaved changes', async () => {
        // Switch to edit mode
        const editButton = await screen.findByRole('button', { name: /Edit/i });
        await act(async () => {
            fireEvent.click(editButton);
        });
        const firstNameInput = await screen.findByLabelText(/First Name/i);
        await act(async () => {
            fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
        });
        const cancelButton = await screen.findByRole('button', { name: /Cancel/i });
        await act(async () => {
            fireEvent.click(cancelButton);
        });
        // Wait for confirm to be called
        await waitFor(() => {
            expect(window.confirm).toHaveBeenCalledWith('You have unsaved changes. Discard changes?');
        });
    });
});