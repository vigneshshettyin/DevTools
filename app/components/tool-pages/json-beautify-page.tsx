"use client";

import dynamic from "next/dynamic";

const JsonBeautify = dynamic(() => import("../json-beautify").then(m => m.JsonBeautify), { 
  ssr: false, 
  loading: () => <div className="flex items-center justify-center p-8">Loading JSON Beautify tool...</div> 
});

export function JsonBeautifyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          JSON Beautify & Formatter
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Format and beautify JSON with syntax highlighting and proper indentation. Validate and prettify your JSON data for better readability.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <JsonBeautify />
      </div>
    </div>
  );
} 