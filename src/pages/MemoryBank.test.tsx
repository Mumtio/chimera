import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as fc from 'fast-check';
import MemoryBank from './MemoryBank';
import { useMemoryStore } from '../stores/memoryStore';
import { useWorkspaceStore } from '../stores/workspaceStore';
import type { Memory } from '../types';

/**
 * Feature: chimera-protocol-frontend, Property 11: Memory cards display all fields
 * 
 * For any memory in the memory bank, the memory card should display the title, 
 * snippet, tags, and timestamp.
 * 
 * Validates: Requirements 7.2
 */

/**
 * Feature: chimera-protocol-frontend, Property 12: Memory cards have action buttons
 * 
 * For any memory card displayed, the card should provide Edit, Delete, and View 
 * action buttons.
 * 
 * Validates: Requirements 7.4
 */

/**
 * Feature: chimera-protocol-frontend, Property 13: Memory card click navigates to detail
 * 
 * For any memory card, clicking the card should navigate to the memory detail 
 * page for that specific memory.
 * 
 * Validates: Requirements 7.5
 */

// Helper to render MemoryBank with router context
const renderMemoryBank = () => {
  return render(
    <MemoryRouter initialEntries={['/app/memories']}>
      <Routes>
        <Route path="/app/memories" element={<MemoryBank />} />
        <Route path="/app/memories/:id" element={<div>Memory Detail Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

// Generator for valid memory titles (non-empty strings)
const memoryTitleArbitrary = fc.string({ minLength: 5, maxLength: 100 })
  .filter(s => s.trim().length > 0)
  .map(s => s.trim());

// Generator for memory content
const memoryContentArbitrary = fc.string({ minLength: 50, maxLength: 500 })
  .filter(s => s.trim().length > 0)
  .map(s => s.trim());

// Generator for tags (array of 1-5 tags)
const tagsArbitrary = fc.array(
  fc.string({ minLength: 3, maxLength: 15 })
    .filter(s => /^[a-z0-9-]+$/.test(s)),
  { minLength: 1, maxLength: 5 }
);

// Generator for timestamps (recent dates)
const timestampArbitrary = fc.date({ 
  min: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
  max: new Date() 
});

// Counter for generating unique memory IDs
let memoryIdCounter = 0;

// Generator for complete memories with unique IDs
const memoryArbitrary = fc.record({
  id: fc.constant('').map(() => `memory-test-${++memoryIdCounter}`),
  workspaceId: fc.constant('test-workspace-1'),
  title: memoryTitleArbitrary,
  content: memoryContentArbitrary,
  snippet: fc.constant(''), // Will be generated from content
  tags: tagsArbitrary,
  embedding: fc.constant(undefined),
  metadata: fc.constant({}),
  createdAt: timestampArbitrary,
  updatedAt: timestampArbitrary,
  version: fc.constant(1),
}).map(mem => ({
  ...mem,
  snippet: mem.content.substring(0, 150) + (mem.content.length > 150 ? '...' : ''),
}));

describe('MemoryBank - Property-Based Tests', () => {
  beforeEach(() => {
    // Reset memory ID counter
    memoryIdCounter = 0;
    
    // Reset stores before each test
    useWorkspaceStore.setState({
      workspaces: [{
        id: 'test-workspace-1',
        name: 'Test Workspace',
        description: 'Test workspace',
        ownerId: 'user-1',
        members: [],
        stats: {
          totalMemories: 0,
          totalEmbeddings: 0,
          totalConversations: 0,
          systemLoad: 0,
          lastActivity: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }],
      activeWorkspaceId: 'test-workspace-1',
      isTransitioning: false,
      transitionProgress: 0,
    });

    useMemoryStore.setState({
      memories: [],
      searchQuery: '',
      sortBy: 'recent',
      selectedMemoryId: null,
    });
  });

  it('Property 11: Memory cards display all fields', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(memoryArbitrary, { minLength: 1, maxLength: 5 }),
        async (memories) => {
          // Set up the memory store with the generated memories
          useMemoryStore.setState({
            memories: memories,
            searchQuery: '',
            sortBy: 'recent',
            selectedMemoryId: null,
          });

          // Render the memory bank page
          const { unmount, container } = renderMemoryBank();

          try {
            // Verify the correct number of memory cards are rendered
            const memoryCards = container.querySelectorAll('.angular-frame');
            // Subtract 1 for the header controls frame
            const actualMemoryCards = Array.from(memoryCards).filter(card => 
              card.querySelector('h3.text-neon-green')
            );
            expect(actualMemoryCards.length).toBe(memories.length);

            // For each memory, verify all fields are displayed
            for (const memory of memories) {
              // Verify title is displayed (use getAllByText since title might match snippet)
              const titleElements = screen.getAllByText(memory.title);
              expect(titleElements.length).toBeGreaterThan(0);

              // Verify snippet is displayed
              const snippetElements = screen.getAllByText(memory.snippet);
              expect(snippetElements.length).toBeGreaterThan(0);

              // Verify all tags are displayed (use Set to get unique tags)
              const uniqueTags = [...new Set(memory.tags)];
              for (const tag of uniqueTags) {
                const tagElements = screen.getAllByText(`#${tag}`);
                expect(tagElements.length).toBeGreaterThan(0);
              }

              // Verify timestamp is displayed (formatted)
              const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }).format(memory.updatedAt);
              
              // Use getAllByText since multiple memories might have the same timestamp
              const timestampElements = screen.getAllByText(formattedDate);
              expect(timestampElements.length).toBeGreaterThan(0);
            }
          } finally {
            // Always clean up
            unmount();
          }
        }
      ),
      { numRuns: 10 }
    );
  }, 30000);

  it('Property 12: Memory cards have action buttons', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(memoryArbitrary, { minLength: 1, maxLength: 3 }),
        async (memories) => {
          // Set up the memory store with the generated memories
          useMemoryStore.setState({
            memories: memories,
            searchQuery: '',
            sortBy: 'recent',
            selectedMemoryId: null,
          });

          // Render the memory bank page
          const { unmount, container } = renderMemoryBank();

          try {
            // For each memory, verify action buttons exist (even if hidden by CSS)
            for (const memory of memories) {
              // Find all memory cards
              const memoryCards = container.querySelectorAll('.angular-frame');
              const actualMemoryCards = Array.from(memoryCards).filter(card => 
                card.querySelector('h3.text-neon-green')
              );

              // For each card, verify buttons exist in the DOM
              for (const card of actualMemoryCards) {
                // Verify View button exists (even if opacity is 0)
                const viewButtons = within(card as HTMLElement).getAllByRole('button', { name: /view/i });
                expect(viewButtons.length).toBeGreaterThan(0);

                // Verify Edit button exists
                const editButtons = within(card as HTMLElement).getAllByRole('button', { name: /edit/i });
                expect(editButtons.length).toBeGreaterThan(0);

                // Verify Delete button exists
                const deleteButtons = within(card as HTMLElement).getAllByRole('button', { name: /delete/i });
                expect(deleteButtons.length).toBeGreaterThan(0);
              }
            }
          } finally {
            // Always clean up
            unmount();
          }
        }
      ),
      { numRuns: 10 }
    );
  }, 30000);

  it('Property 13: Memory card click navigates to detail', async () => {
    await fc.assert(
      fc.asyncProperty(
        memoryArbitrary,
        async (memory) => {
          const user = userEvent.setup();

          // Set up the memory store with a single memory
          useMemoryStore.setState({
            memories: [memory],
            searchQuery: '',
            sortBy: 'recent',
            selectedMemoryId: null,
          });

          // Render the memory bank page
          const { unmount, container } = renderMemoryBank();

          try {
            // Find the memory card by looking for the angular-frame with the title
            const memoryCards = container.querySelectorAll('.angular-frame');
            const memoryCard = Array.from(memoryCards).find(card => 
              card.querySelector('h3.text-neon-green')
            );
            expect(memoryCard).toBeTruthy();

            // Click on the memory card
            await user.click(memoryCard!);

            // Verify navigation occurred by checking for the detail page content
            const detailPageElement = await screen.findByText('Memory Detail Page');
            expect(detailPageElement).toBeInTheDocument();
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
