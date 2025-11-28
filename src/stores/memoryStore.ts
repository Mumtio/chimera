import { create } from 'zustand';
import type { Memory } from '../types';
import { dummyMemories } from '../data/dummyData';

interface MemoryState {
  memories: Memory[];
  searchQuery: string;
  sortBy: 'recent' | 'title' | 'relevance';
  selectedMemoryId: string | null;
  
  // Actions
  addMemory: (memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
  updateMemory: (id: string, updates: Partial<Memory>) => void;
  deleteMemory: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: 'recent' | 'title' | 'relevance') => void;
  setSelectedMemory: (id: string | null) => void;
  reEmbedMemory: (id: string) => Promise<void>;
  
  // Selectors
  getMemoriesByWorkspace: (workspaceId: string) => Memory[];
  getMemoryById: (id: string) => Memory | undefined;
  getFilteredMemories: (workspaceId: string) => Memory[];
}

export const useMemoryStore = create<MemoryState>((set, get) => ({
  memories: dummyMemories,
  searchQuery: '',
  sortBy: 'recent',
  selectedMemoryId: null,

  addMemory: (memoryData) => {
    const newMemory: Memory = {
      ...memoryData,
      id: `memory-${Date.now()}`,
      snippet: memoryData.content.substring(0, 150) + (memoryData.content.length > 150 ? '...' : ''),
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    };
    
    set(state => ({ memories: [...state.memories, newMemory] }));
  },

  updateMemory: (id: string, updates: Partial<Memory>) => {
    set(state => ({
      memories: state.memories.map(mem => 
        mem.id === id 
          ? { 
              ...mem, 
              ...updates, 
              snippet: updates.content 
                ? updates.content.substring(0, 150) + (updates.content.length > 150 ? '...' : '')
                : mem.snippet,
              updatedAt: new Date(),
              version: mem.version + 1,
            } 
          : mem
      ),
    }));
  },

  deleteMemory: (id: string) => {
    set(state => ({
      memories: state.memories.filter(mem => mem.id !== id),
      selectedMemoryId: state.selectedMemoryId === id ? null : state.selectedMemoryId,
    }));
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setSortBy: (sortBy: 'recent' | 'title' | 'relevance') => {
    set({ sortBy });
  },

  setSelectedMemory: (id: string | null) => {
    set({ selectedMemoryId: id });
  },

  reEmbedMemory: async (id: string) => {
    // Simulate re-embedding process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    set(state => ({
      memories: state.memories.map(mem => 
        mem.id === id 
          ? { ...mem, updatedAt: new Date(), version: mem.version + 1 }
          : mem
      ),
    }));
  },

  getMemoriesByWorkspace: (workspaceId: string) => {
    return get().memories.filter(mem => mem.workspaceId === workspaceId);
  },

  getMemoryById: (id: string) => {
    return get().memories.find(mem => mem.id === id);
  },

  getFilteredMemories: (workspaceId: string) => {
    const state = get();
    let filtered = state.memories.filter(mem => mem.workspaceId === workspaceId);
    
    // Apply search filter
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(mem => 
        mem.title.toLowerCase().includes(query) ||
        mem.content.toLowerCase().includes(query) ||
        mem.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    switch (state.sortBy) {
      case 'recent':
        filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'relevance':
        // For now, same as recent. Would use embedding similarity in real app
        filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        break;
    }
    
    return filtered;
  },
}));
