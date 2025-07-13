"use client";

import dynamic from "next/dynamic";

const CsvViewer = dynamic(() => import("../csv-viewer").then(m => m.CsvViewer), { 
  ssr: false, 
  loading: () => <div className="flex items-center justify-center p-8">Loading CSV Viewer tool...</div> 
});

export function CsvViewerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          CSV Viewer & Query Tool
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          View, edit, and query CSV data with SQL-like syntax. Upload CSV files and analyze data with powerful querying capabilities.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <CsvViewer />
      </div>
    </div>
  );
} 