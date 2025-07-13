"use client";

import dynamic from "next/dynamic";

const ListToString = dynamic(() => import("../list-to-string").then(m => m.ListToString), { 
  ssr: false, 
  loading: () => <div className="flex items-center justify-center p-8">Loading List to String tool...</div> 
});

export function ListToStringPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          List to String Converter
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Convert lists and arrays to formatted strings with custom separators. Perfect for transforming data structures into readable text.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <ListToString />
      </div>
    </div>
  );
} 