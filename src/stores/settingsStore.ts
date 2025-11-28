import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserSettings {
  profile: {
    name: string;
    email: string;
  };
  memoryRetention: {
    autoStore: boolean;
    retentionPeriod: string;
  };
}

interface SettingsState {
  settings: UserSettings;
  
  // Actions
  updateProfile: (name: string, email: string) => void;
  updateMemoryRetention: (autoStore: boolean, retentionPeriod: string) => void;
  exportData: () => void;
  deleteAccount: () => void;
}

const defaultSettings: UserSettings = {
  profile: {
    name: '',
    email: '',
  },
  memoryRetention: {
    autoStore: true,
    retentionPeriod: 'indefinite-84',
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,

      updateProfile: (name: string, email: string) => {
        set((state) => ({
          settings: {
            ...state.settings,
            profile: { name, email },
          },
        }));
      },

      updateMemoryRetention: (autoStore: boolean, retentionPeriod: string) => {
        set((state) => ({
          settings: {
            ...state.settings,
            memoryRetention: { autoStore, retentionPeriod },
          },
        }));
      },

      exportData: () => {
        const state = get();
        const dataStr = JSON.stringify(state.settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `chimera-protocol-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },

      deleteAccount: () => {
        if (confirm('Are you sure you want to delete your Chimera Protocol account? This action cannot be undone.')) {
          // In a real app, this would call an API to delete the account
          console.log('Account deletion requested');
          // Reset settings to default
          set({ settings: defaultSettings });
          // In a real app, would also logout and redirect
        }
      },
    }),
    {
      name: 'chimera-settings-storage',
    }
  )
);
