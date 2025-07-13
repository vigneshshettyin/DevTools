"use client";

import { useState, useMemo } from "react";
import { JSONTree } from "react-json-tree";

export function JsonBeautify() {
  const [input, setInput] = useState(`{"name":"John Doe","age":30,"email":"john@example.com","address":{"street":"123 Main St","city":"New York","zip":"10001"},"hobbies":["reading","swimming","coding"],"preferences":{"theme":"dark","notifications":true,"language":"en"}}`);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"text" | "tree">("tree");

  const parsedInput = useMemo(() => {
    try {
      return input ? JSON.parse(input) : null;
    } catch {
      return null;
    }
  }, [input]);

  const parsedOutput = useMemo(() => {
    try {
      return output ? JSON.parse(output) : null;
    } catch {
      return null;
    }
  }, [output]);

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

  const beautifyJson = () => {
    setError("");
    setOutput("");

    try {
      const parsed = JSON.parse(input);
      const beautified = JSON.stringify(parsed, null, indentSize);
      setOutput(beautified);
    } catch {
      setError("Invalid JSON format. Please check your input.");
    }
  };

  const minifyJson = () => {
    setError("");
    setOutput("");

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
    } catch {
      setError("Invalid JSON format. Please check your input.");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setSearchTerm("");
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">JSON Beautify</h2>
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
            Input JSON
          </label>
          {viewMode === "text" ? (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter JSON to beautify..."
              rows={10}
              className="w-full px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          ) : (
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 min-h-[300px] overflow-auto">
              {parsedInput ? (
                <JSONTree
                  data={highlightSearch(parsedInput)}
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
            Output JSON
          </label>
          {viewMode === "text" ? (
            <textarea
              value={output}
              readOnly
              rows={10}
              className="w-full px-3 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none font-mono text-sm"
            />
          ) : (
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 min-h-[300px] overflow-auto">
              {parsedOutput ? (
                <JSONTree
                  data={highlightSearch(parsedOutput)}
                  theme={darkTheme}
                  invertTheme={false}
                />
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Beautified JSON will appear here
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Indent Size:
          </label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={8}>8 spaces</option>
          </select>
        </div>

        <button
          onClick={beautifyJson}
          className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
        >
          Beautify
        </button>

        <button
          onClick={minifyJson}
          className="px-4 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors"
        >
          Minify
        </button>

        {output && (
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            Copy to Clipboard
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
} 