import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as fc from 'fast-check';
import Team from './Team';
import { useWorkspaceStore } from '../stores/workspaceStore';
import type { TeamMember, User } from '../types';
import { dummyUsers } from '../data/dummyData';

/**
 * Feature: chimera-protocol-frontend, Property 14: Team members show status indicators
 * 
 * For any team member listed, the display should show a status indicator 
 * reflecting their online, away, or offline state.
 * 
 * Validates: Requirements 9.3
 */

/**
 * Feature: chimera-protocol-frontend, Property 15: Team members have action buttons
 * 
 * For any team member displayed, action buttons for changing roles and removing 
 * members should be available.
 * 
 * Validates: Requirements 9.4
 */

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

// Generator for team member status
const statusArbitrary = fc.constantFrom('online', 'away', 'offline') as fc.Arbitrary<TeamMember['status']>;

// Generator for team member role
const roleArbitrary = fc.constantFrom('admin', 'researcher', 'observer') as fc.Arbitrary<TeamMember['role']>;

// Generator for dates (recent join dates)
const joinDateArbitrary = fc.date({ 
  min: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // Last year
  max: new Date() 
});

// Counter for generating unique team member IDs
let teamMemberIdCounter = 0;

// Generator for team members
const teamMemberArbitrary = fc.record({
  id: fc.constant('').map(() => `team-test-${++teamMemberIdCounter}`),
  userId: fc.constantFrom(...dummyUsers.map(u => u.id)),
  workspaceId: fc.constant('test-workspace-1'),
  role: roleArbitrary,
  status: statusArbitrary,
  joinedAt: joinDateArbitrary,
});

describe('Team - Property-Based Tests', () => {
  beforeEach(() => {
    // Reset team member ID counter
    teamMemberIdCounter = 0;
    
    // Reset workspace store before each test
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
  });

  it('Property 14: Team members show status indicators', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(teamMemberArbitrary, { minLength: 1, maxLength: 5 }),
        async (teamMembers) => {
          // Set up the workspace store with the generated team members
          useWorkspaceStore.setState({
            workspaces: [{
              id: 'test-workspace-1',
              name: 'Test Workspace',
              description: 'Test workspace',
              ownerId: 'user-1',
              members: teamMembers,
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

          // Render the team page
          const { unmount, container } = renderTeam();

          try {
            // For each team member, verify status indicator is displayed
            for (const member of teamMembers) {
              // Find the status text (displayed in lowercase)
              const statusElements = screen.getAllByText(member.status, { exact: false });
              expect(statusElements.length).toBeGreaterThan(0);

              // Verify the Circle icon is present (status indicator dot)
              // We can check for the presence of SVG circles in the table
              const tableBody = container.querySelector('tbody');
              expect(tableBody).toBeTruthy();
              
              const circles = tableBody!.querySelectorAll('circle');
              expect(circles.length).toBeGreaterThanOrEqual(teamMembers.length);
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

  it('Property 15: Team members have action buttons', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(teamMemberArbitrary, { minLength: 1, maxLength: 5 }),
        async (teamMembers) => {
          // Set up the workspace store with the generated team members
          useWorkspaceStore.setState({
            workspaces: [{
              id: 'test-workspace-1',
              name: 'Test Workspace',
              description: 'Test workspace',
              ownerId: 'user-1',
              members: teamMembers,
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

          // Render the team page
          const { unmount, container } = renderTeam();

          try {
            // Find the table body
            const tableBody = container.querySelector('tbody');
            expect(tableBody).toBeTruthy();

            // Get all table rows (one per team member)
            const rows = tableBody!.querySelectorAll('tr');
            expect(rows.length).toBe(teamMembers.length);

            // For each row, verify action button exists
            for (const row of Array.from(rows)) {
              // Find the action button (MoreVertical icon button)
              const actionButtons = within(row as HTMLElement).getAllByRole('button', { 
                name: /member actions/i 
              });
              expect(actionButtons.length).toBeGreaterThan(0);

              // Verify the button has the MoreVertical icon (SVG)
              const svg = actionButtons[0].querySelector('svg');
              expect(svg).toBeTruthy();
            }

            // Verify we have the correct number of action buttons (one per member)
            const allActionButtons = screen.getAllByRole('button', { 
              name: /member actions/i 
            });
            expect(allActionButtons.length).toBe(teamMembers.length);
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
