"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";

interface UseVirtualizerProps {
  count: number; // Total number of rows (e.g., 50,000)
  getScrollElement: () => HTMLElement | null; // Ref to the scroll container
  estimateSize: () => number; // Fixed height of a row (e.g., 35px)
  overscan?: number; // Buffer rows (default 5)
}

export const useVirtualizer = ({
  count,
  getScrollElement,
  estimateSize,
  overscan = 5,
}: UseVirtualizerProps) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Ref to track if we are currently scrolling to prevent update loops
  const isScrollingRef = useRef(false);

  // 1. Measure the container height automatically
  useEffect(() => {
    const element = getScrollElement();
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, [getScrollElement]);

  // 2. The Scroll Handler - The heartbeat of the grid
  const onScroll = useCallback(() => {
    const element = getScrollElement();
    if (element) {
      setScrollOffset(element.scrollTop);
    }
  }, [getScrollElement]);

  // 3. Attach Scroll Listener
  useEffect(() => {
    const element = getScrollElement();
    if (!element) return;

    element.addEventListener("scroll", onScroll, { passive: true });
    return () => element.removeEventListener("scroll", onScroll);
  }, [getScrollElement, onScroll]);

  // 4. The Calculation Engine (Memoized for 60FPS)
  const virtualItems = useMemo(() => {
    const itemHeight = estimateSize();

    // Calculate strict visible range
    const startIndex = Math.max(
      0,
      Math.floor(scrollOffset / itemHeight) - overscan,
    );
    const endIndex = Math.min(
      count - 1,
      Math.ceil((scrollOffset + containerHeight) / itemHeight) + overscan,
    );

    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        start: i * itemHeight, // Absolute position from top
        size: itemHeight,
      });
    }
    return items;
  }, [scrollOffset, containerHeight, count, estimateSize, overscan]);

  const totalSize = count * estimateSize();

  return {
    virtualItems,
    totalSize,
    isScrolling: isScrollingRef.current,
  };
};
