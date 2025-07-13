"use client";

import { useState } from "react";
import { Clipboard, Trash2 } from "lucide-react";

export function StringToList() {
  const [input, setInput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    const values = input.split(delimiter).map((v) => v.trim());
    const unquotedValues = values.map((v) => v.replace(/^['"](.*)['"]$/, "$1"));
    setOutput(unquotedValues.join("\n"));
  };



  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const handleClear = () => {
    setInput("");
    setDelimiter(",");
    setOutput("");
    setCopied(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">String to List</h2>
        <button
          onClick={handleClear}
          className="flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 bg-gray-100 dark:bg-gray-700 rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-1" /> Clear All
        </button>
      </div>

      <div className="space-y-2">
        <label htmlFor="string-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Enter delimiter-separated string
        </label>
        <input
          id="string-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your string here..."
          className="w-full px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="delimiter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Delimiter
          </label>
          <input
            id="delimiter"
            type="text"
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            placeholder=","
            className="w-full px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={handleConvert}
          className="px-5 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          Convert
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="output" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Output
          </label>
          <button
            onClick={handleCopy}
            disabled={!output}
            className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors ${output ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800" : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"}`}
          >
            <Clipboard className="w-4 h-4 mr-1" />
            {copied ? "Copied!" : "Copy Output"}
          </button>
        </div>
        <textarea
          id="output"
          value={output}
          readOnly
          rows={5}
          className="w-full px-3 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none font-mono text-sm"
        />
      </div>
    </div>
  );
}

