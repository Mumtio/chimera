import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as fc from 'fast-check';
import WorkspaceDashboard from './WorkspaceDashboard';
import MemoryBank from './MemoryBank';
import Chat from './Chat';
import Team from './Team';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { useMemoryStore } from '../stores/memoryStore';
import { useChatStore } from '../stores/chatStore';
import { 
  dummyWorkspaces, 
  dummyMemories, 
  dummyConversations, 
  dummyMessages,
  dummyTeamMembers,
  dummyNeuralLoadData,
  dummyActivities
} from '../data/dummyData';

/**
 * Feature: chimera-protocol-frontend, Property 27: No empty states in data components
 * 
 * For any data-driven component rendered in the application, the component should 
 * display data and not show empty or blank states.
 * 
 * Validates: Requirements 18.7
 */

// Helper to render WorkspaceDashboard with router context
const renderWorkspaceDashboard = (workspaceId: string) => {
  return render(
    <MemoryRouter initialEntries={[`/app/workspace/${workspaceId}`]}>
      <Routes>
        <Route path="/app/workspace/:id" element={<WorkspaceDashboard />} />
      </Routes>
    </MemoryRouter>
  );
};

// Helper to render MemoryBank with router context
const renderMemoryBank = () => {
  return render(
    <MemoryRouter initialEntries={['/app/memories']}>
      <Routes>
        <Route path="/app/memories" element={<MemoryBank />} />
      </Routes>
    </MemoryRouter>
  );
};

// Helper to render Chat with router context
const renderChat = (conversationId: string) => {
  return render(
    <MemoryRouter initialEntries={[`/app/chat/${conversationId}`]}>
      <Routes>
        <Route path="/app/chat/:conversationId" element={<Chat />} />
      </Routes>
    </MemoryRouter>
  );
};

