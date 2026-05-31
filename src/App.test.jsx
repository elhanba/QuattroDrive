import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import * as AuthContext from './contexts/AuthContext';

describe('App Routing', () => {
  it('renders login page if not authenticated', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: null });
    
    // We cannot use renderWithProviders here since App itself has providers and router
    render(<App />);
    
    // The logo or login form should be present
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
  });

  it('renders dashboard if authenticated', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: { username: 'admin' } });
    
    // Provide a mocked fetch for dashboard so it doesn't crash
    global.fetch = vi.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true, data: { schedule: [], alerts: [] } })
    }));

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });
  });
});
