import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as fc from 'fast-check';
import Integrations from './Integrations';
import { useIntegrationStore } from '../stores/integrationStore';
import type { Integration } from '../types';

/**
 * Feature: chimera-protocol-frontend, Property 16: Integration panels have masked inputs
 * 
 * For any integration panel (OpenAI, Anthropic, Google), an API key input field 
 * with masked characters should be provided.
 * 
 * Validates: Requirements 10.3
 */

/**
 * Feature: chimera-protocol-frontend, Property 17: Integration status reflects configuration
 * 
 * For any integration, the status indicator should display "Online" when connected 
 * or "Error" when there is a connection problem.
 * 
 * Validates: Requirements 10.4
 */

/**
 * Feature: chimera-protocol-frontend, Property 18: Integration panels have action buttons
 * 
 * For any integration panel, "Save Key", "Test", and "Disable" action buttons 
 * should be available.
 * 
 * Validates: Requirements 10.5
 */

// Helper to render Integrations with router context
const renderIntegrations = () => {
  return render(
    <MemoryRouter initialEntries={['/app/integrations']}>
      <Routes>
        <Route path="/app/integrations" element={<Integrations />} />
      </Routes>
    </MemoryRouter>
  );
};

// Generator for provider types
const providerArbitrary = fc.constantFrom('openai', 'anthropic', 'google') as fc.Arbitrary<Integration['provider']>;

// Generator for integration status
const statusArbitrary = fc.constantFrom('connected', 'error', 'disconnected') as fc.Arbitrary<Integration['status']>;

// Generator for API keys (masked format)
const apiKeyArbitrary = fc.string({ minLength: 20, maxLength: 50 });

// Generator for error messages
const errorMessageArbitrary = fc.option(
  fc.constantFrom(
    'Connection failed. Please check your API key.',
    'Invalid API key format',
    'Rate limit exceeded',
    'Network error'
  ),
  { nil: undefined }
);

// Counter for generating unique integration IDs
let integrationIdCounter = 0;

// Generator for integrations
const integrationArbitrary = fc.record({
  id: fc.constant('').map(() => `int-test-${++integrationIdCounter}`),
  userId: fc.constant('user-1'),
  provider: providerArbitrary,
  apiKey: apiKeyArbitrary,
  status: statusArbitrary,
  lastTested: fc.option(fc.date(), { nil: undefined }),
  errorMessage: errorMessageArbitrary,
});

describe('Integrations - Property-Based Tests', () => {
  beforeEach(() => {
    // Reset integration ID counter
    integrationIdCounter = 0;
    
    // Reset integration store before each test
    useIntegrationStore.setState({
      integrations: [],
    });
  });

  it('Property 16: Integration panels have masked inputs', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(integrationArbitrary, { minLength: 0, maxLength: 3 }),
        async (integrations) => {
          // Set up the integration store with the generated integrations
          useIntegrationStore.setState({
            integrations,
          });

          // Render the integrations page
          const { unmount, container } = renderIntegrations();

          try {
            // All three providers should always have panels (OpenAI, Anthropic, Google)
            const providers = ['openai', 'anthropic', 'google'];
            
            for (const provider of providers) {
              // Find the panel for this provider
              let panelTitle: string;
              switch (provider) {
                case 'openai':
                  panelTitle = 'GPT-4o';
                  break;
                case 'anthropic':
                  panelTitle = 'Claude 3.5';
                  break;
                case 'google':
                  panelTitle = 'Gemini 2.5';
                  break;
              }

              // Find the panel by title
              const panelHeading = screen.getByText(panelTitle);
              expect(panelHeading).toBeTruthy();
            }

            // Find all password inputs (API key inputs are type="password")
            const passwordInputs = container.querySelectorAll('input[type="password"]');
            
            // We should have exactly 3 inputs (one per provider panel)
            expect(passwordInputs.length).toBe(3);
          } finally {
            // Always clean up
            unmount();
          }
        }
      ),
      { numRuns: 20 }
    );
  }, 30000);

  it('Property 17: Integration status reflects configuration', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(integrationArbitrary, { minLength: 1, maxLength: 3 }),
        async (generatedIntegrations) => {
          // Ensure unique providers (take only the first integration per provider)
          const integrationsByProvider = new Map<string, Integration>();
          for (const integration of generatedIntegrations) {
            if (!integrationsByProvider.has(integration.provider)) {
              integrationsByProvider.set(integration.provider, integration);
            }
          }
          const integrations = Array.from(integrationsByProvider.values());

          // Set up the integration store with the generated integrations
          useIntegrationStore.setState({
            integrations,
          });

          // Render the integrations page
          const { unmount } = renderIntegrations();

          try {
            // For each integration, verify the status is displayed correctly
            for (const integration of integrations) {
              let expectedStatusText: string;
              
              switch (integration.status) {
                case 'connected':
                  expectedStatusText = 'Online';
                  break;
                case 'error':
                  expectedStatusText = 'Error';
                  break;
                case 'disconnected':
                  expectedStatusText = 'Disconnected';
                  break;
              }

              // Find the status text (should appear at least once)
              const statusElements = screen.getAllByText(expectedStatusText, { exact: false });
              expect(statusElements.length).toBeGreaterThan(0);

              // If there's an error message, verify it's displayed
              if (integration.status === 'error' && integration.errorMessage) {
                const errorElements = screen.queryAllByText(integration.errorMessage);
                expect(errorElements.length).toBeGreaterThan(0);
              }
            }
          } finally {
            // Always clean up
            unmount();
          }
        }
      ),
      { numRuns: 20 }
    );
  }, 30000);

  it('Property 18: Integration panels have action buttons', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(integrationArbitrary, { minLength: 0, maxLength: 3 }),
        async (integrations) => {
          // Set up the integration store with the generated integrations
          useIntegrationStore.setState({
            integrations,
          });

          // Render the integrations page
          const { unmount } = renderIntegrations();

          try {
            // All three providers should always have panels with action buttons
            const providers = ['openai', 'anthropic', 'google'];
            
            for (const provider of providers) {
              // Find the panel for this provider
              let panelTitle: string;
              switch (provider) {
                case 'openai':
                  panelTitle = 'GPT-4o';
                  break;
                case 'anthropic':
                  panelTitle = 'Claude 3.5';
                  break;
                case 'google':
                  panelTitle = 'Gemini 2.5';
                  break;
              }

              // Find the panel by title
              const panelHeading = screen.getByText(panelTitle);
              expect(panelHeading).toBeTruthy();
            }

            // Verify all three action buttons exist for each panel
            // We should have 3 panels × 3 buttons = 9 buttons total
            const saveButtons = screen.getAllByRole('button', { name: /save key/i });
            expect(saveButtons.length).toBe(3);

            const testButtons = screen.getAllByRole('button', { name: /test/i });
            expect(testButtons.length).toBe(3);

            const disableButtons = screen.getAllByRole('button', { name: /disable/i });
            expect(disableButtons.length).toBe(3);
          } finally {
            // Always clean up
            unmount();
          }
        }
      ),
      { numRuns: 20 }
    );
  }, 30000);
});
