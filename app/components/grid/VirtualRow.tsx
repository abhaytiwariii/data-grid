"use client";

import React, { memo } from "react";
import { GridRow, GridColumn } from "@/app/types/grid";

interface VirtualRowProps {
  row: GridRow;
  columns: GridColumn[];
  start: number;
  height: number;
  index: number;
  editingCell: { rowId: string | null; colId: string | null; value: any };
  startEdit: (rowId: string, colId: string, value: any) => void;
  commitEdit: (
    rowId: string,
    colId: string,
    newValue: any,
    oldValue: any,
  ) => void;
  cancelEdit: () => void;
  errors: Record<string, boolean>;
}

const VirtualRow = memo(
  ({
    row,
    columns,
    start,
    height,
    index,
    editingCell,
    startEdit,
    commitEdit,
    cancelEdit,
    errors,
  }: VirtualRowProps) => {
    return (
      <div
        role="row"
        aria-rowindex={index + 1}
        className="absolute top-0 left-0 w-full flex border-b border-gray-200 hover:bg-blue-50 transition-colors"
        style={{
          height: `${height}px`,
          transform: `translateY(${start}px)`,
        }}
      >
        {columns.map((col) => {
          const isEditing =
            editingCell.rowId === row.id && editingCell.colId === col.id;
          const isError = errors[`${row.id}-${col.id}`];

          // Sticky Logic
          const stickyClass =
            col.pinned === "left"
              ? "sticky left-0 z-10 bg-white border-r border-gray-300"
              : "bg-white";

          // Error Class (Red flash on rollback)
          const errorClass = isError
            ? "!bg-red-100 transition-colors duration-500"
            : "";

          return (
            <div
              key={col.id}
              role="gridcell"
              // Start edit on double click
              onDoubleClick={() => startEdit(row.id, col.id, row[col.id])}
              className={`flex items-center px-4 text-sm text-gray-700 truncate ${stickyClass} ${errorClass}`}
              style={{
                width: `${col.width}px`,
                minWidth: `${col.width}px`,
                maxWidth: `${col.width}px`,
              }}
            >
              {isEditing ? (
                <input
                  autoFocus
                  className="w-full h-8 px-1 border-2 border-blue-500 rounded outline-none"
                  defaultValue={row[col.id] as string}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      commitEdit(
                        row.id,
                        col.id,
                        e.currentTarget.value,
                        row[col.id],
                      );
                    } else if (e.key === "Escape") {
                      cancelEdit();
                    }
                  }}
                  onBlur={(e) => {
                    commitEdit(row.id, col.id, e.target.value, row[col.id]);
                  }}
                />
              ) : (
                // Display Value
                <span className="truncate w-full">
                  {row[col.id]?.toString() || ""}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  },
);

VirtualRow.displayName = "VirtualRow";
export default VirtualRow;
