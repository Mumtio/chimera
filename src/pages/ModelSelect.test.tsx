import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import ModelSelect from './ModelSelect';
import { useIntegrationStore } from '../stores/integrationStore';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { useChatStore } from '../stores/chatStore';
import type { Integration, CognitiveModel } from '../types';

/**
 * Feature: chimera-protocol-frontend, Property 6: Brain displays all connected models
 * 
 * For any set of connected cognitive models in the integrations configuration,
 * the brain interface should display a node for each connected model.
 * 
 * Validates: Requirements 5.2
 */

// Mock the BrainVisualization component to avoid 3D rendering issues in tests
vi.mock('../components/brain/BrainVisualization', () => ({
  default: ({ models, onModelSelect }: { models: CognitiveModel[], onModelSelect: (id: string) => void }) => (
    <div data-testid="brain-visualization">
      {models.map(model => (
        <div 
          key={model.id} 
          data-testid={`model-node-${model.id}`}
          data-model-name={model.displayName}
          onClick={() => onModelSelect(model.id)}
        >
          {model.displayName}
        </div>
      ))}
    </div>
  ),
}));

// Helper to render ModelSelect with router context
const renderModelSelect = () => {
  return render(
    <BrowserRouter>
      <ModelSelect />
    </BrowserRouter>
  );
};

// Generator for integration providers
const providerArbitrary = fc.constantFrom('openai', 'anthropic', 'google');

// Generator for a connected integration
const connectedIntegrationArbitrary = fc.record({
  id: fc.string({ minLength: 5, maxLength: 20 }),
  userId: fc.constant('user-1'),
  provider: providerArbitrary,
  apiKey: fc.string({ minLength: 10, maxLength: 50 }),
  status: fc.constant('connected' as const),
  lastTested: fc.constant(new Date()),
});

// Generator for a set of unique connected integrations
const connectedIntegrationsArbitrary = fc
  .array(connectedIntegrationArbitrary, { minLength: 1, maxLength: 3 })
  .map(integrations => {
    // Ensure unique providers
    const uniqueProviders = new Set<string>();
    return integrations.filter(int => {
      if (uniqueProviders.has(int.provider)) {
        return false;
      }
      uniqueProviders.add(int.provider);
      return true;
    });
  })
  .filter(integrations => integrations.length > 0);

