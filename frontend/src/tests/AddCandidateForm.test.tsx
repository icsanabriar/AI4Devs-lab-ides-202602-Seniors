import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddCandidateForm } from '../components/AddCandidateForm';
import type { AddCandidateFormValues } from '../components/AddCandidateForm';

const defaultValues: AddCandidateFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  education: '',
  workExperience: '',
};

function renderForm(
  overrides: Partial<{
    values: AddCandidateFormValues;
    fieldErrors: Record<string, string>;
    submitting: boolean;
    successMessage: string | null;
    errorMessage: string | null;
    selectedFileName: string | null;
    onValueChange: jest.Mock;
    onFileSelect: jest.Mock;
    onSubmit: jest.Mock;
  }> = {}
): void {
  const onSubmit = jest.fn((e: React.FormEvent) => e.preventDefault());
  render(
    <AddCandidateForm
      values={overrides.values ?? defaultValues}
      fieldErrors={overrides.fieldErrors ?? {}}
      submitting={overrides.submitting ?? false}
      successMessage={overrides.successMessage ?? null}
      errorMessage={overrides.errorMessage ?? null}
      selectedFileName={overrides.selectedFileName ?? null}
      onValueChange={overrides.onValueChange ?? jest.fn()}
      onFileSelect={overrides.onFileSelect ?? jest.fn()}
      onSubmit={overrides.onSubmit ?? onSubmit}
    />
  );
}

describe('AddCandidateForm', () => {
  it('renders all required fields and submit button', () => {
    renderForm();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add candidate/i })).toBeInTheDocument();
  });

  it('shows field errors when provided', () => {
    renderForm({
      fieldErrors: { firstName: 'First name is required', email: 'Invalid email format' },
    });
    expect(screen.getByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });

  it('shows success message when provided', () => {
    renderForm({ successMessage: 'Candidate has been added successfully.' });
    expect(screen.getByRole('alert')).toHaveTextContent(/added successfully/i);
  });

  it('shows error message when provided', () => {
    renderForm({ errorMessage: 'A candidate with this email already exists.' });
    expect(screen.getByRole('alert')).toHaveTextContent(/already exists/i);
  });

  it('calls onSubmit when submit is clicked', async () => {
    const onSubmit = jest.fn((e: React.FormEvent) => e.preventDefault());
    renderForm({ onSubmit });
    await userEvent.click(screen.getByRole('button', { name: /add candidate/i }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('disables submit button when submitting', () => {
    renderForm({ submitting: true });
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
  });

  it('shows selected file name when provided', () => {
    renderForm({ selectedFileName: 'resume.pdf' });
    expect(screen.getByText(/Selected: resume.pdf/i)).toBeInTheDocument();
  });
});
