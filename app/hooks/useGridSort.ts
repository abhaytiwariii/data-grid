"use client";

import { useState, useMemo, useCallback } from "react";
import { GridRow, SortState, SortDirection } from "@/app/types/grid";

interface UseGridSortProps {
  data: GridRow[];
}

export const useGridSort = ({ data }: UseGridSortProps) => {
  // store an array of sort states to support multi-column sorting
  const [sortState, setSortState] = useState<SortState[]>([]);

  // 1. The Toggle Function
  const toggleSort = useCallback((columnId: string, isMulti: boolean) => {
    setSortState((prev) => {
      const existingIndex = prev.findIndex((s) => s.columnId === columnId);
      let nextDirection: SortDirection = "asc";

      // Logic: None -> Asc -> Desc -> None (Remove)
      if (existingIndex >= 0) {
        const currentDir = prev[existingIndex].direction;
        if (currentDir === "asc") nextDirection = "desc";
        else if (currentDir === "desc") nextDirection = null;
      }

      if (isMulti) {
        // If removing the sort (nextDirection is null)
        if (!nextDirection) {
          return prev.filter((s) => s.columnId !== columnId);
        }

        const newSorts = [...prev];
        if (existingIndex >= 0) {
          newSorts[existingIndex] = { columnId, direction: nextDirection };
        } else {
          newSorts.push({ columnId, direction: nextDirection });
        }
        return newSorts;
      }

      // If NOT holding shift, we reset everything and sort only by this column
      else {
        if (!nextDirection) return []; // Reset to default
        return [{ columnId, direction: nextDirection }];
      }
    });
  }, []);

  // 2. The Sorting Algorithm (Stable Multi-Column Sort)
  const sortedData = useMemo(() => {
    if (sortState.length === 0) return data;

    return [...data].sort((a, b) => {
      for (const sort of sortState) {
        const valA = a[sort.columnId];
        const valB = b[sort.columnId];

        // Handle nulls/undefined safely
        if (valA === valB) continue;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        const compareResult = valA < valB ? -1 : 1;

        return sort.direction === "asc" ? compareResult : -compareResult;
      }
      return 0;
    });
  }, [data, sortState]);

  return { sortedData, sortState, toggleSort };
};
