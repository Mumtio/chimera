import { useState, useEffect, useRef, useMemo } from 'react';

interface UseVirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualScrollResult<T> {
  virtualItems: Array<{
    index: number;
    item: T;
    offsetTop: number;
  }>;
  totalHeight: number;
  scrollToIndex: (index: number) => void;
}

/**
 * Custom hook for virtual scrolling to optimize rendering of long lists
 * Only renders items that are visible in the viewport plus overscan buffer
 */
export function useVirtualScroll<T>(
  items: T[],
  options: UseVirtualScrollOptions
): VirtualScrollResult<T> {
  const { itemHeight, containerHeight, overscan = 3 } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const { startIndex, endIndex, virtualItems, totalHeight } = useMemo(() => {
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const virtualItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
      virtualItems.push({
        index: i,
        item: items[i],
        offsetTop: i * itemHeight,
      });
    }

    return { startIndex, endIndex, virtualItems, totalHeight };
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  // Scroll to specific index
  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const offset = index * itemHeight;
      scrollRef.current.scrollTop = offset;
    }
  };

  return {
    virtualItems,
    totalHeight,
    scrollToIndex,
  };
}

/**
 * Hook to track scroll position
 */
export function useScrollPosition(ref: React.RefObject<HTMLElement>) {
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      setScrollTop(element.scrollTop);
    };

    element.addEventListener('scroll', handleScroll, { passive: true });
    return () => element.removeEventListener('scroll', handleScroll);
  }, [ref]);

  return scrollTop;
}
