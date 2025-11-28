/**
 * Performance monitoring utilities for tracking and optimizing app performance
 */

/**
 * Measure component render time
 */
export function measureRenderTime(componentName: string, callback: () => void) {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    callback();
    const end = performance.now();
    const duration = end - start;
    
    if (duration > 16) { // Warn if render takes longer than one frame (60fps)
      console.warn(`[Performance] ${componentName} render took ${duration.toFixed(2)}ms`);
    }
  } else {
    callback();
  }
}

/**
 * Debounce function for expensive operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll/resize handlers
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load images with intersection observer
 */
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string,
  options?: IntersectionObserverInit
) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        img.src = src;
        observer.unobserve(img);
      }
    });
  }, options);
  
  observer.observe(img);
  
  return () => observer.disconnect();
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (!navigation) {
    return null;
  }

  return {
    // Time to First Byte
    ttfb: navigation.responseStart - navigation.requestStart,
    // DOM Content Loaded
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    // Load Complete
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    // Total Load Time
    totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
  };
}

/**
 * Log performance metrics in development
 */
export function logPerformanceMetrics() {
  if (process.env.NODE_ENV === 'development') {
    const metrics = getPerformanceMetrics();
    if (metrics) {
      console.group('⚡ Performance Metrics');
      console.log(`TTFB: ${metrics.ttfb.toFixed(2)}ms`);
      console.log(`DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`);
      console.log(`Load Complete: ${metrics.loadComplete.toFixed(2)}ms`);
      console.log(`Total Load Time: ${metrics.totalLoadTime.toFixed(2)}ms`);
      console.groupEnd();
    }
  }
}
