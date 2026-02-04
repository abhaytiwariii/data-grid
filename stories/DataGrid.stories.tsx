import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DataGrid from "@/app/components/grid/DataGrid";
import { makeData } from "@/app/utils/mockData";
import { GridColumn } from "@/app/types/grid";

// Define standard columns for reuse
const defaultColumns: GridColumn[] = [
  { id: "id", title: "ID", width: 80 },
  { id: "firstName", title: "First Name", width: 150 },
  { id: "lastName", title: "Last Name", width: 150 },
  { id: "age", title: "Age", width: 80 },
  { id: "email", title: "Email", width: 250 },
  { id: "status", title: "Status", width: 120 },
];

const meta: Meta<typeof DataGrid> = {
  title: "Core/DataGrid",
  component: DataGrid,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof DataGrid>;

// Story 1: Basic usage (Small dataset)
export const Basic: Story = {
  args: {
    rows: makeData(100),
    columns: defaultColumns,
    height: 500,
  },
};

// Story 2: The "Boss Level" (50,000 Rows)
// This proves the 60FPS requirement.
export const StressTest50k: Story = {
  args: {
    rows: makeData(50000),
    columns: defaultColumns,
    height: 600,
  },
};

// Story 3: Pinned Columns (Left Sticky)
// Demonstrates sticky header and column logic
export const PinnedColumns: Story = {
  args: {
    rows: makeData(1000),
    columns: [
      { id: "id", title: "ID (Pinned)", width: 100, pinned: "left" }, // <--- PINNED
      { id: "firstName", title: "First Name", width: 150 },
      { id: "lastName", title: "Last Name", width: 150 },
      { id: "email", title: "Email", width: 300 },
      { id: "status", title: "Status", width: 150 },
      { id: "progress", title: "Progress", width: 150 },
    ],
    height: 500,
  },
};
