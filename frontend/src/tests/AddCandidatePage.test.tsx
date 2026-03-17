import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AddCandidatePage } from '../pages/AddCandidatePage';
import * as candidateService from '../services/candidateService';

jest.mock('../services/candidateService');

const mockCreateCandidate = candidateService.createCandidate as jest.MockedFunction<
  typeof candidateService.createCandidate
>;

function renderPage(): void {
  render(
    <BrowserRouter>
      <AddCandidatePage />
    </BrowserRouter>
  );
}

describe('AddCandidatePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows validation errors when submitting with empty required fields', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: /add candidate/i }));
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
    expect(mockCreateCandidate).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid email', async () => {
    renderPage();
    await userEvent.type(screen.getByLabelText(/first name/i), 'Jane');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email');
    await userEvent.click(screen.getByRole('button', { name: /add candidate/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
    expect(mockCreateCandidate).not.toHaveBeenCalled();
  });

  it('calls createCandidate and shows success message when submit is valid', async () => {
    mockCreateCandidate.mockResolvedValue({
      id: 1,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: null,
      address: null,
      education: null,
      workExperience: null,
      createdAt: '',
      updatedAt: '',
    });
    renderPage();
    await userEvent.type(screen.getByLabelText(/first name/i), 'Jane');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.click(screen.getByRole('button', { name: /add candidate/i }));
    await waitFor(() => {
      expect(mockCreateCandidate).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
        })
      );
    });
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/added successfully/i);
    });
  });

  it('shows error message when createCandidate fails with 409', async () => {
    mockCreateCandidate.mockRejectedValue({
      status: 409,
      code: 'DUPLICATE_EMAIL',
      message: 'A candidate with this email already exists.',
    });
    renderPage();
    await userEvent.type(screen.getByLabelText(/first name/i), 'Jane');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.click(screen.getByRole('button', { name: /add candidate/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/already exists/i);
    });
  });

  it('shows generic error message when createCandidate fails with network error', async () => {
    mockCreateCandidate.mockRejectedValue(new Error('Network error'));
    renderPage();
    await userEvent.type(screen.getByLabelText(/first name/i), 'Jane');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.click(screen.getByRole('button', { name: /add candidate/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong|try again/i);
    });
  });
});
