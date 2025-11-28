import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import Signup from './Signup';
import { useAuthStore } from '../stores/authStore';

/**
 * Feature: chimera-protocol-frontend, Property 2: Signup with valid data creates account
 * 
 * For any valid name, email, and password combination, completing the signup form 
 * should create an account and navigate to the main application.
 * 
 * Validates: Requirements 2.7
 */

// Helper to render Signup with router context
const renderSignup = () => {
  return render(
    <BrowserRouter>
      <Signup />
    </BrowserRouter>
  );
};

// Generator for valid names
const validNameArbitrary = fc.string({ minLength: 2, maxLength: 50 })
  .filter(name => name.trim().length >= 2);

// Generator for valid email addresses
const validEmailArbitrary = fc.tuple(
  fc.stringMatching(/^[a-z0-9]{3,10}$/),
  fc.constantFrom('gmail.com', 'yahoo.com', 'chimera.io', 'test.com')
).map(([local, domain]) => `${local}@${domain}`);

// Generator for valid passwords (non-empty strings)
const validPasswordArbitrary = fc.string({ minLength: 1, maxLength: 50 });

describe('Signup - Property-Based Tests', () => {
  beforeEach(() => {
    // Reset auth store before each test
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
  });

  it('Property 2: Signup with valid data creates account', async () => {
    await fc.assert(
      fc.asyncProperty(
        validNameArbitrary,
        validEmailArbitrary,
        validPasswordArbitrary,
        async (name, email, password) => {
          const user = userEvent.setup();
          
          // Render the signup page
          const { unmount } = renderSignup();
          
          // Find and fill in the name field
          const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
          await user.click(nameInput);
          await user.paste(name);
          
          // Find and fill in the email field
          const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
          await user.click(emailInput);
          await user.paste(email);
          
          // Find and fill in the password field
          const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
          await user.click(passwordInput);
          await user.paste(password);
          
          // Click the signup button
          const signupButton = screen.getByRole('button', { name: /sign up/i });
          await user.click(signupButton);
          
          // Wait for account creation to complete
          await waitFor(() => {
            const authState = useAuthStore.getState();
            expect(authState.isAuthenticated).toBe(true);
            expect(authState.user).not.toBeNull();
            expect(authState.user?.name).toBe(name);
            expect(authState.user?.email).toBe(email);
          }, { timeout: 1000 });
          
          // Clean up
          unmount();
        }
      ),
      { numRuns: 20 }
    );
  }, 30000);
});
