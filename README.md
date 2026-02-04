# High-Performance Data Grid

A production-grade, virtualized Data Grid built from scratch in React/Next.js.
Zero dependencies on table libraries.

## Features

- **Virtualization:** Handles 50,000+ rows at 60 FPS.
- **Pinned Columns:** Sticky columns with shadow indication.
- **Multi-Column Sorting:** Shift+Click to sort by multiple fields.
- **Optimistic Editing:** Async validation simulation with rollback.
- **Accessible:** Full keyboard and screen reader support.

## Usage

```tsx
import DataGrid from './components/grid/DataGrid';

const columns = [
  { id: 'id', title: 'ID', width: 80, pinned: 'left' },
  { id: 'name', title: 'Name', width: 200 }
];

const rows = [
  { id: '1', name: 'Abhay' },
  // ... 50k rows
];

<DataGrid
  rows={rows}
  columns={columns}
  height={600}
/>

#API REFERANCE

Prop,               Type,               Description
rows,               GridRow[],          Array of data objects. Must contain unique id.
columns,            GridColumn[],       "Configuration for columns (width, pinning, title)."
height,             number,             Fixed height of the grid container in pixels.


#File strucutre
src/
├── app/
│   └── page.tsx              # Demo page (optional, for manual testing)
├── components/
│   └── grid/
│       ├── DataGrid.tsx      # Main entry point (The Container)
│       ├── VirtualRow.tsx    # Memoized Row (The Renderer)
│       └── GridHeader.tsx    # Sticky Headers (The Controller)
├── hooks/
│   └── useVirtualizer.ts     # The "Engine" (Custom Logic - NO LIBRARIES)
├── types/
│   └── grid.ts               # Strict Interfaces (The Contract)
├── utils/
│   └── mockData.ts           # Generating 50,000 rows (The Test)
└── styles/
    └── globals.css           # Tailwind imports
```