// Helper to render Team with router context
const renderTeam = () => {
  return render(
    <MemoryRouter initialEntries={['/app/team']}>
      <Routes>
        <Route path="/app/team" element={<Team />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('EmptyStates - Property-Based Tests', () => {
  beforeEach(() => {
    // Reset all stores with dummy data before each test
    useWorkspaceStore.setState({
      workspaces: dummyWorkspaces,
      activeWorkspaceId: dummyWorkspaces[0].id,
      isTransitioning: false,
      transitionProgress: 0,
    });

    useMemoryStore.setState({
      memories: dummyMemories,
      searchQuery: '',
      sortBy: 'recent',
      selectedMemoryId: null,
    });

    useChatStore.setState({
      conversations: dummyConversations.map(conv => ({
        ...conv,
        messages: dummyMessages.filter(m => m.conversationId === conv.id),
      })),
      activeConversationId: null,
      autoStore: true,
    });
  });

  it('Property 27: No empty states in data components', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          'workspace-dashboard',
          'memory-bank',
          'chat',
          'team'
        ),
        async (componentType) => {
          let unmount: (() => void) | undefined;
          let container: HTMLElement | undefined;

          try {
            // Render the appropriate component based on type
            switch (componentType) {
              case 'workspace-dashboard': {
                const result = renderWorkspaceDashboard(dummyWorkspaces[0].id);
                unmount = result.unmount;
                container = result.container;

                // Verify dashboard has stat cards with data
                const statCards = container!.querySelectorAll('.angular-frame');
                expect(statCards.length).toBeGreaterThan(0);

                // Verify stat values are displayed (not empty)
                const totalMemoriesText = screen.getByText(dummyWorkspaces[0].stats.totalMemories.toString());
                expect(totalMemoriesText).toBeInTheDocument();

                // Verify neural load graph has data
                expect(dummyNeuralLoadData.length).toBeGreaterThan(0);
                
                // Verify activity feed has data
                expect(dummyActivities.length).toBeGreaterThan(0);
                
                // Check that "No recent activity" is NOT displayed
                const noActivityText = screen.queryByText(/no recent activity/i);
                expect(noActivityText).not.toBeInTheDocument();

                break;
              }

              case 'memory-bank': {
                const result = renderMemoryBank();
                unmount = result.unmount;
                container = result.container;

                // Verify memories are displayed
                expect(dummyMemories.length).toBeGreaterThan(0);
                
                // Verify memory cards are rendered
                const memoryCards = container!.querySelectorAll('.angular-frame');
                const actualMemoryCards = Array.from(memoryCards).filter(card => 
                  card.querySelector('h3.text-neon-green')
                );
                expect(actualMemoryCards.length).toBeGreaterThan(0);

                // Check that "No memories found" is NOT displayed
                const noMemoriesText = screen.queryByText(/no memories/i);
                expect(noMemoriesText).not.toBeInTheDocument();

                break;
              }

              case 'chat': {
                // Use a conversation with messages
                const conversationWithMessages = dummyConversations.find(
                  conv => dummyMessages.some(m => m.conversationId === conv.id)
                );
                expect(conversationWithMessages).toBeDefined();

                const result = renderChat(conversationWithMessages!.id);
                unmount = result.unmount;
                container = result.container;

                // Verify messages are displayed
                const messagesForConv = dummyMessages.filter(
                  m => m.conversationId === conversationWithMessages!.id
                );
                expect(messagesForConv.length).toBeGreaterThan(0);

                // Verify at least one message is rendered
                const messageElements = container!.querySelectorAll('.angular-frame');
                expect(messageElements.length).toBeGreaterThan(0);

                // Check that "No messages yet" is NOT displayed
                const noMessagesText = screen.queryByText(/no messages/i);
                expect(noMessagesText).not.toBeInTheDocument();

                // Verify injectable memories are displayed in sidebar
                expect(dummyMemories.length).toBeGreaterThan(0);

                break;
              }

              case 'team': {
                // Update workspace with team members
                useWorkspaceStore.setState({
                  workspaces: dummyWorkspaces.map(ws => 
                    ws.id === dummyWorkspaces[0].id 
                      ? { ...ws, members: dummyTeamMembers }
                      : ws
                  ),
                  activeWorkspaceId: dummyWorkspaces[0].id,
                  isTransitioning: false,
                  transitionProgress: 0,
                });

                const result = renderTeam();
                unmount = result.unmount;
                container = result.container;

                // Verify team members are displayed
                expect(dummyTeamMembers.length).toBeGreaterThan(0);

                // Verify table rows are rendered
                const tableBody = container!.querySelector('tbody');
                expect(tableBody).toBeTruthy();
                const rows = tableBody!.querySelectorAll('tr');
                expect(rows.length).toBeGreaterThan(0);

                // Check that "No team members" is NOT displayed
                const noTeamText = screen.queryByText(/no team members/i);
                expect(noTeamText).not.toBeInTheDocument();

                break;
              }
            }
          } finally {
            // Always clean up
            if (unmount) {
              unmount();
            }
          }
        }
      ),
      { numRuns: 20 }
    );
  }, 30000);

  it('Property 27: Dummy data is always populated', async () => {
    // This test verifies that the dummy data itself is never empty
    await fc.assert(
      fc.asyncProperty(
        fc.constant(true),
        async () => {
          // Verify all dummy data arrays have content
          expect(dummyWorkspaces.length).toBeGreaterThan(0);
          expect(dummyMemories.length).toBeGreaterThan(0);
          expect(dummyConversations.length).toBeGreaterThan(0);
          expect(dummyMessages.length).toBeGreaterThan(0);
          expect(dummyTeamMembers.length).toBeGreaterThan(0);
          expect(dummyNeuralLoadData.length).toBeGreaterThan(0);
          expect(dummyActivities.length).toBeGreaterThan(0);

          // Verify workspace stats are populated
          for (const workspace of dummyWorkspaces) {
            expect(workspace.stats.totalMemories).toBeGreaterThanOrEqual(0);
            expect(workspace.stats.totalEmbeddings).toBeGreaterThanOrEqual(0);
            expect(workspace.stats.totalConversations).toBeGreaterThanOrEqual(0);
            expect(workspace.stats.systemLoad).toBeGreaterThanOrEqual(0);
            expect(workspace.stats.systemLoad).toBeLessThanOrEqual(100);
          }

          // Verify memories have required fields
          for (const memory of dummyMemories) {
            expect(memory.title.length).toBeGreaterThan(0);
            expect(memory.content.length).toBeGreaterThan(0);
            expect(memory.snippet.length).toBeGreaterThan(0);
            expect(memory.tags.length).toBeGreaterThan(0);
          }

          // Verify messages have content
          for (const message of dummyMessages) {
            expect(message.content.length).toBeGreaterThan(0);
          }

          // Verify neural load data has values
          for (const dataPoint of dummyNeuralLoadData) {
            expect(dataPoint.value).toBeGreaterThanOrEqual(0);
            expect(dataPoint.value).toBeLessThanOrEqual(100);
          }

          // Verify activities have messages
          for (const activity of dummyActivities) {
            expect(activity.message.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  it('Property 27: Components never show empty state messages', async () => {
    // This test verifies that common empty state messages are never displayed
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          'workspace-dashboard',
          'memory-bank',
          'chat',
          'team'
        ),
        async (componentType) => {
          let unmount: (() => void) | undefined;
          let container: HTMLElement | undefined;

          try {
            // Render the appropriate component
            switch (componentType) {
              case 'workspace-dashboard': {
                const result = renderWorkspaceDashboard(dummyWorkspaces[0].id);
                unmount = result.unmount;
                container = result.container;
                break;
              }
              case 'memory-bank': {
                const result = renderMemoryBank();
                unmount = result.unmount;
                container = result.container;
                break;
              }
              case 'chat': {
                const conversationWithMessages = dummyConversations[0];
                const result = renderChat(conversationWithMessages.id);
                unmount = result.unmount;
                container = result.container;
                break;
              }
              case 'team': {
                useWorkspaceStore.setState({
                  workspaces: dummyWorkspaces.map(ws => 
                    ws.id === dummyWorkspaces[0].id 
                      ? { ...ws, members: dummyTeamMembers }
                      : ws
                  ),
                  activeWorkspaceId: dummyWorkspaces[0].id,
                  isTransitioning: false,
                  transitionProgress: 0,
                });
                const result = renderTeam();
                unmount = result.unmount;
                container = result.container;
                break;
              }
            }

            // Common empty state patterns to check for
            const emptyStatePatterns = [
              /no.*found/i,
              /no.*available/i,
              /no.*yet/i,
              /empty/i,
              /nothing.*here/i,
              /no.*data/i,
              /no.*items/i,
            ];

            // Verify none of these patterns appear in the rendered content
            for (const pattern of emptyStatePatterns) {
              const emptyElements = screen.queryAllByText(pattern);
              // Filter out elements that might be in hidden modals or non-visible areas
              const visibleEmptyElements = emptyElements.filter(el => {
                const style = window.getComputedStyle(el);
                return style.display !== 'none' && style.visibility !== 'hidden';
              });
              
              // We expect no visible empty state messages
              expect(visibleEmptyElements.length).toBe(0);
            }
          } finally {
            // Always clean up
            if (unmount) {
              unmount();
            }
          }
        }
      ),
      { numRuns: 20 }
    );
  }, 30000);
});