describe('ModelSelect - Property-Based Tests', () => {
  beforeEach(() => {
    // Set up a default workspace
    useWorkspaceStore.setState({
      activeWorkspace: {
        id: 'workspace-1',
        name: 'Test Workspace',
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
      },
    });
  });

  it('Property 6: Brain displays all connected models', async () => {
    await fc.assert(
      fc.asyncProperty(
        connectedIntegrationsArbitrary,
        async (integrations: Integration[]) => {
          // Set up the integration store with the generated integrations
          useIntegrationStore.setState({ integrations });
          
          // Get the expected models
          const expectedModels = useIntegrationStore.getState().getConnectedModels();
          
          // Render the ModelSelect page
          const { unmount } = renderModelSelect();
          
          // Verify that the number of models matches the number of connected integrations
          expect(expectedModels.length).toBe(integrations.length);
          
          // Verify each model has the correct properties
          expectedModels.forEach((model: CognitiveModel) => {
            expect(model.status).toBe('connected');
            expect(model.position).toBeDefined();
            expect(model.position.x).toBeDefined();
            expect(model.position.y).toBeDefined();
            expect(model.position.z).toBeDefined();
            expect(model.displayName).toBeDefined();
            expect(model.brainRegion).toBeDefined();
          });
          
          // Verify the brain visualization is rendered
          const brainViz = screen.getByTestId('brain-visualization');
          expect(brainViz).toBeDefined();
          
          // Verify each model node is rendered in the brain visualization
          expectedModels.forEach((model: CognitiveModel) => {
            const modelNode = screen.getByTestId(`model-node-${model.id}`);
            expect(modelNode).toBeDefined();
            expect(modelNode.getAttribute('data-model-name')).toBe(model.displayName);
          });
          
          // Clean up
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);
});

/**
 * Feature: chimera-protocol-frontend, Property 7: Model selection creates conversation
 * 
 * For any available cognitive model node in the brain interface,
 * clicking that node should initialize a new chat conversation with that model.
 * 
 * Validates: Requirements 5.7
 */

describe('ModelSelect - Model Selection Property Tests', () => {
  beforeEach(() => {
    // Set up a default workspace
    useWorkspaceStore.setState({
      activeWorkspace: {
        id: 'workspace-1',
        name: 'Test Workspace',
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
      },
    });
  });

  it('Property 7: Model selection creates conversation', async () => {
    await fc.assert(
      fc.asyncProperty(
        connectedIntegrationsArbitrary,
        async (integrations: Integration[]) => {
          // Set up the integration store with the generated integrations
          useIntegrationStore.setState({ integrations });
          
          // Get the expected models
          const expectedModels = useIntegrationStore.getState().getConnectedModels();
          
          // Pick a random model to select
          const modelToSelect = expectedModels[Math.floor(Math.random() * expectedModels.length)];
          
          // Get initial conversation count
          const initialConversations = useChatStore.getState().conversations;
          const initialCount = initialConversations.length;
          
          // Render the ModelSelect page
          const { unmount } = renderModelSelect();
          
          // Find and click the model node
          const modelNode = screen.getByTestId(`model-node-${modelToSelect.id}`);
          await userEvent.click(modelNode);
          
          // Wait for the conversation to be created
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Verify a new conversation was created
          const updatedConversations = useChatStore.getState().conversations;
          expect(updatedConversations.length).toBe(initialCount + 1);
          
          // Verify the new conversation has the correct model
          const newConversation = updatedConversations[updatedConversations.length - 1];
          expect(newConversation.modelId).toBe(modelToSelect.id);
          expect(newConversation.workspaceId).toBe('workspace-1');
          expect(newConversation.status).toBe('active');
          
          // Clean up
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);
});

/**
 * Feature: chimera-protocol-frontend, Property 8: Integration changes update brain interface
 * 
 * For any change in integration configuration (adding or removing models),
 * the brain interface should dynamically update to reflect the available models.
 * 
 * Validates: Requirements 5.11
 */

describe('ModelSelect - Dynamic Model Updates Property Tests', () => {
  beforeEach(() => {
    // Set up a default workspace
    useWorkspaceStore.setState({
      activeWorkspace: {
        id: 'workspace-1',
        name: 'Test Workspace',
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
      },
    });
  });

  it('Property 8: Integration changes update brain interface', async () => {
    await fc.assert(
      fc.asyncProperty(
        connectedIntegrationsArbitrary,
        connectedIntegrationsArbitrary,
        async (initialIntegrations: Integration[], updatedIntegrations: Integration[]) => {
          // Set up the integration store with initial integrations
          useIntegrationStore.setState({ integrations: initialIntegrations });
          
          // Get initial models
          const initialModels = useIntegrationStore.getState().getConnectedModels();
          
          // Render the ModelSelect page
          const { unmount, rerender } = renderModelSelect();
          
          // Verify initial models are displayed
          initialModels.forEach((model: CognitiveModel) => {
            const modelNode = screen.getByTestId(`model-node-${model.id}`);
            expect(modelNode).toBeDefined();
          });
          
          // Update the integration store with new integrations
          useIntegrationStore.setState({ integrations: updatedIntegrations });
          
          // Get updated models
          const updatedModels = useIntegrationStore.getState().getConnectedModels();
          
          // Re-render the component
          rerender(
            <BrowserRouter>
              <ModelSelect />
            </BrowserRouter>
          );
          
          // Wait for re-render
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Verify updated models are displayed
          updatedModels.forEach((model: CognitiveModel) => {
            const modelNode = screen.getByTestId(`model-node-${model.id}`);
            expect(modelNode).toBeDefined();
          });
          
          // Verify the count matches
          const brainViz = screen.getByTestId('brain-visualization');
          const modelNodes = brainViz.querySelectorAll('[data-testid^="model-node-"]');
          expect(modelNodes.length).toBe(updatedModels.length);
          
          // Clean up
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);
});
