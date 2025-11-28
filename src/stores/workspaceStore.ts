import { create } from 'zustand';
import type { Workspace } from '../types';
import { dummyWorkspaces } from '../data/dummyData';

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  previousWorkspaceId: string | null;
  isTransitioning: boolean;
  transitionProgress: number;
  
  // Actions
  setActiveWorkspace: (id: string) => void;
  createWorkspace: (name: string, description?: string) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;
  startTransition: () => void;
  updateTransitionProgress: (progress: number) => void;
  completeTransition: () => void;
  
  // Selectors
  getActiveWorkspace: () => Workspace | null;
  getWorkspaceById: (id: string) => Workspace | undefined;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: dummyWorkspaces,
  activeWorkspaceId: dummyWorkspaces[0]?.id || null,
  previousWorkspaceId: null,
  isTransitioning: false,
  transitionProgress: 0,

  setActiveWorkspace: (id: string) => {
    const currentId = get().activeWorkspaceId;
    if (currentId !== id) {
      // Store previous workspace ID for transition display
      set({ 
        previousWorkspaceId: currentId,
        isTransitioning: true, 
        transitionProgress: 0 
      });
      
      // Simulate transition animation with smooth progress
      const duration = 3000; // 3 seconds total
      const intervalTime = 50; // Update every 50ms
      const steps = duration / intervalTime;
      const progressIncrement = 100 / steps;
      
      const interval = setInterval(() => {
        const progress = get().transitionProgress;
        if (progress >= 100) {
          clearInterval(interval);
          set({ 
            activeWorkspaceId: id, 
            isTransitioning: false, 
            transitionProgress: 0,
            previousWorkspaceId: null,
          });
        } else {
          set({ transitionProgress: Math.min(progress + progressIncrement, 100) });
        }
      }, intervalTime);
    }
  },

  createWorkspace: (name: string, description?: string) => {
    const newWorkspace: Workspace = {
      id: `workspace-${Date.now()}`,
      name,
      description,
      ownerId: 'user-1', // Current user
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
    };
    
    set(state => ({ 
      workspaces: [...state.workspaces, newWorkspace],
      activeWorkspaceId: newWorkspace.id,
    }));
  },

  updateWorkspace: (id: string, updates: Partial<Workspace>) => {
    set(state => ({
      workspaces: state.workspaces.map(ws => 
        ws.id === id ? { ...ws, ...updates, updatedAt: new Date() } : ws
      ),
    }));
  },

  deleteWorkspace: (id: string) => {
    set(state => {
      const newWorkspaces = state.workspaces.filter(ws => ws.id !== id);
      const newActiveId = state.activeWorkspaceId === id 
        ? (newWorkspaces[0]?.id || null)
        : state.activeWorkspaceId;
      
      return {
        workspaces: newWorkspaces,
        activeWorkspaceId: newActiveId,
      };
    });
  },

  startTransition: () => {
    set({ isTransitioning: true, transitionProgress: 0 });
  },

  updateTransitionProgress: (progress: number) => {
    set({ transitionProgress: progress });
  },

  completeTransition: () => {
    set({ isTransitioning: false, transitionProgress: 0 });
  },

  getActiveWorkspace: () => {
    const state = get();
    return state.workspaces.find(ws => ws.id === state.activeWorkspaceId) || null;
  },

  getWorkspaceById: (id: string) => {
    return get().workspaces.find(ws => ws.id === id);
  },
}));
