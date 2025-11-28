import { useParams, useNavigate } from 'react-router-dom';
import { Database, Cpu, Activity } from 'lucide-react';
import { Container, StatCard, CyberButton, Grid } from '../components/ui';
import { NeuralLoadGraph } from '../components/features/NeuralLoadGraph';
import { ActivityFeed } from '../components/features/ActivityFeed';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { dummyNeuralLoadData, dummyActivities } from '../data/dummyData';

export default function WorkspaceDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const workspace = useWorkspaceStore(state => 
    state.workspaces.find(ws => ws.id === id)
  );

  if (!workspace) {
    return (
      <Container maxWidth="2xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-cyber text-error-red mb-4">
            Workspace Not Found
          </h1>
          <p className="text-gray-400 mb-6">
            The requested workspace does not exist.
          </p>
          <CyberButton onClick={() => navigate('/app')}>
            Return to Dashboard
          </CyberButton>
        </div>
      </Container>
    );
  }

  const { stats } = workspace;

  return (
    <div className="relative min-h-screen circuit-bg">
      <Container maxWidth="full" className="py-8">
        <div className="scanlines">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-cyber text-neon-green mb-2 glow-text">
              {workspace.name}
            </h1>
            {workspace.description && (
              <p className="text-gray-400 text-lg">
                {workspace.description}
              </p>
            )}
          </div>

          {/* Stat Cards */}
          <Grid cols={3} gap="lg" className="mb-8">
            <StatCard
              label="Total Memories"
              value={stats.totalMemories}
              icon={Database}
              trend="up"
              glowColor="#00FFAA"
            />
            <StatCard
              label="Embeddings"
              value={stats.totalEmbeddings.toLocaleString()}
              icon={Cpu}
              trend="neutral"
              glowColor="#00FFAA"
            />
            <StatCard
              label="System Load"
              value={`${stats.systemLoad}%`}
              icon={Activity}
              trend={stats.systemLoad > 70 ? 'up' : stats.systemLoad < 30 ? 'down' : 'neutral'}
              glowColor={stats.systemLoad > 70 ? '#FF0055' : '#00FFAA'}
            />
          </Grid>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Neural Load Graph */}
            <div className="lg:col-span-2">
              <NeuralLoadGraph 
                data={dummyNeuralLoadData}
                height={300}
                showGrid={true}
              />
            </div>

            {/* Right Column - Quick Actions */}
            <div className="space-y-6">
              <div className="relative bg-black border-2 border-deep-teal angular-frame p-6">
                <h3 className="text-xl font-cyber text-neon-green mb-4 uppercase tracking-wider">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <CyberButton
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => navigate(`/app/model-select`)}
                  >
                    New Chat
                  </CyberButton>
                  <CyberButton
                    variant="secondary"
                    size="md"
                    className="w-full"
                    onClick={() => navigate(`/app/memories`)}
                  >
                    Memory Bank
                  </CyberButton>
                </div>
                
                <div className="mt-6 pt-6 border-t border-deep-teal">
                  <div className="text-sm text-gray-400 space-y-2">
                    <div className="flex justify-between">
                      <span>Conversations:</span>
                      <span className="text-neon-green font-bold">
                        {stats.totalConversations}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Activity:</span>
                      <span className="text-neon-green font-bold">
                        {stats.lastActivity.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="mt-6">
            <ActivityFeed activities={dummyActivities} maxItems={8} />
          </div>
        </div>
      </Container>
    </div>
  );
}
