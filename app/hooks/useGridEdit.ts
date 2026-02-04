"use client";

import { useState, useCallback } from "react";
import { GridRow, GridColumnId } from "@/app/types/grid";

interface EditState {
  rowId: string | null;
  colId: GridColumnId | null;
  value: any;
}

export const useGridEdit = (initialData: GridRow[]) => {
  const [data, setData] = useState(initialData);
  const [editingCell, setEditingCell] = useState<EditState>({
    rowId: null,
    colId: null,
    value: null,
  });

  // Track validation errors to show visual feedback (red border)
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // 1. Start Editing (Double Click)
  const startEdit = useCallback((rowId: string, colId: string, value: any) => {
    setEditingCell({ rowId, colId, value });
  }, []);

  // 2. Cancel Editing (Escape key)
  const cancelEdit = useCallback(() => {
    setEditingCell({ rowId: null, colId: null, value: null });
  }, []);

  // 3. Commit Edit (Enter key / Blur)
  const commitEdit = useCallback(
    async (rowId: string, colId: string, newValue: any, oldValue: any) => {
      // A. Stop editing UI immediately
      setEditingCell({ rowId: null, colId: null, value: null });

      // B. Optimistic Update: Update the UI *before* the API returns
      setData((prev) =>
        prev.map((row) =>
          row.id === rowId ? { ...row, [colId]: newValue } : row,
        ),
      );

      try {
        // C. Simulate Async API Call (Mock Validation)
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            // Mock Logic: Fail if the value is empty or "error"
            if (newValue === "" || String(newValue).toLowerCase() === "error") {
              reject("Validation failed");
            } else {
              resolve("Success");
            }
          }, 1000); // 1 second delay
        });

        // Success? Do nothing, the UI is already correct.
      } catch (error) {
        // D. ROLLBACK! The API failed, so we revert to the old value.
        console.log(
          "Validation failed, rolling back.",
          error ? error : "Error",
        );
        setData((prev) =>
          prev.map((row) =>
            row.id === rowId ? { ...row, [colId]: oldValue } : row,
          ),
        );

        // Trigger a red flash error on this cell (optional visual flair)
        const errorKey = `${rowId}-${colId}`;
        setErrors((prev) => ({ ...prev, [errorKey]: true }));
        setTimeout(
          () =>
            setErrors((prev) => {
              const next = { ...prev };
              delete next[errorKey];
              return next;
            }),
          2000,
        );
      }
    },
    [],
  );

  return {
    data,
    setData,
    editingCell,
    startEdit,
    cancelEdit,
    commitEdit,
    errors,
  };
};
