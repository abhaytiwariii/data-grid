"use client";

import { useMemo } from "react";
import DataGrid from "@/app/components/grid/DataGrid";
import { makeData } from "@/app/utils/mockData";
import { GridColumn } from "@/app/types/grid";

export default function Page() {
  // 1. Generate 50,000 rows
  const data = useMemo(() => makeData(50000), []);

  // 2. Define Columns
  const columns: GridColumn[] = [
    { id: "id", title: "ID", width: 100, pinned: "left" }, // Pinned Column
    { id: "firstName", title: "First Name", width: 150 },
    { id: "lastName", title: "Last Name", width: 150 },
    { id: "email", title: "Email", width: 250 },
    { id: "age", title: "Age", width: 80 },
    { id: "visits", title: "Visits", width: 100 },
    { id: "status", title: "Status", width: 120 },
    { id: "progress", title: "Progress", width: 150 },
  ];

  return (
    <main className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Enterprise Data Engine
        </h1>
        <p className="text-slate-600 mt-2 text-lg">
          Custom virtualized grid handling{" "}
          <span className="font-bold text-blue-600">50,000+ records</span> with
          sub-ms latency.
        </p>

        <div className="flex gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex-1">
            <span className="block text-xs text-slate-500 uppercase font-bold">
              Performance
            </span>
            <span className="text-xl font-mono text-green-600">60 FPS</span>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex-1">
            <span className="block text-xs text-slate-500 uppercase font-bold">
              Accessibility
            </span>
            <span className="text-xl font-mono text-blue-600">WCAG 2.1</span>
          </div>
        </div>
      </div>

      <DataGrid rows={data} columns={columns} height={700} />
    </main>
  );
}
