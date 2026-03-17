/**
 * Page for adding a new candidate: form state, validation, submit, and API call.
 */
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddCandidatePage.css';
import { AddCandidateForm } from '../components/AddCandidateForm';
import type { AddCandidateFormValues } from '../components/AddCandidateForm';
import { createCandidate, uploadResume } from '../services/candidateService';
import type { CreateCandidateInput } from '../types/candidate';

/** Default form values for add candidate. */
const initialValues: AddCandidateFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  education: '',
  workExperience: '',
};

/** Simple email format check for client-side validation. */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns field-level errors for the form values. */
function validate(values: AddCandidateFormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!values.firstName.trim()) {
    errors.firstName = 'First name is required';
  }
  if (!values.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }
  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(values.email)) {
    errors.email = 'Invalid email format';
  }
  return errors;
}

/** Builds API payload from form values. */
function buildPayload(values: AddCandidateFormValues): CreateCandidateInput {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim() || undefined,
    address: values.address.trim() || undefined,
    education: values.education.trim()
      ? [{ institution: values.education.trim() }]
      : undefined,
    workExperience: values.workExperience.trim()
      ? [{ company: values.workExperience.trim() }]
      : undefined,
  };
}

/** Add-candidate page with form, validation, and create API integration. */
export function AddCandidatePage(): React.ReactElement {
  const navigate = useNavigate();
  const [values, setValues] = useState<AddCandidateFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  /** Updates a form field and clears its error. */
  const onValueChange = useCallback((field: keyof AddCandidateFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrorMessage(null);
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }, [fieldErrors]);

  /** Validates form, creates candidate (and uploads resume if selected), then resets or sets errors. */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage(null);
      const errors = validate(values);
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      setFieldErrors({});
      setSubmitting(true);
      try {
        const payload = buildPayload(values);
        const data = await createCandidate(payload);
        if (selectedFile) {
          try {
            await uploadResume(data.id, selectedFile);
          } catch (uploadErr: unknown) {
            const msg = uploadErr instanceof Error ? uploadErr.message : 'Resume upload failed.';
            setErrorMessage(`Candidate created but resume upload failed: ${msg}`);
            setSubmitting(false);
            return;
          }
        }
        setSuccessMessage('Candidate has been added successfully.');
        setValues(initialValues);
        setSelectedFile(null);
        setFieldErrors({});
      } catch (err: unknown) {
        const o = err as { status?: number; message?: string; code?: string; fields?: Array<{ path: string; message: string }> };
        const status = o?.status;
        const message = err instanceof Error ? err.message : o?.message;
        const code = o?.code;
        const fields = o?.fields;

        if (fields && Array.isArray(fields) && fields.length > 0) {
          const next: Record<string, string> = {};
          fields.forEach(({ path, message: msg }) => {
            next[path] = msg;
          });
          setFieldErrors(next);
        } else {
          setFieldErrors({});
        }

        if (status === 409 || code === 'DUPLICATE_EMAIL') {
          setErrorMessage('A candidate with this email already exists.');
        } else if (status === 400 && message) {
          setErrorMessage(message);
        } else {
          setErrorMessage('Something went wrong. Please try again.');
        }
      } finally {
        setSubmitting(false);
      }
    },
    [values, selectedFile]
  );

  /** Updates the selected CV file from the file input. */
  const handleFileSelect = useCallback((file: File | null) => {
    setSelectedFile(file);
  }, []);

  return (
    <main className="add-candidate-page">
      <AddCandidateForm
        values={values}
        fieldErrors={fieldErrors}
        submitting={submitting}
        successMessage={successMessage}
        errorMessage={errorMessage}
        selectedFileName={selectedFile?.name ?? null}
        onValueChange={onValueChange}
        onFileSelect={handleFileSelect}
        onSubmit={handleSubmit}
      />
      <p className="add-candidate-back">
        <button type="button" onClick={() => navigate('/')}>
          Back to dashboard
        </button>
      </p>
    </main>
  );
}
