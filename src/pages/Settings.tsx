import React, { useState, useEffect } from 'react';
import { Save, Download, Trash2, User, Database } from 'lucide-react';
import { CyberButton } from '../components/ui/CyberButton';
import { CyberCard } from '../components/ui/CyberCard';
import { CyberInput } from '../components/ui/CyberInput';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';

const Settings: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const settings = useSettingsStore(state => state.settings);
  const updateProfile = useSettingsStore(state => state.updateProfile);
  const updateMemoryRetention = useSettingsStore(state => state.updateMemoryRetention);
  const exportData = useSettingsStore(state => state.exportData);
  const deleteAccount = useSettingsStore(state => state.deleteAccount);

  // Local state for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [autoStore, setAutoStore] = useState(true);
  const [retentionPeriod, setRetentionPeriod] = useState('indefinite-84');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize form with user data or settings
  useEffect(() => {
    if (user) {
      setName(settings.profile.name || user.name);
      setEmail(settings.profile.email || user.email);
    }
    setAutoStore(settings.memoryRetention.autoStore);
    setRetentionPeriod(settings.memoryRetention.retentionPeriod);
  }, [user, settings]);

  const handleSaveProfile = () => {
    updateProfile(name, email);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveMemoryRetention = () => {
    updateMemoryRetention(autoStore, retentionPeriod);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportData = () => {
    exportData();
  };

  const handleDeleteAccount = () => {
    deleteAccount();
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 relative">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-neon-green rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-neon-green rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-cyber text-neon-green mb-2">
            System Config
          </h1>
          <p className="text-gray-400 text-sm">
            Configure your profile, memory retention, and account settings
          </p>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-neon-green/10 border-2 border-neon-green angular-frame">
            <p className="text-neon-green text-sm font-mono">
              ✓ Settings saved successfully
            </p>
          </div>
        )}

        {/* Profile Section */}
        <CyberCard 
          title="Profile Settings" 
          subtitle="Update your personal information"
          glowBorder={false} 
          cornerAccents
          className="mb-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-neon-green text-sm font-medium mb-2">
                Name
              </label>
              <CyberInput
                type="text"
                value={name}
                onChange={setName}
                placeholder="Enter your name"
                name="name"
              />
            </div>

            <div>
              <label className="block text-neon-green text-sm font-medium mb-2">
                Email
              </label>
              <CyberInput
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="Enter your email"
                name="email"
              />
            </div>

            <div className="flex justify-end mt-6">
              <CyberButton
                variant="primary"
                glow
                onClick={handleSaveProfile}
              >
                <Save size={16} className="inline mr-2" />
                Save Profile
              </CyberButton>
            </div>
          </div>
        </CyberCard>

        {/* Memory Retention Section */}
        <CyberCard 
          title="Memory Retention" 
          subtitle="Configure automatic memory storage and retention policies"
          glowBorder={false} 
          cornerAccents
          className="mb-6"
        >
          <div className="space-y-6">
            {/* Auto-Store Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium text-sm block mb-1">
                  Auto-Store Conversations
                </label>
                <p className="text-gray-400 text-xs">
                  Automatically save conversation messages to memory bank
                </p>
              </div>
              <button
                onClick={() => setAutoStore(!autoStore)}
                className={`
                  relative w-14 h-7 rounded-full transition-colors duration-300
                  ${autoStore ? 'bg-neon-green' : 'bg-deep-teal'}
                `}
                aria-label="Toggle auto-store"
              >
                <span
                  className={`
                    absolute top-1 left-1 w-5 h-5 bg-black rounded-full
                    transition-transform duration-300
                    ${autoStore ? 'translate-x-7' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>

            {/* Retention Period Dropdown */}
            <div>
              <label htmlFor="retention-period" className="block text-gray-400 text-xs mb-2 uppercase tracking-wider">
                Retention Period
              </label>
              <select
                id="retention-period"
                value={retentionPeriod}
                onChange={(e) => setRetentionPeriod(e.target.value)}
                className="w-full px-4 py-3 bg-black border-2 border-deep-teal 
                           text-neon-green font-mono text-sm
                           focus:border-neon-green focus:shadow-neon focus:outline-none
                           transition-all duration-300 angular-frame cursor-pointer"
              >
                <option value="7-days">7 Days</option>
                <option value="30-days">30 Days</option>
                <option value="90-days">90 Days</option>
                <option value="indefinite-84">Indefinite (84 days)</option>
                <option value="indefinite">Indefinite (Forever)</option>
              </select>
              <p className="text-gray-500 text-xs mt-2 font-mono">
                Memories older than this period will be archived
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <CyberButton
                variant="primary"
                glow
                onClick={handleSaveMemoryRetention}
              >
                <Database size={16} className="inline mr-2" />
                Save Retention Settings
              </CyberButton>
            </div>
          </div>
        </CyberCard>

        {/* Data Management Section */}
        <CyberCard 
          title="Data Management" 
          subtitle="Export or delete your account data"
          glowBorder={false} 
          cornerAccents
          className="mb-6"
        >
          <div className="space-y-4">
            {/* Export Data */}
            <div className="flex items-center justify-between p-4 bg-deep-teal/10 border border-deep-teal angular-frame">
              <div>
                <h4 className="text-white font-medium text-sm mb-1">
                  Export All Data (JSON)
                </h4>
                <p className="text-gray-400 text-xs">
                  Download all your settings and configuration as JSON
                </p>
              </div>
              <CyberButton
                variant="secondary"
                onClick={handleExportData}
              >
                <Download size={16} className="inline mr-2" />
                Export
              </CyberButton>
            </div>

            {/* Delete Account */}
            <div className="flex items-center justify-between p-4 bg-error-red/5 border border-error-red/30 angular-frame">
              <div>
                <h4 className="text-error-red font-medium text-sm mb-1">
                  Delete Chimera Account
                </h4>
                <p className="text-gray-400 text-xs">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <CyberButton
                variant="danger"
                onClick={handleDeleteAccount}
              >
                <Trash2 size={16} className="inline mr-2" />
                Delete Account
              </CyberButton>
            </div>
          </div>
        </CyberCard>

        {/* System Info */}
        <div className="mt-8 p-4 border border-deep-teal/30 angular-frame">
          <div className="flex items-center justify-between text-xs font-mono text-gray-500">
            <span>Chimera Protocol v1.0.0</span>
            <span>Neural Core: Online</span>
            <span>Last Sync: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
