"use client";

import React, { useRef } from "react";
import { GridColumn, GridRow } from "@/app/types/grid";
import { useVirtualizer } from "@/app/hooks/useVirtualizer";
import { useGridSort } from "@/app/hooks/useGridSort";
import { useGridEdit } from "@/app/hooks/useGridEdit";
import VirtualRow from "./VirtualRow";

interface DataGridProps {
  rows: GridRow[];
  columns: GridColumn[];
  height?: number;
}

export default function DataGrid({
  rows: initialRows,
  columns,
  height = 600,
}: DataGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // 1. EDITING HOOK
  const {
    data: editableRows,
    editingCell,
    startEdit,
    cancelEdit,
    commitEdit,
    errors,
  } = useGridEdit(initialRows);

  // 2. SORTING HOOK (Pass editable rows)
  const { sortedData, sortState, toggleSort } = useGridSort({
    data: editableRows,
  });

  // 3. VIRTUALIZATION: Pass the *sorted* rows to the virtualizer
  const { virtualItems, totalSize } = useVirtualizer({
    count: sortedData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35, // Fixed row height
    overscan: 5,
  });

  return (
    // MAX WIDTH CONTAINER (Added "max-w-[1200px]" for layout control)
    <div className="mx-auto max-w-270 w-full border border-gray-300 rounded-xl shadow-lg bg-white overflow-hidden flex flex-col">
      {/* UNIFIED SCROLL CONTAINER 
          This single div handles both horizontal and vertical scrolling.
          Header sticks to top. Pinned columns stick to left.
      */}
      <div
        ref={parentRef}
        className="overflow-auto relative w-full"
        style={{ height: `${height}px`, contain: "strict" }}
        role="grid"
        aria-rowcount={sortedData.length}
        aria-colcount={columns.length}
      >
        {/* --- HEADER SECTION (Sticky Top) --- */}
        <div className="sticky top-0 z-20 flex bg-gray-50 border-b border-gray-300 min-w-max shadow-sm">
          {columns.map((col) => {
            const activeSort = sortState.find((s) => s.columnId === col.id);
            const sortDir = activeSort?.direction;

            return (
              <div
                key={col.id}
                role="columnheader"
                aria-sort={
                  sortDir === "asc"
                    ? "ascending"
                    : sortDir === "desc"
                      ? "descending"
                      : "none"
                }
                tabIndex={0}
                onClick={(e) => toggleSort(col.id, e.shiftKey)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleSort(col.id, e.shiftKey);
                  }
                }}
                className={`flex items-center px-4 h-10 font-bold text-gray-700 text-sm select-none cursor-pointer hover:bg-gray-200 transition-colors ${
                  col.pinned === "left"
                    ? "sticky left-0 z-30 bg-gray-50 border-r border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                    : ""
                }`}
                style={{
                  width: `${col.width}px`,
                  minWidth: `${col.width}px`,
                }}
              >
                <span className="truncate flex-1">{col.title}</span>
                {sortDir && (
                  <span className="ml-2 text-xs text-blue-600">
                    {sortDir === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* --- BODY SECTION (Virtual Content) --- */}
        <div
          className="min-w-max"
          style={{
            height: `${totalSize}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualItems.map((virtualRow) => {
            const rowData = sortedData[virtualRow.index];
            return (
              <VirtualRow
                key={rowData.id}
                row={rowData}
                columns={columns}
                index={virtualRow.index}
                start={virtualRow.start}
                height={virtualRow.size}
                // Edit Props
                editingCell={editingCell}
                startEdit={startEdit}
                commitEdit={commitEdit}
                cancelEdit={cancelEdit}
                errors={errors}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
