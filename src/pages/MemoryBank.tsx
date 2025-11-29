import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { CyberButton } from '../components/ui/CyberButton';
import { CyberInput } from '../components/ui/CyberInput';
import { MemoryCard } from '../components/features/MemoryCard';
import { useMemoryStore } from '../stores/memoryStore';
import { useWorkspaceStore } from '../stores/workspaceStore';

const MemoryBank: React.FC = () => {
  const navigate = useNavigate();
  const { id: workspaceId } = useParams<{ id: string }>();
  const activeWorkspaceId = useWorkspaceStore(state => state.activeWorkspaceId);
  
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    getFilteredMemories,
    deleteMemory,
  } = useMemoryStore();

  const currentWorkspaceId = workspaceId || activeWorkspaceId || 'workspace-1';
  const memories = getFilteredMemories(currentWorkspaceId);

  const handleView = (memoryId: string) => {
    navigate(`/app/memories/${memoryId}`);
  };

  const handleEdit = (memoryId: string) => {
    // For now, navigate to detail page (edit functionality will be in detail page)
    navigate(`/app/memories/${memoryId}`);
  };

  const handleDelete = (memoryId: string) => {
    if (confirm('Are you sure you want to delete this memory?')) {
      deleteMemory(memoryId);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-cyber text-neon-green mb-2">
            Memory Bank
          </h1>
          <p className="text-gray-400 text-sm">
            Semantic knowledge repository for cognitive model injection
          </p>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <div className="relative">
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neon-green" 
                size={18} 
              />
              <CyberInput
                type="search"
                placeholder="Search memories by title, content, or tags..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="pl-12"
              />
            </div>
          </div>
          
          <div className="w-64">
            <label className="block text-gray-400 text-xs mb-2 uppercase tracking-wider">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'title' | 'relevance')}
              className="w-full px-4 py-3 bg-black border-2 border-deep-teal 
                         text-neon-green font-mono text-sm
                         focus:border-neon-green focus:shadow-neon focus:outline-none
                         transition-all duration-300 angular-frame cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="title">Title (A-Z)</option>
              <option value="relevance">Relevance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Memory Grid */}
      {memories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-block p-8 border-2 border-deep-teal angular-frame">
            <p className="text-gray-400 text-lg mb-4">
              {searchQuery 
                ? 'No memories found matching your search.' 
                : 'No memories in this workspace yet.'}
            </p>
            {!searchQuery ? (
              <p className="text-gray-500 text-sm">
                Memories are automatically generated from your conversations.
                <br />
                Start a chat to create your first memory.
              </p>
            ) : (
              <CyberButton
                variant="secondary"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </CyberButton>
            )}
          </div>
        </div>
      )}

      {/* Memory Count */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm font-mono">
          Displaying {memories.length} {memories.length === 1 ? 'memory' : 'memories'}
          {searchQuery && ' (filtered)'}
        </p>
      </div>
    </div>
  );
};

export default MemoryBank;
