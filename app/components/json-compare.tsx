"use client";

import { useState, useMemo } from "react";
import { JSONTree } from "react-json-tree";

export function JsonCompare() {
  const [json1, setJson1] = useState(`{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  },
  "hobbies": ["reading", "swimming", "coding"]
}`);
  const [json2, setJson2] = useState(`{
  "name": "John Doe",
  "age": 31,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  },
  "hobbies": ["reading", "swimming", "gaming"],
  "phone": "+1-555-1234"
}`);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"text" | "tree">("tree");

  const parsedJson1 = useMemo(() => {
    try {
      return json1 ? JSON.parse(json1) : null;
    } catch {
      return null;
    }
  }, [json1]);

  const parsedJson2 = useMemo(() => {
    try {
      return json2 ? JSON.parse(json2) : null;
    } catch {
      return null;
    }
  }, [json2]);



  const darkTheme = {
    base00: "transparent",
    base01: "#1a202c",
    base02: "#2d3748",
    base03: "#4a5568",
    base04: "#718096",
    base05: "#a0aec0",
    base06: "#e2e8f0",
    base07: "#f7fafc",
    base08: "#fc8181",
    base09: "#fbb6ce",
    base0A: "#f6e05e",
    base0B: "#68d391",
    base0C: "#4fd1c7",
    base0D: "#63b3ed",
    base0E: "#b794f4",
    base0F: "#f687b3",
  };

  const compareJson = () => {
    setError("");
    setResult("");

    try {
      const obj1 = JSON.parse(json1);
      const obj2 = JSON.parse(json2);

      const differences = findDifferences(obj1, obj2, "");
      
      if (differences.length === 0) {
        setResult("✅ The JSON objects are identical!");
      } else {
        setResult("Differences found:\n" + differences.join("\n"));
      }
    } catch {
      setError("Invalid JSON format. Please check your input.");
    }
  };

  const findDifferences = (obj1: unknown, obj2: unknown, path: string): string[] => {
    const differences: string[] = [];

    // Check if both are objects
    if (typeof obj1 === "object" && obj1 !== null && typeof obj2 === "object" && obj2 !== null) {
      const obj1Record = obj1 as Record<string, unknown>;
      const obj2Record = obj2 as Record<string, unknown>;
      const keys1 = Object.keys(obj1Record);
      const keys2 = Object.keys(obj2Record);
      const allKeys = new Set([...keys1, ...keys2]);

      for (const key of allKeys) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (!keys1.includes(key)) {
          differences.push(`❌ Missing in JSON 1: ${currentPath}`);
        } else if (!keys2.includes(key)) {
          differences.push(`❌ Missing in JSON 2: ${currentPath}`);
        } else if (JSON.stringify(obj1Record[key]) !== JSON.stringify(obj2Record[key])) {
          if (typeof obj1Record[key] === "object" && obj1Record[key] !== null && typeof obj2Record[key] === "object" && obj2Record[key] !== null) {
            differences.push(...findDifferences(obj1Record[key], obj2Record[key], currentPath));
          } else {
            differences.push(`🔄 Different values at ${currentPath}:`);
            differences.push(`   JSON 1: ${JSON.stringify(obj1Record[key])}`);
            differences.push(`   JSON 2: ${JSON.stringify(obj2Record[key])}`);
          }
        }
      }
    } else if (obj1 !== obj2) {
      differences.push(`🔄 Different values at ${path}:`);
      differences.push(`   JSON 1: ${JSON.stringify(obj1)}`);
      differences.push(`   JSON 2: ${JSON.stringify(obj2)}`);
    }

    return differences;
  };

  const clearAll = () => {
    setJson1("");
    setJson2("");
    setResult("");
    setError("");
    setSearchTerm("");
  };

  const highlightSearch = (data: unknown) => {
    if (!searchTerm) return data;
    
    const highlightText = (text: string) => {
      if (!searchTerm) return text;
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
    };

    const highlightObject = (obj: unknown): unknown => {
      if (typeof obj === 'string') {
        return highlightText(obj);
      } else if (Array.isArray(obj)) {
        return obj.map(highlightObject);
      } else if (obj && typeof obj === 'object') {
        const highlighted: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj)) {
          highlighted[highlightText(key)] = highlightObject(value);
        }
        return highlighted;
      }
      return obj;
    };

    return highlightObject(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">JSON Compare</h2>
        <button
          onClick={clearAll}
          className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          Clear All
        </button>
      </div>

      {/* Search Bar */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Search (highlight matches)
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search in JSON..."
          className="w-full px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View Mode:</span>
        <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode("tree")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === "tree"
                ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Tree View
          </button>
          <button
            onClick={() => setViewMode("text")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === "text"
                ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Text View
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            JSON 1
          </label>
          {viewMode === "text" ? (
            <textarea
              value={json1}
              onChange={(e) => setJson1(e.target.value)}
              placeholder="Enter first JSON object..."
              rows={12}
              className="w-full px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          ) : (
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 min-h-[300px] overflow-auto">
              {parsedJson1 ? (
                <JSONTree
                  data={highlightSearch(parsedJson1)}
                  theme={darkTheme}
                  invertTheme={false}
                />
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Enter valid JSON to view tree structure
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            JSON 2
          </label>
          {viewMode === "text" ? (
            <textarea
              value={json2}
              onChange={(e) => setJson2(e.target.value)}
              placeholder="Enter second JSON object..."
              rows={12}
              className="w-full px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          ) : (
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 min-h-[300px] overflow-auto">
              {parsedJson2 ? (
                <JSONTree
                  data={highlightSearch(parsedJson2)}
                  theme={darkTheme}
                  invertTheme={false}
                />
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Enter valid JSON to view tree structure
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={compareJson}
        className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
      >
        Compare JSON
      </button>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Comparison Result
          </label>
          <textarea
            value={result}
            readOnly
            rows={8}
            className="w-full px-3 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
} 