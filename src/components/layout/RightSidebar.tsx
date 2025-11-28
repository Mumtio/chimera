import { Search, Zap } from 'lucide-react';
import { useMemoryStore } from '../../stores/memoryStore';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function RightSidebar() {
  const navigate = useNavigate();
  const { getActiveWorkspace } = useWorkspaceStore();
  const { getMemoriesByWorkspace, setSearchQuery } = useMemoryStore();
  const [localSearch, setLocalSearch] = useState('');
  const [hoveredMemory, setHoveredMemory] = useState<string | null>(null);

  const activeWorkspace = getActiveWorkspace();
  const memories = activeWorkspace 
    ? getMemoriesByWorkspace(activeWorkspace.id).slice(0, 8) // Show recent 8
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    navigate('/app/memories');
  };

  const handleMemoryClick = (memoryId: string) => {
    navigate(`/app/memories/${memoryId}`);
  };

  return (
    <aside 
      className="w-80 bg-deep-teal border-l border-neon-green/20 flex flex-col h-full"
      aria-label="Memory sidebar"
    >
      {/* Search Bar */}
      <div className="p-4 border-b border-neon-green/20">
        <form onSubmit={handleSearch} className="relative" role="search">
          <label htmlFor="memory-search" className="sr-only">
            Search memories
          </label>
          <input
            id="memory-search"
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search memories..."
            aria-label="Search memories"
            className="w-full bg-black/40 border border-neon-green/30 rounded px-4 py-2 pl-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/60 focus:shadow-[0_0_10px_rgba(0,255,170,0.2)] transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" aria-hidden="true" />
        </form>
      </div>

      {/* Memory Feed */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-cyber text-neon-green/70 uppercase tracking-wider">
            Recent Memories
          </h3>
          <span className="text-xs text-gray-500" aria-live="polite">
            {memories.length} items
          </span>
        </div>

        <div className="space-y-3" role="list" aria-label="Recent memories">
          {memories.map((memory) => (
            <div
              key={memory.id}
              role="listitem"
              onMouseEnter={() => setHoveredMemory(memory.id)}
              onMouseLeave={() => setHoveredMemory(null)}
              onClick={() => handleMemoryClick(memory.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleMemoryClick(memory.id);
                }
              }}
              tabIndex={0}
              aria-label={`Memory: ${memory.title}`}
              className="relative p-3 bg-black/40 border border-neon-green/20 rounded cursor-pointer hover:border-neon-green/60 hover:shadow-[0_0_15px_rgba(0,255,170,0.2)] transition-all group focus-visible-ring"
            >
              {/* Synapse firing animation on hover */}
              {hoveredMemory === memory.id && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded" aria-hidden="true">
                  <div className="synapse-spark" />
                  <div className="synapse-spark" style={{ animationDelay: '0.3s' }} />
                  <div className="synapse-spark" style={{ animationDelay: '0.6s' }} />
                </div>
              )}

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm font-medium text-white line-clamp-1 group-hover:text-neon-green transition-colors">
                    {memory.title}
                  </h4>
                  <Zap className="w-3 h-3 text-neon-green flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                </div>
                
                <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                  {memory.snippet}
                </p>
                
                <div className="flex flex-wrap gap-1" aria-label="Tags">
                  {memory.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-neon-green/10 text-neon-green/80 rounded border border-neon-green/20"
                    >
                      {tag}
                    </span>
                  ))}
                  {memory.tags.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{memory.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {memories.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm" role="status">
              No memories yet
            </div>
          )}
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-4 border-t border-neon-green/20">
        <button
          onClick={() => navigate('/app/memories')}
          className="w-full px-4 py-2 bg-neon-green/10 border border-neon-green/40 rounded text-sm text-neon-green hover:bg-neon-green/20 hover:shadow-[0_0_15px_rgba(0,255,170,0.3)] transition-all focus-visible-ring"
          aria-label="View all memories"
        >
          View All Memories
        </button>
      </div>
    </aside>
  );
}
