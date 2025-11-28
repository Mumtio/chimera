import React, { memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Eye } from 'lucide-react';
import type { Memory } from '../../types';

export interface MemoryCardProps {
  memory: Memory;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onInject?: (id: string) => void;
}

const MemoryCardComponent: React.FC<MemoryCardProps> = ({
  memory,
  onView,
  onEdit,
  onDelete,
  onInject,
}) => {
  // Memoize formatted date to avoid recalculation
  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(memory.updatedAt);
  }, [memory.updatedAt]);

  // Memoize click handlers
  const handleView = useCallback(() => onView(memory.id), [onView, memory.id]);
  const handleEdit = useCallback(() => onEdit(memory.id), [onEdit, memory.id]);
  const handleDelete = useCallback(() => onDelete(memory.id), [onDelete, memory.id]);

  return (
    <motion.div
      // @ts-ignore - Framer Motion types issue
      role="article"
      aria-label={`Memory: ${memory.title}`}
      tabIndex={0}
      className="relative bg-black border-2 border-deep-teal hover:border-neon-green 
                 transition-all duration-300 angular-frame p-5 cursor-pointer
                 hover:shadow-neon group focus-visible-ring"
      onClick={handleView}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleView();
        }
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Title */}
      <h3 className="text-neon-green font-cyber text-lg font-bold uppercase tracking-wider mb-2">
        {memory.title}
      </h3>

      {/* Snippet */}
      <p className="text-gray-300 text-sm mb-3 line-clamp-3">
        {memory.snippet}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {memory.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs bg-deep-teal border border-neon-green/30 
                       text-neon-green rounded-sm font-mono"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Timestamp */}
      <p className="text-gray-500 text-xs font-mono mb-3">
        {formattedDate}
      </p>

      {/* Action buttons */}
      <div 
        className="flex gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
        role="group"
        aria-label="Memory actions"
      >
        <button
          onClick={handleView}
          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-transparent 
                     border border-neon-green text-neon-green hover:bg-neon-green 
                     hover:text-black transition-all duration-200 uppercase tracking-wider focus-visible-ring"
          aria-label={`View ${memory.title}`}
          title="View memory"
        >
          <Eye size={14} aria-hidden="true" />
          <span>View</span>
        </button>
        <button
          onClick={handleEdit}
          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-transparent 
                     border border-neon-green text-neon-green hover:bg-neon-green 
                     hover:text-black transition-all duration-200 uppercase tracking-wider focus-visible-ring"
          aria-label={`Edit ${memory.title}`}
          title="Edit memory"
        >
          <Edit size={14} aria-hidden="true" />
          <span>Edit</span>
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-transparent 
                     border border-error-red text-error-red hover:bg-error-red 
                     hover:text-black transition-all duration-200 uppercase tracking-wider focus-visible-ring"
          aria-label={`Delete ${memory.title}`}
          title="Delete memory"
        >
          <Trash2 size={14} aria-hidden="true" />
          <span>Delete</span>
        </button>
      </div>
    </motion.div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const MemoryCard = memo(MemoryCardComponent);
