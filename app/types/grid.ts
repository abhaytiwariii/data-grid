export type GridColumnId = string;

export interface GridColumn {
  id: GridColumnId;
  title: string;
  width: number;
  minWidth?: number;
  maxWidth?: number;
  // Pinned columns must be handled carefully in CSS
  pinned?: "left" | "right" | null;
  // Sorting state
  sortable?: boolean;
}

export interface GridRow {
  id: string;
  // Index signature to allow dynamic property access with strict safety
  [key: string]: string | number | boolean | null | undefined;
}

// Used for the virtualizer hook return values
export interface VirtualItem {
  index: number;
  start: number; // Position in pixels from top
  size: number; // Height of the row
}

export type SortDirection = "asc" | "desc" | null;

export interface SortState {
  columnId: GridColumnId;
  direction: SortDirection;
}
