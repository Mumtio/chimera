import React, { useState } from 'react';
import { CyberCard } from '../components/ui/CyberCard';
import { CyberButton } from '../components/ui/CyberButton';
import { Terminal, Play, Trash2 } from 'lucide-react';

type CommandType = 'remember' | 'search' | 'inject';

interface CommandResult {
  id: string;
  command: string;
  output: any;
  status: 'success' | 'error';
  timestamp: Date;
}

const Console: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CommandType>('remember');
  const [commandInput, setCommandInput] = useState('');
  const [results, setResults] = useState<CommandResult[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const commandTemplates: Record<CommandType, string> = {
    remember: 'remember({ content: "Your memory content here", tags: ["tag1", "tag2"] })',
    search: 'search({ query: "your search query", limit: 10 })',
    inject: 'inject({ memoryId: "memory-id", conversationId: "conversation-id" })',
  };

  const handleTabChange = (tab: CommandType) => {
    setActiveTab(tab);
    setCommandInput(commandTemplates[tab]);
  };

  const executeCommand = async () => {
    if (!commandInput.trim()) return;

    setIsExecuting(true);

    // Simulate command execution with dummy response
    await new Promise(resolve => setTimeout(resolve, 800));

    let output: any;
    let status: 'success' | 'error' = 'success';

    try {
      // Parse the command to determine type and generate appropriate response
      if (commandInput.includes('remember(')) {
        output = {
          success: true,
          memoryId: `memory-${Date.now()}`,
          message: 'Memory successfully stored in neural substrate',
          embedding: {
            dimensions: 1536,
            model: 'text-embedding-ada-002',
          },
          timestamp: new Date().toISOString(),
        };
      } else if (commandInput.includes('search(')) {
        output = {
          success: true,
          results: [
            {
              id: 'memory-1',
              title: 'Cognitive Fusion Protocols',
              snippet: 'The primary protocol for fusing multiple AI models...',
              similarity: 0.94,
              tags: ['protocol', 'fusion', 'architecture'],
            },
            {
              id: 'memory-2',
              title: 'Emergent Synapse Firing',
              snippet: 'Observed phenomenon where multiple models simultaneously...',
              similarity: 0.87,
              tags: ['research', 'emergence', 'synapse'],
            },
            {
              id: 'memory-4',
              title: 'Memory Injection Optimization',
              snippet: 'Best practices for injecting memories into active conversations...',
              similarity: 0.82,
              tags: ['optimization', 'injection', 'best-practices'],
            },
          ],
          totalResults: 3,
          executionTime: '127ms',
        };
      } else if (commandInput.includes('inject(')) {
        output = {
          success: true,
          injectionId: `injection-${Date.now()}`,
          message: 'Memory successfully injected into conversation context',
          contextWindow: {
            before: 3847,
            after: 4521,
            tokensAdded: 674,
          },
          timestamp: new Date().toISOString(),
        };
      } else {
        throw new Error('Unknown command format');
      }
    } catch (error) {
      status = 'error';
      output = {
        success: false,
        error: 'Command execution failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      };
    }

    const result: CommandResult = {
      id: `result-${Date.now()}`,
      command: commandInput,
      output,
      status,
      timestamp: new Date(),
    };

    setResults(prev => [result, ...prev]);
    setIsExecuting(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      executeCommand();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Terminal className="w-8 h-8 text-neon-green" />
            <h1 className="text-4xl font-cyber font-bold text-neon-green uppercase tracking-wider">
              Developer Console
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Execute MCP commands and interact with the memory substrate
          </p>
        </div>

        {/* Command Tabs */}
        <div className="mb-6 flex gap-2">
          {(['remember', 'search', 'inject'] as CommandType[]).map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`
                px-6 py-3 font-mono text-sm uppercase tracking-wider
                border-2 transition-all duration-300
                angular-frame
                ${activeTab === tab
                  ? 'border-neon-green bg-neon-green/10 text-neon-green shadow-neon'
                  : 'border-deep-teal text-gray-400 hover:border-neon-green hover:text-neon-green'
                }
              `}
            >
              {tab}()
            </button>
          ))}
        </div>

        {/* Command Input Area */}
        <CyberCard
          title="Command Input"
          glowBorder
          cornerAccents
          className="mb-6"
        >
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter your MCP command..."
                className="
                  w-full h-32 bg-black border-2 border-deep-teal
                  text-neon-green font-mono text-sm p-4
                  focus:border-neon-green focus:shadow-neon focus:outline-none
                  transition-all duration-300 resize-none
                  angular-frame
                "
                spellCheck={false}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500 font-mono">
                Ctrl+Enter to execute
              </div>
            </div>

            <div className="flex gap-2">
              <CyberButton
                variant="primary"
                size="md"
                onClick={executeCommand}
                disabled={isExecuting || !commandInput.trim()}
                glow
              >
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  {isExecuting ? 'Executing...' : 'Execute Command'}
                </div>
              </CyberButton>
              <CyberButton
                variant="secondary"
                size="md"
                onClick={clearResults}
                disabled={results.length === 0}
              >
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Clear Results
                </div>
              </CyberButton>
            </div>
          </div>
        </CyberCard>

        {/* Results Area */}
        <CyberCard
          title="Execution Results"
          subtitle={`${results.length} command${results.length !== 1 ? 's' : ''} executed`}
          cornerAccents
        >
          <div className="space-y-4">
            {results.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-mono text-sm">No commands executed yet</p>
                <p className="text-xs mt-2">Execute a command to see results here</p>
              </div>
            ) : (
              results.map(result => (
                <div
                  key={result.id}
                  className={`
                    border-2 p-4 angular-frame
                    ${result.status === 'success'
                      ? 'border-neon-green bg-neon-green/5'
                      : 'border-error-red bg-error-red/5'
                    }
                  `}
                >
                  {/* Result Header */}
                  <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-800">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`
                          text-xs font-bold uppercase tracking-wider
                          ${result.status === 'success' ? 'text-neon-green' : 'text-error-red'}
                        `}>
                          {result.status}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          {result.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <code className="text-xs text-gray-400 font-mono break-all">
                        {result.command}
                      </code>
                    </div>
                  </div>

                  {/* JSON Output */}
                  <div className="bg-black border border-gray-800 p-4 rounded overflow-x-auto">
                    <pre className="text-xs font-mono text-neon-green whitespace-pre-wrap">
                      {JSON.stringify(result.output, null, 2)}
                    </pre>
                  </div>
                </div>
              ))
            )}
          </div>
        </CyberCard>

        {/* Info Section */}
        <div className="mt-8">
          <CyberCard cornerAccents className="bg-deep-teal/20">
            <div className="flex items-start gap-4">
              <Terminal className="w-6 h-6 text-neon-green flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-neon-green font-bold mb-2">MCP Command Reference</h3>
                <div className="text-gray-400 text-sm leading-relaxed space-y-2">
                  <p>
                    <code className="text-neon-green font-mono">remember()</code> - Store new memories in the neural substrate
                  </p>
                  <p>
                    <code className="text-neon-green font-mono">search()</code> - Query memories using semantic search
                  </p>
                  <p>
                    <code className="text-neon-green font-mono">inject()</code> - Inject memories into active conversation contexts
                  </p>
                </div>
              </div>
            </div>
          </CyberCard>
        </div>
      </div>
    </div>
  );
};

export default Console;
