/**
 * Recruiter dashboard page: welcome message and link to add candidate.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import './RecruiterDashboard.css';

/** Main recruiter dashboard view. */
export function RecruiterDashboard(): React.ReactElement {
  return (
    <main className="recruiter-dashboard">
      <h1>Recruiter dashboard</h1>
      <p>Welcome to the LTI Talent Tracking System.</p>
      <Link to="/candidates/new" className="recruiter-dashboard-add-link">
        Add candidate
      </Link>
    </main>
  );
}
