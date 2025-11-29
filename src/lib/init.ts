/**
 * Application Initialization
 * Handles loading initial data and setting up the app state
 */

import { useWorkspaceStore } from '../stores/workspaceStore';
import { useIntegrationStore } from '../stores/integrationStore';
import { useChatStore } from '../stores/chatStore';
import { useMemoryStore } from '../stores/memoryStore';

/**
 * Initialize the application by loading all necessary data
 */
export async function initializeApp() {
  try {
    // Load workspaces first
    await useWorkspaceStore.getState().loadWorkspaces();
    
    // Load integrations
    await useIntegrationStore.getState().loadIntegrations();
    
    // Get active workspace
    const activeWorkspace = useWorkspaceStore.getState().getActiveWorkspace();
    
    if (activeWorkspace) {
      // Load workspace-specific data
      await Promise.all([
        useChatStore.getState().loadConversations(activeWorkspace.id),
        useMemoryStore.getState().loadMemories(activeWorkspace.id),
      ]);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to initialize app:', error);
    return false;
  }
}

/**
 * Load data for a specific workspace
 */
export async function loadWorkspaceData(workspaceId: string) {
  try {
    await Promise.all([
      useChatStore.getState().loadConversations(workspaceId),
      useMemoryStore.getState().loadMemories(workspaceId),
    ]);
    return true;
  } catch (error) {
    console.error('Failed to load workspace data:', error);
    return false;
  }
}
