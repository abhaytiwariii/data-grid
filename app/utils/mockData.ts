import { GridRow } from "../types/grid";

export function makeData(count: number): GridRow[] {
  const data: GridRow[] = [];

  for (let i = 0; i < count; i++) {
    data.push({
      id: `row-${i}`,
      firstName: `User ${i}`,
      lastName: `Tiwari`,
      age: 20 + (i % 30),
      visits: Math.floor(Math.random() * 100),
      status: i % 2 === 0 ? "Active" : "Inactive",
      progress: Math.floor(Math.random() * 100),
      // Add more fields if you want to test horizontal scrolling later
      email: `user${i}@example.com`,
    });
  }

  return data;
}
