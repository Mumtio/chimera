import React, { useState } from 'react';
import { useIntegrationStore } from '../stores/integrationStore';
import { CyberCard } from '../components/ui/CyberCard';
import { CyberButton } from '../components/ui/CyberButton';
import { CyberInput } from '../components/ui/CyberInput';
import { Brain, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface IntegrationPanelProps {
  provider: 'openai' | 'anthropic' | 'google';
  title: string;
  subtitle: string;
  brainRegion: string;
}

const IntegrationPanel: React.FC<IntegrationPanelProps> = ({
  provider,
  title,
  subtitle,
  brainRegion,
}) => {
  const {
    getIntegrationByProvider,
    saveApiKey,
    testConnection,
    disableIntegration,
  } = useIntegrationStore();

  const integration = getIntegrationByProvider(provider);
  const [apiKey, setApiKey] = useState(integration?.apiKey || '');
  const [isTesting, setIsTesting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setHasUnsavedChanges(value !== (integration?.apiKey || ''));
  };

  const handleSave = () => {
    if (apiKey.trim()) {
      saveApiKey(provider, apiKey);
      setHasUnsavedChanges(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    await testConnection(provider);
    setIsTesting(false);
  };

  const handleDisable = () => {
    disableIntegration(provider);
    setApiKey('');
    setHasUnsavedChanges(false);
  };

  const getStatusIcon = () => {
    if (!integration) return <AlertCircle className="w-5 h-5 text-gray-500" />;
    
    switch (integration.status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-neon-green" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-error-red" />;
      case 'disconnected':
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    if (!integration) return 'Disconnected';
    
    switch (integration.status) {
      case 'connected':
        return 'Online';
      case 'error':
        return 'Error';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = () => {
    if (!integration) return 'text-gray-500';
    
    switch (integration.status) {
      case 'connected':
        return 'text-neon-green';
      case 'error':
        return 'text-error-red';
      case 'disconnected':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <CyberCard
      title={title}
      subtitle={subtitle}
      glowBorder={integration?.status === 'connected'}
      cornerAccents
      className="h-full"
    >
      <div className="space-y-4">
        {/* Brain Region */}
        <div className="flex items-center gap-2 text-sm">
          <Brain className="w-4 h-4 text-neon-green" />
          <span className="text-gray-400">Region:</span>
          <span className="text-neon-green font-mono">{brainRegion}</span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={`font-bold uppercase tracking-wider ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        {/* Error Message */}
        {integration?.errorMessage && (
          <div className="p-3 border border-error-red bg-error-red/10 angular-frame">
            <p className="text-error-red text-sm">{integration.errorMessage}</p>
          </div>
        )}

        {/* API Key Input */}
        <div>
          <label className="block text-neon-green text-sm font-medium mb-2">
            API Key
          </label>
          <CyberInput
            type="password"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={handleApiKeyChange}
          />
        </div>

        {/* Last Tested */}
        {integration?.lastTested && (
          <div className="text-xs text-gray-500">
            Last tested: {integration.lastTested.toLocaleString()}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <CyberButton
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!hasUnsavedChanges || !apiKey.trim()}
          >
            Save Key
          </CyberButton>
          <CyberButton
            variant="secondary"
            size="sm"
            onClick={handleTest}
            disabled={!apiKey.trim() || isTesting}
          >
            {isTesting ? 'Testing...' : 'Test'}
          </CyberButton>
          <CyberButton
            variant="danger"
            size="sm"
            onClick={handleDisable}
            disabled={!integration || integration.status === 'disconnected'}
          >
            Disable
          </CyberButton>
        </div>
      </div>
    </CyberCard>
  );
};

const Integrations: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-cyber text-neon-green mb-2">
              Cortex Keys
            </h1>
            <p className="text-gray-400">
              Manage API connections for the hive mind
            </p>
          </div>
          <CyberButton
            variant="primary"
            onClick={() => setShowAddModal(true)}
          >
            + Add New LLM
          </CyberButton>
        </div>

        {/* Integration Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <IntegrationPanel
            provider="openai"
            title="GPT-4o"
            subtitle="OpenAI Language Model"
            brainRegion="Left Cortex"
          />
          <IntegrationPanel
            provider="anthropic"
            title="Claude 3.5"
            subtitle="Anthropic Language Model"
            brainRegion="Right Cortex"
          />
          <IntegrationPanel
            provider="google"
            title="Gemini 2.5"
            subtitle="Google Language Model"
            brainRegion="Occipital"
          />
        </div>

        {/* Info Section */}
        <div className="mt-8">
          <CyberCard cornerAccents className="bg-deep-teal/20">
            <div className="flex items-start gap-4">
              <Brain className="w-6 h-6 text-neon-green flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-neon-green font-bold mb-2">Neural Integration Protocol</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Connect your AI model API keys to enable the Chimera Protocol's multi-model cognitive fusion.
                  Each model operates as a specialized cortex region, sharing a unified memory substrate while
                  maintaining distinct reasoning patterns. Test connections to verify neural pathways are active.
                </p>
              </div>
            </div>
          </CyberCard>
        </div>

        {/* Add New LLM Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-deep-teal border-2 border-neon-green/30 rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-cyber text-neon-green">Add New LLM</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-neon-green text-sm font-medium mb-2">
                    Model Name
                  </label>
                  <CyberInput
                    type="text"
                    placeholder="e.g., GPT-4, Claude, Gemini"
                  />
                </div>

                <div>
                  <label className="block text-neon-green text-sm font-medium mb-2">
                    Provider
                  </label>
                  <CyberInput
                    type="text"
                    placeholder="e.g., OpenAI, Anthropic, Google"
                  />
                </div>

                <div>
                  <label className="block text-neon-green text-sm font-medium mb-2">
                    API Endpoint
                  </label>
                  <CyberInput
                    type="text"
                    placeholder="https://api.example.com/v1"
                  />
                </div>

                <div>
                  <label className="block text-neon-green text-sm font-medium mb-2">
                    API Key
                  </label>
                  <CyberInput
                    type="password"
                    placeholder="Enter API key"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <CyberButton
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      // TODO: Implement add LLM logic
                      setShowAddModal(false);
                    }}
                  >
                    Add Model
                  </CyberButton>
                  <CyberButton
                    variant="secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </CyberButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Integrations;
