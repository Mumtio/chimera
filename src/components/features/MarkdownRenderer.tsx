import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const renderMarkdown = (text: string) => {
    // Split by code blocks first
    const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);
    
    return parts.map((part, index) => {
      // Multi-line code block
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3);
        const lines = code.split('\n');
        const language = lines[0].trim();
        const codeContent = lines.slice(1).join('\n');
        
        return (
          <pre key={index} className="bg-black/50 border border-neon-green/30 rounded p-3 my-2 overflow-x-auto">
            {language && (
              <div className="text-xs text-neon-green mb-2 font-mono">{language}</div>
            )}
            <code className="text-sm text-gray-300 font-mono">{codeContent}</code>
          </pre>
        );
      }
      
      // Inline code
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="bg-black/50 border border-neon-green/30 rounded px-2 py-0.5 text-sm text-neon-green font-mono">
            {part.slice(1, -1)}
          </code>
        );
      }
      
      // Process other markdown in this part
      return <span key={index} dangerouslySetInnerHTML={{ __html: processInlineMarkdown(part) }} />;
    });
  };
  
  const processInlineMarkdown = (text: string) => {
    let processed = text;
    
    // Bold: **text** or __text__
    processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
    processed = processed.replace(/__([^_]+)__/g, '<strong class="text-white font-bold">$1</strong>');
    
    // Italic: *text* or _text_
    processed = processed.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
    processed = processed.replace(/_([^_]+)_/g, '<em class="italic">$1</em>');
    
    // Links: [text](url)
    processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-neon-green hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Headers: # text
    processed = processed.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-white mt-3 mb-2">$1</h3>');
    processed = processed.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-4 mb-2">$1</h2>');
    processed = processed.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-4 mb-3">$1</h1>');
    
    // Lists: - item or * item
    processed = processed.replace(/^[*-] (.+)$/gm, '<li class="ml-4 mb-1">• $1</li>');
    
    // Numbered lists: 1. item
    processed = processed.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 mb-1">$1</li>');
    
    // Line breaks
    processed = processed.replace(/\n\n/g, '<br/><br/>');
    processed = processed.replace(/\n/g, '<br/>');
    
    return processed;
  };
  
  return (
    <div className={`markdown-content ${className}`}>
      {renderMarkdown(content)}
    </div>
  );
};
