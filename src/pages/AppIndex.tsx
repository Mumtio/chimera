import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { CyberSpinner } from '../components/ui';

export default function AppIndex() {
  const { workspaces, activeWorkspaceId, isLoading } = useWorkspaceStore();

  // If still loading, show spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <CyberSpinner size="lg" />
          <p className="text-neon-green mt-4 font-cyber uppercase tracking-wider animate-pulse">
            Loading Workspaces...
          </p>
        </div>
      </div>
    );
  }

  // If workspaces loaded, redirect to active or first workspace
  const targetWorkspace = activeWorkspaceId || workspaces[0]?.id;
  
  if (targetWorkspace) {
    return <Navigate to={`/app/workspace/${targetWorkspace}`} replace />;
  }

  // No workspaces found - this shouldn't happen, but handle gracefully
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <p className="text-error-red text-xl mb-4">No workspaces found</p>
        <p className="text-gray-400">Please contact support</p>
      </div>
    </div>
  );
}
