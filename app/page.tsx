"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { ToolSelector, Tool } from "./components/tool-selector";
import { List, FileText, GitCompare, Sparkles, Table, Database } from "lucide-react";

const ListToString = dynamic(() => import("./components/list-to-string").then(m => m.ListToString), { ssr: false, loading: () => <div>Loading...</div> });
const StringToList = dynamic(() => import("./components/string-to-list").then(m => m.StringToList), { ssr: false, loading: () => <div>Loading...</div> });
const JsonCompare = dynamic(() => import("./components/json-compare").then(m => m.JsonCompare), { ssr: false, loading: () => <div>Loading...</div> });
const JsonBeautify = dynamic(() => import("./components/json-beautify").then(m => m.JsonBeautify), { ssr: false, loading: () => <div>Loading...</div> });
const CsvViewer = dynamic(() => import("./components/csv-viewer").then(m => m.CsvViewer), { ssr: false, loading: () => <div>Loading...</div> });
const SqlBeautify = dynamic(() => import("./components/sql-beautify").then(m => m.SqlBeautify), { ssr: false, loading: () => <div>Loading...</div> });

export default function Home() {
  const [currentTool, setCurrentTool] = useState("list-to-string");

  const tools: Tool[] = [
    {
      id: "list-to-string",
      name: "List to String",
      icon: <List className="w-5 h-5" />,
      component: <ListToString />,
    },
    {
      id: "string-to-list",
      name: "String to List",
      icon: <FileText className="w-5 h-5" />,
      component: <StringToList />,
    },
    {
      id: "json-compare",
      name: "JSON Compare",
      icon: <GitCompare className="w-5 h-5" />,
      component: <JsonCompare />,
    },
    {
      id: "json-beautify",
      name: "JSON Beautify",
      icon: <Sparkles className="w-5 h-5" />,
      component: <JsonBeautify />,
    },
    {
      id: "csv-viewer",
      name: "CSV Viewer & Query",
      icon: <Table className="w-5 h-5" />,
      component: <CsvViewer />,
    },
    {
      id: "sql-beautify",
      name: "SQL Beautify & Flow",
      icon: <Database className="w-5 h-5" />,
      component: <SqlBeautify />,
    },
  ];

  const currentToolData = tools.find(tool => tool.id === currentTool);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">DevTools</h1>
      </div>
      
      <div className="max-w-md">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Tool
        </label>
        <ToolSelector
          tools={tools}
          currentTool={currentTool}
          onToolChange={setCurrentTool}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <Suspense fallback={<div>Loading tool...</div>}>
          {currentToolData?.component}
        </Suspense>
      </div>
    </div>
  );
}
