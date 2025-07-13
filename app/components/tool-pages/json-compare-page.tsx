"use client";

import dynamic from "next/dynamic";

const JsonCompare = dynamic(() => import("../json-compare").then(m => m.JsonCompare), { 
  ssr: false, 
  loading: () => <div className="flex items-center justify-center p-8">Loading JSON Compare tool...</div> 
});

export function JsonComparePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          JSON Compare & Diff Tool
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Compare JSON objects side by side with visual highlighting of differences. Perfect for API testing, data validation, and debugging.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <JsonCompare />
      </div>
    </div>
  );
} 