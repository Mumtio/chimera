import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import Login from './Login';
import { useAuthStore } from '../stores/authStore';

/**
 * Feature: chimera-protocol-frontend, Property 1: Valid credentials authenticate successfully
 * 
 * For any valid email and password combination, submitting the login form 
 * should navigate the user to the main application workspace dashboard.
 * 
 * Validates: Requirements 2.2
 */

// Helper to render Login with router context
const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

// Generator for valid email addresses
const validEmailArbitrary = fc.tuple(
  fc.stringMatching(/^[a-z0-9]{3,10}$/),
  fc.constantFrom('gmail.com', 'yahoo.com', 'chimera.io', 'test.com')
).map(([local, domain]) => `${local}@${domain}`);

// Generator for valid passwords (non-empty strings)
const validPasswordArbitrary = fc.string({ minLength: 1, maxLength: 50 });

describe('Login - Property-Based Tests', () => {
  beforeEach(() => {
    // Reset auth store before each test
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
  });

  it('Property 1: Valid credentials authenticate successfully', async () => {
    await fc.assert(
      fc.asyncProperty(
        validEmailArbitrary,
        validPasswordArbitrary,
        async (email, password) => {
          const user = userEvent.setup();
          
          // Render the login page
          const { unmount } = renderLogin();
          
          // Find and fill in the email field
          const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
          await user.click(emailInput);
          await user.paste(email);
          
          // Find and fill in the password field
          const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
          await user.click(passwordInput);
          await user.paste(password);
          
          // Click the login button
          const loginButton = screen.getByRole('button', { name: /establish connection/i });
          await user.click(loginButton);
          
          // Wait for authentication to complete
          await waitFor(() => {
            const authState = useAuthStore.getState();
            expect(authState.isAuthenticated).toBe(true);
            expect(authState.user).not.toBeNull();
          }, { timeout: 1000 });
          
          // Clean up
          unmount();
        }
      ),
      { numRuns: 20 }
    );
  }, 30000);
});
