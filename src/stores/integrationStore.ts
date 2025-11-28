import { create } from 'zustand';
import type { Integration, CognitiveModel } from '../types';
import { dummyIntegrations } from '../data/dummyData';

interface IntegrationState {
  integrations: Integration[];
  
  // Actions
  saveApiKey: (provider: 'openai' | 'anthropic' | 'google', apiKey: string) => void;
  testConnection: (provider: 'openai' | 'anthropic' | 'google') => Promise<boolean>;
  disableIntegration: (provider: 'openai' | 'anthropic' | 'google') => void;
  updateIntegrationStatus: (provider: 'openai' | 'anthropic' | 'google', status: 'connected' | 'error' | 'disconnected', errorMessage?: string) => void;
  
  // Selectors
  getIntegrationByProvider: (provider: 'openai' | 'anthropic' | 'google') => Integration | undefined;
  getConnectedModels: () => CognitiveModel[];
  isProviderConnected: (provider: 'openai' | 'anthropic' | 'google') => boolean;
}

export const useIntegrationStore = create<IntegrationState>((set, get) => ({
  integrations: dummyIntegrations,

  saveApiKey: (provider, apiKey) => {
    set(state => {
      const existing = state.integrations.find(int => int.provider === provider);
      
      if (existing) {
        return {
          integrations: state.integrations.map(int =>
            int.provider === provider
              ? { ...int, apiKey, status: 'connected' as const, errorMessage: undefined }
              : int
          ),
        };
      } else {
        const newIntegration: Integration = {
          id: `int-${Date.now()}`,
          userId: 'user-1',
          provider,
          apiKey,
          status: 'connected',
          lastTested: new Date(),
        };
        return {
          integrations: [...state.integrations, newIntegration],
        };
      }
    });
  },

  testConnection: async (provider) => {
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const integration = get().integrations.find(int => int.provider === provider);
    
    if (!integration || !integration.apiKey) {
      set(state => ({
        integrations: state.integrations.map(int =>
          int.provider === provider
            ? { ...int, status: 'error' as const, errorMessage: 'No API key configured' }
            : int
        ),
      }));
      return false;
    }
    
    // Simulate successful connection
    const success = Math.random() > 0.2; // 80% success rate for demo
    
    set(state => ({
      integrations: state.integrations.map(int =>
        int.provider === provider
          ? {
              ...int,
              status: success ? 'connected' as const : 'error' as const,
              lastTested: new Date(),
              errorMessage: success ? undefined : 'Connection failed. Please check your API key.',
            }
          : int
      ),
    }));
    
    return success;
  },

  disableIntegration: (provider) => {
    set(state => ({
      integrations: state.integrations.map(int =>
        int.provider === provider
          ? { ...int, status: 'disconnected' as const, apiKey: '', errorMessage: undefined }
          : int
      ),
    }));
  },

  updateIntegrationStatus: (provider, status, errorMessage) => {
    set(state => ({
      integrations: state.integrations.map(int =>
        int.provider === provider
          ? { ...int, status, errorMessage }
          : int
      ),
    }));
  },

  getIntegrationByProvider: (provider) => {
    return get().integrations.find(int => int.provider === provider);
  },

  getConnectedModels: () => {
    const integrations = get().integrations;
    const models: CognitiveModel[] = [];
    
    integrations.forEach(int => {
      if (int.status === 'connected') {
        let model: CognitiveModel;
        
        switch (int.provider) {
          case 'openai':
            model = {
              id: 'model-gpt4o',
              provider: 'openai',
              name: 'gpt-4o',
              displayName: 'OpenAI GPT-4O',
              brainRegion: 'Left Cortex',
              status: 'connected',
              position: { x: -2, y: 1, z: 1 },
            };
            break;
          case 'anthropic':
            model = {
              id: 'model-claude',
              provider: 'anthropic',
              name: 'claude-3.5-sonnet',
              displayName: 'Anthropic Claude 3.5',
              brainRegion: 'Right Cortex',
              status: 'connected',
              position: { x: 2, y: 1, z: 1 },
            };
            break;
          case 'google':
            model = {
              id: 'model-gemini',
              provider: 'google',
              name: 'gemini-2.5-pro',
              displayName: 'Google Gemini 2.5',
              brainRegion: 'Occipital',
              status: 'connected',
              position: { x: 0, y: -1, z: 2 },
            };
            break;
        }
        
        models.push(model);
      }
    });
    
    return models;
  },

  isProviderConnected: (provider) => {
    const integration = get().integrations.find(int => int.provider === provider);
    return integration?.status === 'connected';
  },
}));
