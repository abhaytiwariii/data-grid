# Accessibility (A11y) Report

## Compliance Status
- **Standard:** WCAG 2.1 Level AA
- **Testing Tools:** axe-core, Manual Keyboard Navigation

## Implementation Details

### 1. Structure & Roles
- **Grid Container:** `role="grid"`
- **Row:** `role="row"`, `aria-rowindex="{n}"` (Correctly announces position 500/50,000).
- **Cell:** `role="gridcell"`, `tabIndex="0"` for focus management.
- **Headers:** `role="columnheader"`, `aria-sort` (ascending/descending/none).

### 2. Keyboard Navigation Contract
- **TAB:** Moves focus into the grid / out of the grid.
- **ENTER / SPACE:** Triggers sort on headers; Enters "Edit Mode" on cells.
- **ESC:** Cancels "Edit Mode" and returns focus to the cell.
- **Visual Focus:** High-contrast outline applied via `focus-visible` Tailwind classes.

### 3. Screen Reader Experience
- Virtualization often breaks screen readers because elements disappear.
- **Fix:** We used `aria-rowcount="50000"` on the container. This tells the screen reader the *actual* size of the dataset, regardless of how many rows are currently in the DOM.