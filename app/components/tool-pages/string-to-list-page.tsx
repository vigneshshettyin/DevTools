"use client";

import dynamic from "next/dynamic";

const StringToList = dynamic(() => import("../string-to-list").then(m => m.StringToList), { 
  ssr: false, 
  loading: () => <div className="flex items-center justify-center p-8">Loading String to List tool...</div> 
});

export function StringToListPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          String to List Converter
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Convert strings to lists and arrays with custom delimiters. Parse and split text data into structured formats.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <StringToList />
      </div>
    </div>
  );
} 