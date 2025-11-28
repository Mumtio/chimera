import { Outlet, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import { LeftSidebar } from '../components/layout/LeftSidebar';
import { TopBar } from '../components/layout/TopBar';
import { RightSidebar } from '../components/layout/RightSidebar';
import { WorkspaceTransition } from '../components/animations/WorkspaceTransition';
import { CyberSpinner } from '../components/ui';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { useState } from 'react';

export default function AppShell() {
  const location = useLocation();
  const { 
    createWorkspace, 
    isTransitioning, 
    transitionProgress,
    previousWorkspaceId,
    getActiveWorkspace,
    getWorkspaceById,
  } = useWorkspaceStore();
  const [showNewWorkspaceModal, setShowNewWorkspaceModal] = useState(false);

  // Right sidebar is always hidden
  const hideRightSidebar = true;

  const handleNewWorkspace = () => {
    // For now, create a simple workspace with a default name
    // In a real app, this would open a modal
    const workspaceName = `Workspace ${Date.now()}`;
    createWorkspace(workspaceName, 'New workspace description');
    setShowNewWorkspaceModal(false);
  };

  const activeWorkspace = getActiveWorkspace();
  const previousWorkspace = previousWorkspaceId ? getWorkspaceById(previousWorkspaceId) : null;

  return (
    <div className="h-screen flex flex-col bg-lab-dark text-white overflow-hidden relative">
      {/* Lab Background Effects */}
      <div className="absolute inset-0 lab-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Workspace Transition Overlay */}
      <WorkspaceTransition
        isTransitioning={isTransitioning}
        progress={transitionProgress}
        fromWorkspace={previousWorkspace?.name}
        toWorkspace={activeWorkspace?.name}
      />

      {/* Top Bar */}
      <TopBar />

      {/* Main Content Area with Sidebars */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Hidden on tablet and below */}
        <div className="hidden laptop:block">
          <LeftSidebar onNewWorkspace={handleNewWorkspace} />
        </div>

        {/* Main Content */}
        <main 
          id="main-content" 
          className="flex-1 overflow-y-auto bg-black custom-scrollbar"
          role="main"
          aria-label="Main content"
        >
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <CyberSpinner size="lg" variant="ring" />
                <p className="text-neon-green mt-4 font-mono text-sm animate-pulse">
                  Loading Module...
                </p>
              </div>
            </div>
          }>
            <Outlet />
          </Suspense>
        </main>

        {/* Right Sidebar - Hidden on tablet and below, and on memory pages */}
        {!hideRightSidebar && (
          <div className="hidden desktop:block">
            <RightSidebar />
          </div>
        )}
      </div>
    </div>
  );
}
