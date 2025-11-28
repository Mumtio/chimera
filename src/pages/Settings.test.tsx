import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import Settings from './Settings';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';

/**
 * Feature: chimera-protocol-frontend, Property 20: Settings changes persist
 * 
 * For any settings modification made by the user, the changes should be 
 * persisted to the configuration.
 * 
 * Validates: Requirements 12.7
 */

// Helper to render Settings with router context
const renderSettings = () => {
  return render(
    <BrowserRouter>
      <Settings />
    </BrowserRouter>
  );
};

// Generator for valid names (non-empty strings with reasonable length)
const validNameArbitrary = fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0);

// Generator for valid email addresses
const validEmailArbitrary = fc.tuple(
  fc.stringMatching(/^[a-z0-9]{3,10}$/),
  fc.constantFrom('gmail.com', 'yahoo.com', 'chimera.io', 'test.com')
).map(([local, domain]) => `${local}@${domain}`);

// Generator for retention period options
const retentionPeriodArbitrary = fc.constantFrom(
  '7-days',
  '30-days',
  '90-days',
  'indefinite-84',
  'indefinite'
);

// Generator for boolean values
const booleanArbitrary = fc.boolean();

describe('Settings - Property-Based Tests', () => {
  beforeEach(() => {
    // Reset stores before each test
    useAuthStore.setState({
      user: {
        id: 'test-user-1',
        name: 'Test User',
        email: 'test@chimera.io',
        createdAt: new Date(),
      },
      isAuthenticated: true,
      isLoading: false,
    });

    // Reset settings store to default state
    useSettingsStore.setState({
      settings: {
        profile: {
          name: '',
          email: '',
        },
        memoryRetention: {
          autoStore: true,
          retentionPeriod: 'indefinite-84',
        },
      },
    });
  });

  it('Property 20: Settings changes persist - Profile', async () => {
    await fc.assert(
      fc.asyncProperty(
        validNameArbitrary,
        validEmailArbitrary,
        async (name, email) => {
          // Render the settings page
          const { unmount } = renderSettings();
          
          try {
            const user = userEvent.setup();
            
            // Wait for the page to load
            await waitFor(() => {
              expect(screen.getAllByText(/system config/i).length).toBeGreaterThan(0);
            });
            
            // Find and fill in the name field
            const nameInput = screen.getByLabelText(/^name$/i) as HTMLInputElement;
            await user.clear(nameInput);
            await user.click(nameInput);
            await user.paste(name);
            
            // Find and fill in the email field
            const emailInput = screen.getByLabelText(/^email$/i) as HTMLInputElement;
            await user.clear(emailInput);
            await user.click(emailInput);
            await user.paste(email);
            
            // Click the save profile button
            const saveButton = screen.getByRole('button', { name: /save profile/i });
            await user.click(saveButton);
            
            // Wait for settings to be persisted
            await waitFor(() => {
              const settingsState = useSettingsStore.getState();
              expect(settingsState.settings.profile.name).toBe(name);
              expect(settingsState.settings.profile.email).toBe(email);
            }, { timeout: 1000 });
          } finally {
            // Always clean up
            unmount();
          }
        }
      ),
      { numRuns: 10 }
    );
  }, 60000);

  it('Property 20: Settings changes persist - Memory Retention', async () => {
    await fc.assert(
      fc.asyncProperty(
        booleanArbitrary,
        retentionPeriodArbitrary,
        async (autoStore, retentionPeriod) => {
          // Render the settings page
          const { unmount } = renderSettings();
          
          try {
            const user = userEvent.setup();
            
            // Wait for the page to load
            await waitFor(() => {
              expect(screen.getAllByText(/system config/i).length).toBeGreaterThan(0);
            });
            
            // Get current auto-store state
            const currentAutoStore = useSettingsStore.getState().settings.memoryRetention.autoStore;
            
            // Toggle auto-store if needed to match the generated value
            if (currentAutoStore !== autoStore) {
              const toggleButton = screen.getByLabelText(/toggle auto-store/i);
              await user.click(toggleButton);
            }
            
            // Select retention period
            const retentionSelect = screen.getByLabelText(/retention period/i) as HTMLSelectElement;
            await user.selectOptions(retentionSelect, retentionPeriod);
            
            // Click the save retention settings button
            const saveButton = screen.getByRole('button', { name: /save retention settings/i });
            await user.click(saveButton);
            
            // Wait for settings to be persisted
            await waitFor(() => {
              const settingsState = useSettingsStore.getState();
              expect(settingsState.settings.memoryRetention.autoStore).toBe(autoStore);
              expect(settingsState.settings.memoryRetention.retentionPeriod).toBe(retentionPeriod);
            }, { timeout: 1000 });
          } finally {
            // Always clean up
            unmount();
          }
        }
      ),
      { numRuns: 10 }
    );
  }, 60000);
});
