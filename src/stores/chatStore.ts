import { create } from 'zustand';
import type { Conversation, Message } from '../types';
import { conversationApi } from '../lib/api';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  autoStore: boolean;
  isLoading: boolean;
  
  // Actions
  loadConversations: (workspaceId: string) => Promise<void>;
  createConversation: (workspaceId: string, modelId: string, title?: string) => Promise<string>;
  updateConversation: (id: string, updates: Partial<Conversation>) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  setActiveConversation: (id: string | null) => void;
  loadConversationMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, getAiResponse?: boolean) => Promise<void>;
  pinMessage: (conversationId: string, messageId: string) => Promise<void>;
  unpinMessage: (conversationId: string, messageId: string) => Promise<void>;
  deleteMessage: (conversationId: string, messageId: string) => Promise<void>;
  injectMemory: (conversationId: string, memoryId: string) => Promise<void>;
  removeInjectedMemory: (conversationId: string, memoryId: string) => Promise<void>;
  setAutoStore: (enabled: boolean) => void;
  
  // Selectors
  getConversationsByWorkspace: (workspaceId: string) => Conversation[];
  getConversationById: (id: string) => Conversation | undefined;
  getActiveConversation: () => Conversation | null;
  getMessageById: (id: string) => Message | undefined;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  autoStore: true,
  isLoading: false,

  loadConversations: async (workspaceId: string) => {
    set({ isLoading: true });
    try {
      const response = await conversationApi.list(workspaceId);
      const conversations = response.conversations.map(conv => ({
        ...conv,
        messages: [],
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
      }));
      
      set({ conversations, isLoading: false });
    } catch (error) {
      console.error('Failed to load conversations:', error);
      set({ isLoading: false });
    }
  },

  createConversation: async (workspaceId: string, modelId: string, title?: string) => {
    try {
      const response = await conversationApi.create(workspaceId, title || 'New Conversation', modelId);
      const newConversation: Conversation = {
        ...response,
        messages: response.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
      };
      
      set(state => ({
        conversations: [...state.conversations, newConversation],
        activeConversationId: newConversation.id,
      }));
      
      return newConversation.id;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw error;
    }
  },

  updateConversation: async (id: string, updates: Partial<Conversation>) => {
    try {
      const response = await conversationApi.update(id, updates);
      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === id ? {
            ...conv,
            ...response,
            messages: conv.messages,
            createdAt: new Date(response.createdAt),
            updatedAt: new Date(response.updatedAt),
          } : conv
        ),
      }));
    } catch (error) {
      console.error('Failed to update conversation:', error);
      throw error;
    }
  },

  deleteConversation: async (id: string) => {
    try {
      await conversationApi.delete(id);
      set(state => ({
        conversations: state.conversations.filter(conv => conv.id !== id),
        activeConversationId: state.activeConversationId === id ? null : state.activeConversationId,
      }));
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      throw error;
    }
  },

  setActiveConversation: (id: string | null) => {
    set({ activeConversationId: id });
    
    // Load messages if not already loaded
    if (id) {
      const conv = get().getConversationById(id);
      if (conv && conv.messages.length === 0) {
        get().loadConversationMessages(id);
      }
    }
  },

  loadConversationMessages: async (conversationId: string) => {
    try {
      const response = await conversationApi.get(conversationId);
      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId ? {
            ...conv,
            messages: response.messages.map(msg => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
            injectedMemories: response.injectedMemories,
          } : conv
        ),
      }));
    } catch (error) {
      console.error('Failed to load conversation messages:', error);
    }
  },

  sendMessage: async (conversationId: string, content: string, getAiResponse: boolean = true) => {
    try {
      const response = await conversationApi.sendMessage(conversationId, content, getAiResponse);
      
      const userMessage: Message = {
        ...response.userMessage,
        timestamp: new Date(response.userMessage.timestamp),
      };
      
      const messages = [userMessage];
      
      if (response.assistantMessage) {
        messages.push({
          ...response.assistantMessage,
          timestamp: new Date(response.assistantMessage.timestamp),
        });
      }
      
      set(state => ({
        conversations: state.conversations.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, ...messages],
              updatedAt: new Date(),
            };
          }
          return conv;
        }),
      }));
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },

  pinMessage: async (conversationId: string, messageId: string) => {
    try {
      await conversationApi.updateMessage(conversationId, messageId, { isPinned: true });
      set(state => ({
        conversations: state.conversations.map(conv => ({
          ...conv,
          messages: conv.messages.map(msg =>
            msg.id === messageId ? { ...msg, isPinned: true } : msg
          ),
        })),
      }));
    } catch (error) {
      console.error('Failed to pin message:', error);
      throw error;
    }
  },

  unpinMessage: async (conversationId: string, messageId: string) => {
    try {
      await conversationApi.updateMessage(conversationId, messageId, { isPinned: false });
      set(state => ({
        conversations: state.conversations.map(conv => ({
          ...conv,
          messages: conv.messages.map(msg =>
            msg.id === messageId ? { ...msg, isPinned: false } : msg
          ),
        })),
      }));
    } catch (error) {
      console.error('Failed to unpin message:', error);
      throw error;
    }
  },

  deleteMessage: async (conversationId: string, messageId: string) => {
    try {
      await conversationApi.deleteMessage(conversationId, messageId);
      set(state => ({
        conversations: state.conversations.map(conv => ({
          ...conv,
          messages: conv.messages.filter(msg => msg.id !== messageId),
        })),
      }));
    } catch (error) {
      console.error('Failed to delete message:', error);
      throw error;
    }
  },

  injectMemory: async (conversationId: string, memoryId: string) => {
    try {
      await conversationApi.injectMemory(conversationId, memoryId);
      set(state => ({
        conversations: state.conversations.map(conv => {
          if (conv.id === conversationId && !conv.injectedMemories.includes(memoryId)) {
            return {
              ...conv,
              injectedMemories: [...conv.injectedMemories, memoryId],
              updatedAt: new Date(),
            };
          }
          return conv;
        }),
      }));
    } catch (error) {
      console.error('Failed to inject memory:', error);
      throw error;
    }
  },

  removeInjectedMemory: async (conversationId: string, memoryId: string) => {
    try {
      await conversationApi.removeInjectedMemory(conversationId, memoryId);
      set(state => ({
        conversations: state.conversations.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              injectedMemories: conv.injectedMemories.filter(id => id !== memoryId),
              updatedAt: new Date(),
            };
          }
          return conv;
        }),
      }));
    } catch (error) {
      console.error('Failed to remove injected memory:', error);
      throw error;
    }
  },

  setAutoStore: (enabled: boolean) => {
    set({ autoStore: enabled });
  },

  getConversationsByWorkspace: (workspaceId: string) => {
    return get().conversations.filter(conv => conv.workspaceId === workspaceId);
  },

  getConversationById: (id: string) => {
    return get().conversations.find(conv => conv.id === id);
  },

  getActiveConversation: () => {
    const state = get();
    return state.conversations.find(conv => conv.id === state.activeConversationId) || null;
  },

  getMessageById: (id: string) => {
    const conversations = get().conversations;
    for (const conv of conversations) {
      const message = conv.messages.find(msg => msg.id === id);
      if (message) return message;
    }
    return undefined;
  },
}));
