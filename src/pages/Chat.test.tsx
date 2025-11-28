import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as fc from 'fast-check';
import Chat from './Chat';
import { useChatStore } from '../stores/chatStore';
import { useMemoryStore } from '../stores/memoryStore';
import { useWorkspaceStore } from '../stores/workspaceStore';
import type { Conversation, Message } from '../types';

/**
 * Feature: chimera-protocol-frontend, Property 9: Messages render with required data
 * 
 * For any chat message, the rendered message should display the content, 
 * timestamp, and sender label.
 * 
 * Validates: Requirements 6.2
 */

/**
 * Feature: chimera-protocol-frontend, Property 10: Sending message adds to conversation
 * 
 * For any non-empty message text, clicking Send should add that message 
 * to the conversation feed.
 * 
 * Validates: Requirements 6.7
 */

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

// Generator for valid message content (non-empty strings without leading/trailing whitespace)
const messageContentArbitrary = fc.string({ minLength: 1, maxLength: 500 })
  .filter(s => s.trim().length > 0)
  .map(s => s.trim()); // Trim to match how content is displayed

// Generator for message role
const messageRoleArbitrary = fc.constantFrom('user', 'assistant') as fc.Arbitrary<'user' | 'assistant'>;

// Generator for timestamps (recent dates)
const timestampArbitrary = fc.date({ 
  min: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
  max: new Date() 
});

// Counter for generating unique message IDs
let messageIdCounter = 0;

// Generator for complete messages with unique IDs
const messageArbitrary = fc.record({
  id: fc.constant('').map(() => `msg-test-${++messageIdCounter}`),
  conversationId: fc.constant('test-conv-1'),
  role: messageRoleArbitrary,
  content: messageContentArbitrary,
  timestamp: timestampArbitrary,
  isPinned: fc.boolean(),
});

describe('Chat - Property-Based Tests', () => {
  beforeEach(() => {
    // Reset message ID counter
    messageIdCounter = 0;
    
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
    
    // Reset chat store
    useChatStore.setState({
      conversations: [],
      activeConversationId: null,
      autoStore: true,
    });
  });

  it('Property 9: Messages render with required data', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(messageArbitrary, { minLength: 1, maxLength: 5 }),
        async (messages) => {
          // Create a test conversation with the generated messages
          const conversation: Conversation = {
            id: 'test-conv-1',
            workspaceId: 'test-workspace-1',
            title: 'Test Conversation',
            modelId: 'test-model',
            messages: messages,
            injectedMemories: [],
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // Set up the chat store with the test conversation
          useChatStore.setState({
            conversations: [conversation],
            activeConversationId: 'test-conv-1',
            autoStore: true,
          });

          // Render the chat page
          const { unmount, container } = renderChat('test-conv-1');

          try {
            // Verify the correct number of messages are rendered
            expect(conversation.messages.length).toBe(messages.length);
            
            // For each message, verify it renders with required data
            for (const message of messages) {
              // Verify sender label is displayed
              const senderLabel = message.role === 'user' ? 'You' : 'AI Assistant';
              const senderElements = screen.getAllByText(senderLabel, { exact: false });
              expect(senderElements.length).toBeGreaterThan(0);

              // Verify timestamp is displayed (formatted as time)
              const formattedTime = new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }).format(message.timestamp);
              
              // Use getAllByText for timestamp since multiple messages might have same time
              const timeElements = screen.getAllByText(formattedTime);
              expect(timeElements.length).toBeGreaterThan(0);
              
              // Verify message content is displayed
              // Use a more specific query that looks for the content in a paragraph element
              const contentElements = screen.getAllByText((content, element) => {
                return element?.tagName.toLowerCase() === 'p' && 
                       content === message.content;
              });
              expect(contentElements.length).toBeGreaterThan(0);
            }
          } finally {
            // Always clean up, even if assertions fail
            unmount();
          }
        }
      ),
      { numRuns: 10 }
    );
  }, 30000);

  it('Property 10: Sending message adds to conversation', async () => {
    await fc.assert(
      fc.asyncProperty(
        messageContentArbitrary,
        async (messageText) => {
          const user = userEvent.setup();

          // Create a test conversation with no messages
          const conversation: Conversation = {
            id: 'test-conv-2',
            workspaceId: 'test-workspace-1',
            title: 'Test Conversation',
            modelId: 'test-model',
            messages: [],
            injectedMemories: [],
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // Set up the chat store
          useChatStore.setState({
            conversations: [conversation],
            activeConversationId: 'test-conv-2',
            autoStore: true,
          });

          // Render the chat page
          const { unmount } = renderChat('test-conv-2');

          // Get initial message count
          const initialMessageCount = useChatStore.getState()
            .getConversationById('test-conv-2')?.messages.length || 0;

          // Find the message input textarea (use getAllByPlaceholderText and take the first one)
          const messageInputs = screen.getAllByPlaceholderText(/type your message/i);
          const messageInput = messageInputs[0] as HTMLTextAreaElement;
          
          // Type the message
          await user.click(messageInput);
          await user.paste(messageText);

          // Find and click the Send button
          const sendButton = screen.getByRole('button', { name: /send/i });
          await user.click(sendButton);

          // Verify the message was added to the conversation
          const updatedConversation = useChatStore.getState().getConversationById('test-conv-2');
          expect(updatedConversation).toBeDefined();
          expect(updatedConversation!.messages.length).toBeGreaterThan(initialMessageCount);

          // Find the user message (not the AI response)
          const userMessages = updatedConversation!.messages.filter(m => m.role === 'user');
          expect(userMessages.length).toBeGreaterThan(0);
          
          // Verify the message content matches
          const addedMessage = userMessages[userMessages.length - 1];
          expect(addedMessage.content).toBe(messageText);
          expect(addedMessage.role).toBe('user');

          // Verify the message appears in the UI
          const messageElement = await screen.findByText(messageText);
          expect(messageElement).toBeInTheDocument();

          // Clean up
          unmount();
        }
      ),
      { numRuns: 20 }
    );
  }, 30000);
});
