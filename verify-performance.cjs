/**
 * Verification script for performance optimizations
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Performance Optimizations...\n');

let passed = 0;
let failed = 0;

function check(name, condition, message) {
  if (condition) {
    console.log(`✅ ${name}: ${message}`);
    passed++;
  } else {
    console.log(`❌ ${name}: ${message}`);
    failed++;
  }
}

// Check 1: Lazy loading in App.tsx
const appContent = fs.readFileSync('src/App.tsx', 'utf8');
check(
  'Code Splitting',
  appContent.includes('lazy(') && appContent.includes('Suspense'),
  'Route components are lazy loaded'
);

// Check 2: React.memo in components
const chatMessageContent = fs.readFileSync('src/components/features/ChatMessage.tsx', 'utf8');
check(
  'ChatMessage Memoization',
  chatMessageContent.includes('memo(') && chatMessageContent.includes('useCallback'),
  'ChatMessage is memoized with callbacks'
);

const memoryCardContent = fs.readFileSync('src/components/features/MemoryCard.tsx', 'utf8');
check(
  'MemoryCard Memoization',
  memoryCardContent.includes('memo(') && memoryCardContent.includes('useMemo'),
  'MemoryCard is memoized with computed values'
);

const neuralGraphContent = fs.readFileSync('src/components/features/NeuralLoadGraph.tsx', 'utf8');
check(
  'NeuralLoadGraph Memoization',
  neuralGraphContent.includes('memo(') && neuralGraphContent.includes('useMemo'),
  'NeuralLoadGraph is memoized'
);

const brainContent = fs.readFileSync('src/components/brain/BrainVisualization.tsx', 'utf8');
check(
  'BrainVisualization Memoization',
  brainContent.includes('memo('),
  'BrainVisualization components are memoized'
);

// Check 3: Lazy loading 3D components
const modelSelectContent = fs.readFileSync('src/pages/ModelSelect.tsx', 'utf8');
check(
  '3D Component Lazy Loading',
  modelSelectContent.includes('lazy(() => import') && modelSelectContent.includes('BrainVisualization'),
  'BrainVisualization is lazy loaded'
);

// Check 4: Vite config optimizations
const viteConfigContent = fs.readFileSync('vite.config.ts', 'utf8');
check(
  'Manual Chunks',
  viteConfigContent.includes('manualChunks') && viteConfigContent.includes('three-vendor'),
  'Manual chunk splitting configured'
);

check(
  'Terser Options',
  viteConfigContent.includes('terserOptions') && viteConfigContent.includes('drop_console'),
  'Terser optimization configured'
);

check(
  'Optimize Dependencies',
  viteConfigContent.includes('optimizeDeps'),
  'Dependency optimization configured'
);

// Check 5: Performance utilities
check(
  'Performance Utilities',
  fs.existsSync('src/lib/performance.ts'),
  'Performance utility functions created'
);

check(
  'Virtual Scroll Hook',
  fs.existsSync('src/hooks/useVirtualScroll.ts'),
  'Virtual scroll hook created'
);

// Check 6: Documentation
check(
  'Performance Documentation',
  fs.existsSync('PERFORMANCE.md'),
  'Performance guide created'
);

// Check 7: Chat optimization
const chatContent = fs.readFileSync('src/pages/Chat.tsx', 'utf8');
check(
  'Chat Callbacks',
  chatContent.includes('useCallback') && chatContent.includes('handleSendMessage'),
  'Chat handlers are memoized'
);

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('✨ All performance optimizations verified successfully!');
  process.exit(0);
} else {
  console.log('⚠️  Some optimizations need attention');
  process.exit(1);
}
