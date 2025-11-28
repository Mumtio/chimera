/**
 * Demo file showing how to use the Zustand stores
 * This file is for reference only and not imported in the application
 */

import { useAuthStore } from './authStore';
import { useWorkspaceStore } from './workspaceStore';
import { useMemoryStore } from './memoryStore';
import { useChatStore } from './chatStore';
import { useIntegrationStore } from './integrationStore';
import { useUIStore } from './uiStore';

// Example 1: Authentication
export function authExample() {
  const { login, logout, demoLogin, user, isAuthenticated } = useAuthStore();
  
  // Demo login
  demoLogin();
  console.log('User:', user);
  console.log('Authenticated:', isAuthenticated);
  
  // Regular login
  login('user@example.com', 'password');
  
  // Logout
  logout();
}

// Example 2: Workspace Management
export function workspaceExample() {
  const { 
    workspaces, 
    activeWorkspaceId, 
    setActiveWorkspace, 
    createWorkspace,
    getActiveWorkspace 
  } = useWorkspaceStore();
  
  console.log('All workspaces:', workspaces);
  console.log('Active workspace:', getActiveWorkspace());
  
  // Switch workspace (triggers transition animation)
  if (workspaces[1]) {
    setActiveWorkspace(workspaces[1].id);
  }
  
  // Create new workspace
  createWorkspace('My New Workspace', 'A test workspace');
}

// Example 3: Memory Management
export function memoryExample() {
  const {
    memories,
    addMemory,
    updateMemory,
    deleteMemory,
    getMemoriesByWorkspace,
    getFilteredMemories,
    setSearchQuery,
  } = useMemoryStore();
  
  console.log('All memories:', memories);
  
  // Get memories for specific workspace
  const workspaceMemories = getMemoriesByWorkspace('workspace-1');
  console.log('Workspace memories:', workspaceMemories);
  
  // Add new memory
  addMemory({
    workspaceId: 'workspace-1',
    title: 'New Memory',
    content: 'This is a new memory created programmatically',
    tags: ['test', 'demo'],
    metadata: {},
  });
  
  // Search memories
  setSearchQuery('cognitive');
  const filtered = getFilteredMemories('workspace-1');
  console.log('Filtered memories:', filtered);
  
  // Update memory
  if (memories[0]) {
    updateMemory(memories[0].id, {
      title: 'Updated Title',
    });
  }
}

// Example 4: Chat Management
export function chatExample() {
  const {
    conversations,
    createConversation,
    sendMessage,
    injectMemory,
    setAutoStore,
    getActiveConversation,
  } = useChatStore();
  
  console.log('All conversations:', conversations);
  
  // Create new conversation
  const convId = createConversation('workspace-1', 'model-gpt4o', 'Test Chat');
  
  // Send message
  sendMessage(convId, 'Hello, AI!');
  
  // Inject memory into conversation
  injectMemory(convId, 'memory-1');
  
  // Enable auto-store
  setAutoStore(true);
  
  console.log('Active conversation:', getActiveConversation());
}

// Example 5: Integration Management
export function integrationExample() {
  const {
    integrations,
    saveApiKey,
    testConnection,
    disableIntegration,
    getConnectedModels,
    isProviderConnected,
  } = useIntegrationStore();
  
  console.log('All integrations:', integrations);
  console.log('Connected models:', getConnectedModels());
  
  // Save API key
  saveApiKey('openai', 'sk-test-key-123');
  
  // Test connection
  testConnection('openai').then(success => {
    console.log('Connection test:', success ? 'Success' : 'Failed');
  });
  
  // Check if provider is connected
  console.log('OpenAI connected:', isProviderConnected('openai'));
  
  // Disable integration
  disableIntegration('google');
}

// Example 6: UI State Management
export function uiExample() {
  const {
    leftSidebarCollapsed,
    toggleLeftSidebar,
    openModal,
    closeModal,
    addNotification,
    setLoading,
  } = useUIStore();
  
  console.log('Left sidebar collapsed:', leftSidebarCollapsed);
  
  // Toggle sidebar
  toggleLeftSidebar();
  
  // Open modal
  openModal('invite-team', { workspaceId: 'workspace-1' });
  
  // Close modal
  closeModal();
  
  // Add notification
  addNotification({
    type: 'success',
    message: 'Memory saved successfully!',
    duration: 3000,
  });
  
  // Set loading state
  setLoading(true, 'Calibrating Neural Weights...');
  setTimeout(() => setLoading(false), 2000);
}
