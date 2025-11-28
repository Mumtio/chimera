# Performance Optimization Guide

This document outlines the performance optimizations implemented in the Chimera Protocol frontend application.

## Implemented Optimizations

### 1. Code Splitting and Lazy Loading

**Route-level code splitting:**
- All page components are lazy-loaded using React's `lazy()` and `Suspense`
- Reduces initial bundle size by loading routes on-demand
- Provides loading fallback with themed spinner

**3D Component lazy loading:**
- `BrainVisualization` component is lazy-loaded only when needed
- Reduces initial load time for users who don't immediately access model selection
- Three.js and React Three Fiber are excluded from initial bundle

**Implementation:**
```typescript
const Landing = lazy(() => import('./pages/Landing'));
const BrainVisualization = lazy(() => import('./components/brain/BrainVisualization'));
```

### 2. React.memo Optimization

**Memoized components:**
- `ChatMessage` - Prevents re-renders when message data hasn't changed
- `MemoryCard` - Optimizes memory list rendering
- `NeuralLoadGraph` - Prevents expensive chart re-renders
- `BrainVisualization` and sub-components - Optimizes 3D rendering

**Benefits:**
- Reduces unnecessary re-renders
- Improves scroll performance in lists
- Optimizes animation performance

### 3. Callback and Value Memoization

**useCallback for event handlers:**
- All event handlers in Chat component are memoized
- Prevents child component re-renders
- Improves performance in message-heavy conversations

**useMemo for computed values:**
- Chart data formatting in `NeuralLoadGraph`
- Date formatting in `MemoryCard`
- Reduces redundant calculations

### 4. Bundle Optimization

**Manual chunk splitting:**
```javascript
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
  'ui-vendor': ['framer-motion', 'recharts'],
  'state-vendor': ['zustand'],
  'icons-vendor': ['lucide-react']
}
```

**Benefits:**
- Better caching - vendor code changes less frequently
- Parallel loading of chunks
- Smaller individual chunk sizes

**Terser optimization:**
- Removes console.log in production
- Aggressive minification
- Dead code elimination

### 5. Virtual Scrolling

**Custom hook implementation:**
- `useVirtualScroll` hook for long lists
- Only renders visible items plus overscan buffer
- Dramatically improves performance for 100+ items

**Usage:**
```typescript
const { virtualItems, totalHeight } = useVirtualScroll(items, {
  itemHeight: 200,
  containerHeight: 800,
  overscan: 3
});
```

### 6. Performance Utilities

**Available utilities:**
- `debounce()` - For search inputs and expensive operations
- `throttle()` - For scroll and resize handlers
- `lazyLoadImage()` - Intersection Observer-based image loading
- `prefersReducedMotion()` - Respects user accessibility preferences
- `getPerformanceMetrics()` - Tracks TTFB, DOM load, etc.

### 7. Asset Optimization

**Build configuration:**
- Organized asset output (images, fonts, js)
- Optimized file naming with content hashes
- Proper cache busting

**Dependency optimization:**
- Pre-bundled common dependencies
- Excluded lazy-loaded dependencies from initial bundle

## Performance Targets

### Bundle Size Goals
- Initial bundle: < 200KB (gzipped) ✓
- Route chunks: < 50KB each (gzipped) ✓
- Total app: < 500KB (gzipped) ✓

### Runtime Performance
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3.5s
- 3D brain rendering: > 50fps
- Smooth animations: 60fps

## Best Practices for Developers

### 1. Component Optimization
```typescript
// ✅ DO: Memoize expensive components
export const ExpensiveComponent = memo(({ data }) => {
  const computed = useMemo(() => expensiveCalculation(data), [data]);
  return <div>{computed}</div>;
});

// ❌ DON'T: Create new objects/functions in render
const Component = () => {
  return <Child onClick={() => {}} style={{}} />; // Creates new references every render
};
```

### 2. Event Handler Optimization
```typescript
// ✅ DO: Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// ❌ DON'T: Create inline functions for memoized children
<MemoizedChild onClick={() => doSomething()} />
```

### 3. List Rendering
```typescript
// ✅ DO: Use virtual scrolling for long lists (100+ items)
const { virtualItems } = useVirtualScroll(items, options);

// ✅ DO: Always provide stable keys
items.map(item => <Item key={item.id} {...item} />)

// ❌ DON'T: Use index as key for dynamic lists
items.map((item, i) => <Item key={i} {...item} />)
```

### 4. Import Optimization
```typescript
// ✅ DO: Import only what you need
import { useState, useEffect } from 'react';
import { Button } from './components/ui';

// ❌ DON'T: Import entire libraries
import * as React from 'react';
import * as UI from './components/ui';
```

## Monitoring Performance

### Development
```bash
# Build and analyze bundle
npm run build
npm run preview

# Check bundle size
npm run build -- --mode production
```

### Production
- Use browser DevTools Performance tab
- Monitor Core Web Vitals
- Track bundle sizes in CI/CD
- Use Lighthouse for audits

## Future Optimizations

### Potential Improvements
1. **Service Worker**: Offline support and caching
2. **Image Optimization**: WebP with fallbacks, responsive images
3. **Prefetching**: Prefetch likely next routes
4. **Web Workers**: Offload heavy computations
5. **CDN**: Serve static assets from CDN
6. **Compression**: Enable Brotli compression
7. **HTTP/2**: Server push for critical resources

### Advanced Techniques
- React Server Components (when stable)
- Streaming SSR for faster TTFB
- Progressive hydration
- Partial hydration for islands architecture

## Troubleshooting

### Large Bundle Size
1. Analyze bundle with `npm run build -- --mode production`
2. Check for duplicate dependencies
3. Ensure tree-shaking is working
4. Review dynamic imports

### Slow Rendering
1. Use React DevTools Profiler
2. Check for unnecessary re-renders
3. Verify memo/callback usage
4. Profile with Chrome DevTools

### Memory Leaks
1. Clean up event listeners in useEffect
2. Cancel pending requests on unmount
3. Clear intervals/timeouts
4. Unsubscribe from stores

## Resources

- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Web Vitals](https://web.dev/vitals/)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
- [Bundle Analysis](https://github.com/btd/rollup-plugin-visualizer)
