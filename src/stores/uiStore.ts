import { create } from 'zustand';

interface UIState {
  // Sidebar state
  leftSidebarCollapsed: boolean;
  rightSidebarCollapsed: boolean;
  
  // Loading states
  isLoading: boolean;
  loadingMessage: string;
  
  // Modal states
  activeModal: string | null;
  modalData: any;
  
  // Theme
  theme: 'dark' | 'light';
  
  // Notifications
  notifications: Notification[];
  
  // Actions
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setLoading: (isLoading: boolean, message?: string) => void;
  openModal: (modalId: string, data?: any) => void;
  closeModal: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  duration?: number;
}

export const useUIStore = create<UIState>((set, get) => ({
  leftSidebarCollapsed: false,
  rightSidebarCollapsed: false,
  isLoading: false,
  loadingMessage: '',
  activeModal: null,
  modalData: null,
  theme: 'dark',
  notifications: [],

  toggleLeftSidebar: () => {
    set(state => ({ leftSidebarCollapsed: !state.leftSidebarCollapsed }));
  },

  toggleRightSidebar: () => {
    set(state => ({ rightSidebarCollapsed: !state.rightSidebarCollapsed }));
  },

  setLoading: (isLoading: boolean, message: string = '') => {
    set({ isLoading, loadingMessage: message });
  },

  openModal: (modalId: string, data?: any) => {
    set({ activeModal: modalId, modalData: data });
  },

  closeModal: () => {
    set({ activeModal: null, modalData: null });
  },

  setTheme: (theme: 'dark' | 'light') => {
    set({ theme });
  },

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
    };
    
    set(state => ({
      notifications: [...state.notifications, newNotification],
    }));
    
    // Auto-remove after duration
    if (notification.duration) {
      setTimeout(() => {
        get().removeNotification(newNotification.id);
      }, notification.duration);
    }
  },

  removeNotification: (id: string) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));
