import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RecruiterDashboard } from '../pages/RecruiterDashboard';

function renderDashboard(): void {
  render(
    <BrowserRouter>
      <RecruiterDashboard />
    </BrowserRouter>
  );
}

describe('RecruiterDashboard', () => {
  it('renders Add candidate link', () => {
    renderDashboard();
    const link = screen.getByRole('link', { name: /add candidate/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/candidates/new');
  });

  it('renders dashboard heading', () => {
    renderDashboard();
    expect(screen.getByRole('heading', { name: /recruiter dashboard/i })).toBeInTheDocument();
  });
});
