"use client";

import dynamic from "next/dynamic";

const SqlBeautify = dynamic(() => import("../sql-beautify").then(m => m.SqlBeautify), { 
  ssr: false, 
  loading: () => <div className="flex items-center justify-center p-8">Loading SQL Beautify tool...</div> 
});

export function SqlBeautifyPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          SQL Beautify & Flow Analyzer
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Format SQL queries with proper indentation and analyze execution flow. Understand query performance and optimize your database operations.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <SqlBeautify />
      </div>
    </div>
  );
} 