import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

test('renders recruiter dashboard with Add candidate link', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const addLink = screen.getByRole('link', { name: /add candidate/i });
  expect(addLink).toBeInTheDocument();
  expect(addLink).toHaveAttribute('href', '/candidates/new');
});
