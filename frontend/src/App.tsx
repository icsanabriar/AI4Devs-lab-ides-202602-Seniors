/**
 * Root App component: defines routes for dashboard and add-candidate page.
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { AddCandidatePage } from './pages/AddCandidatePage';
import './App.css';

/** Main application component with routing. */
function App(): React.ReactElement {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<RecruiterDashboard />} />
          <Route path="/candidates/new" element={<AddCandidatePage />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
