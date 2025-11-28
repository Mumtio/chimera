import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import Console from './Console';

/**
 * Feature: chimera-protocol-frontend, Property 19: Console commands produce output
 * 
 * For any valid MCP command entered in the developer console, executing the 
 * command should display structured JSON output in the results area.
 * 
 * Validates: Requirements 11.4
 */

// Helper to render Console with router context
const renderConsole = () => {
  return render(
    <MemoryRouter>
      <Console />
    </MemoryRouter>
  );
};

// Generator for valid command types
const commandTypeArbitrary = fc.constantFrom('remember', 'search', 'inject');

// Generator for valid remember command parameters
const rememberParamsArbitrary = fc.record({
  content: fc.string({ minLength: 1, maxLength: 200 }),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
});

// Generator for valid search command parameters
const searchParamsArbitrary = fc.record({
  query: fc.string({ minLength: 1, maxLength: 100 }),
  limit: fc.integer({ min: 1, max: 50 }),
});

// Generator for valid inject command parameters
const injectParamsArbitrary = fc.record({
  memoryId: fc.string({ minLength: 1, maxLength: 50 }).map(s => `memory-${s}`),
  conversationId: fc.string({ minLength: 1, maxLength: 50 }).map(s => `conversation-${s}`),
});

// Generator for complete MCP commands
const mcpCommandArbitrary = fc.oneof(
  rememberParamsArbitrary.map(params => 
    `remember(${JSON.stringify(params)})`
  ),
  searchParamsArbitrary.map(params => 
    `search(${JSON.stringify(params)})`
  ),
  injectParamsArbitrary.map(params => 
    `inject(${JSON.stringify(params)})`
  )
);

describe('Console - Property-Based Tests', () => {
  beforeEach(() => {
    // No store setup needed for Console component
  });

  it('Property 19: Console commands produce output', async () => {
    await fc.assert(
      fc.asyncProperty(
        mcpCommandArbitrary,
        async (command) => {
          const user = userEvent.setup();

          // Render the console page
          const { unmount } = renderConsole();

          try {
            // Find the command input textarea
            const commandInput = screen.getByPlaceholderText(/enter your mcp command/i) as HTMLTextAreaElement;
            
            // Clear any existing content and type the command
            await user.clear(commandInput);
            await user.click(commandInput);
            await user.paste(command);

            // Verify the command was entered
            expect(commandInput.value).toBe(command);

            // Find and click the Execute button
            const executeButton = screen.getByRole('button', { name: /execute command/i });
            expect(executeButton).toBeInTheDocument();
            expect(executeButton).not.toBeDisabled();
            
            await user.click(executeButton);

            // Wait for the command to execute (there's a simulated delay)
            await waitFor(
              () => {
                // Check that results are displayed
                // The command should appear in the results area
                const commandElements = screen.getAllByText((content, element) => {
                  return element?.tagName.toLowerCase() === 'code' && 
                         content === command;
                });
                expect(commandElements.length).toBeGreaterThan(0);
              },
              { timeout: 2000 }
            );

            // Verify that JSON output is displayed
            // Look for the pre element that contains JSON output
            const preElements = screen.getAllByText((content, element) => {
              return element?.tagName.toLowerCase() === 'pre';
            });
            expect(preElements.length).toBeGreaterThan(0);

            // Verify that a status indicator is shown (SUCCESS or ERROR)
            const statusElements = screen.getAllByText(/success|error/i);
            expect(statusElements.length).toBeGreaterThan(0);

            // Verify that the output contains valid JSON structure
            // The output should have common fields like 'success', 'message', etc.
            const successTexts = screen.queryAllByText(/success/i);
            expect(successTexts.length).toBeGreaterThan(0);

            // Verify that structured data is present based on command type
            if (command.includes('remember(')) {
              // Remember commands should show memoryId and embedding info
              const outputTexts = screen.queryAllByText(/memoryId|embedding/i);
              expect(outputTexts.length).toBeGreaterThan(0);
            } else if (command.includes('search(')) {
              // Search commands should show results array
              const outputTexts = screen.queryAllByText(/results|totalResults/i);
              expect(outputTexts.length).toBeGreaterThan(0);
            } else if (command.includes('inject(')) {
              // Inject commands should show injectionId and context window info
              const outputTexts = screen.queryAllByText(/injectionId|contextWindow/i);
              expect(outputTexts.length).toBeGreaterThan(0);
            }

          } finally {
            // Always clean up
            unmount();
          }
        }
      ),
      { numRuns: 15 }
    );
  }, 45000);
});
