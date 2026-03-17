import React from 'react';
import './AddCandidateForm.css';

const ACCEPTED_CV_TYPES = '.pdf,.docx';

export interface AddCandidateFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  workExperience: string;
}

export interface AddCandidateFormProps {
  values: AddCandidateFormValues;
  fieldErrors: Record<string, string>;
  submitting: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  selectedFileName: string | null;
  onValueChange: (field: keyof AddCandidateFormValues, value: string) => void;
  onFileSelect: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddCandidateForm({
  values,
  fieldErrors,
  submitting,
  successMessage,
  errorMessage,
  selectedFileName,
  onValueChange,
  onFileSelect,
  onSubmit,
}: AddCandidateFormProps): React.ReactElement {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      onFileSelect(null);
      return;
    }
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExtensions = /\.(pdf|docx)$/i;
    if (!allowedTypes.includes(file.type) && !allowedExtensions.test(file.name)) {
      onFileSelect(null);
      return;
    }
    onFileSelect(file);
  };

  return (
    <form onSubmit={onSubmit} className="add-candidate-form" noValidate>
      <h1>Add candidate</h1>

      {successMessage && (
        <div role="alert" className="add-candidate-message add-candidate-message--success">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div role="alert" className="add-candidate-message add-candidate-message--error">
          {errorMessage}
        </div>
      )}

      <div className="add-candidate-field">
        <label htmlFor="firstName">
          First name <span aria-hidden="true">*</span>
        </label>
        <input
          id="firstName"
          type="text"
          value={values.firstName}
          onChange={(e) => onValueChange('firstName', e.target.value)}
          aria-required="true"
          aria-invalid={Boolean(fieldErrors.firstName)}
          aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
        />
        {fieldErrors.firstName && (
          <span id="firstName-error" className="add-candidate-field-error">
            {fieldErrors.firstName}
          </span>
        )}
      </div>

      <div className="add-candidate-field">
        <label htmlFor="lastName">
          Last name <span aria-hidden="true">*</span>
        </label>
        <input
          id="lastName"
          type="text"
          value={values.lastName}
          onChange={(e) => onValueChange('lastName', e.target.value)}
          aria-required="true"
          aria-invalid={Boolean(fieldErrors.lastName)}
          aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
        />
        {fieldErrors.lastName && (
          <span id="lastName-error" className="add-candidate-field-error">
            {fieldErrors.lastName}
          </span>
        )}
      </div>

      <div className="add-candidate-field">
        <label htmlFor="email">
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => onValueChange('email', e.target.value)}
          aria-required="true"
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
        />
        {fieldErrors.email && (
          <span id="email-error" className="add-candidate-field-error">
            {fieldErrors.email}
          </span>
        )}
      </div>

      <div className="add-candidate-field">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="text"
          value={values.phone}
          onChange={(e) => onValueChange('phone', e.target.value)}
          aria-invalid={Boolean(fieldErrors.phone)}
        />
        {fieldErrors.phone && (
          <span className="add-candidate-field-error">{fieldErrors.phone}</span>
        )}
      </div>

      <div className="add-candidate-field">
        <label htmlFor="address">Address</label>
        <input
          id="address"
          type="text"
          value={values.address}
          onChange={(e) => onValueChange('address', e.target.value)}
          aria-invalid={Boolean(fieldErrors.address)}
        />
        {fieldErrors.address && (
          <span className="add-candidate-field-error">{fieldErrors.address}</span>
        )}
      </div>

      <div className="add-candidate-field">
        <label htmlFor="education">Education (optional)</label>
        <textarea
          id="education"
          value={values.education}
          onChange={(e) => onValueChange('education', e.target.value)}
          rows={3}
        />
      </div>

      <div className="add-candidate-field">
        <label htmlFor="workExperience">Work experience (optional)</label>
        <textarea
          id="workExperience"
          value={values.workExperience}
          onChange={(e) => onValueChange('workExperience', e.target.value)}
          rows={3}
        />
      </div>

      <div className="add-candidate-field">
        <label htmlFor="cv">CV (optional, PDF or DOCX)</label>
        <input
          id="cv"
          type="file"
          accept={ACCEPTED_CV_TYPES}
          onChange={handleFileChange}
          aria-describedby="cv-hint"
        />
        <span id="cv-hint" className="add-candidate-hint">
          {selectedFileName ? `Selected: ${selectedFileName}` : 'No file chosen'}
        </span>
      </div>

      <button
        type="submit"
        className="add-candidate-submit"
        disabled={submitting}
      >
        {submitting ? 'Saving…' : 'Add candidate'}
      </button>
    </form>
  );
}
