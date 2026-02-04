import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DataGrid from "@/app/components/grid/DataGrid";
import { GridColumn, GridRow } from "@/app/types/grid";

// --- Mock Data Helper ---
const columns: GridColumn[] = [
  { id: "id", title: "ID", width: 100 },
  { id: "name", title: "Name", width: 200 },
];

const rows: GridRow[] = Array.from({ length: 100 }).map((_, i) => ({
  id: `row-${i}`,
  name: `User ${i}`,
}));

// --- The Tests ---
describe("DataGrid Integration", () => {
  // 1. VIRTUALIZATION TEST
  it("renders only a subset of rows (Virtualization Check)", async () => {
    render(<DataGrid rows={rows} columns={columns} height={500} />);

    // The component should announce 100 rows to the screen reader
    const grid = screen.getByRole("grid");
    expect(grid).toHaveAttribute("aria-rowcount", "100");

    // BUT, physically, it should only render ~20 rows (viewport + buffer)
    // If this finds 100, your virtualization is broken.
    const renderedRows = screen.getAllByRole("row");
    expect(renderedRows.length).toBeLessThan(30);
  });

  // 2. SORTING TEST
  it("sorts data when header is clicked", async () => {
    const user = userEvent.setup();
    render(<DataGrid rows={rows} columns={columns} height={500} />);

    // Initially, "User 0" should be at the top
    const firstRow = screen.getAllByRole("row")[0];
    expect(within(firstRow).getByText("User 0")).toBeInTheDocument();

    // Click the "Name" header to sort Descending (User 99 first)
    // Note: Our hook logic is Default -> Asc -> Desc, or similar.
    // You might need to click twice depending on your exact toggle logic.
    const nameHeader = screen.getByRole("columnheader", { name: /Name/i });

    // Click 1: Ascending
    await user.click(nameHeader);
    // Click 2: Descending
    await user.click(nameHeader);

    // Now "User 99" (or similar sort result) should be first
    const rowsAfterSort = screen.getAllByRole("row");
    // We check if the order changed.
    // (Adjust expectation based on string sort of "User 0" vs "User 99")
    expect(
      within(rowsAfterSort[0]).queryByText("User 0"),
    ).not.toBeInTheDocument();
  });

  // 3. KEYBOARD NAVIGATION TEST
  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<DataGrid rows={rows} columns={columns} height={500} />);

    // Focus the first header
    const headers = screen.getAllByRole("columnheader");
    await user.tab();
    expect(headers[0]).toHaveFocus();

    // Press Enter to trigger sort (Keyboard interaction check)
    await user.keyboard("{Enter}");
    expect(headers[0]).toHaveAttribute("aria-sort", "ascending"); // or descending
  });

  // 4. EDIT & ROLLBACK TEST
  it("rolls back value on validation failure", async () => {
    const user = userEvent.setup();
    render(<DataGrid rows={rows} columns={columns} height={500} />);

    // Find the first cell
    const cell = screen.getByText("User 0");

    // Double click to edit
    await user.dblClick(cell);

    // Type "error" (which triggers your mock failure logic)
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "error{enter}");

    // 1. Immediate Optimistic Update: Should see "error"
    expect(screen.getByText("error")).toBeInTheDocument();

    // 2. Wait for Rollback (Mock delay is 1000ms)
    // We expect it to revert back to "User 0"
    await waitFor(
      () => {
        expect(screen.queryByText("error")).not.toBeInTheDocument();
        expect(screen.getByText("User 0")).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });
});
