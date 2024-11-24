"use client";

import { useState } from "react";

export function ListToString() {
  const [input, setInput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [quoteType, setQuoteType] = useState("");
  const [output, setOutput] = useState("");
  const [useQuotes, setUseQuotes] = useState(false);

  const handleConvert = () => {
    const values = input.split("\n").filter(Boolean);
    const quotedValues = useQuotes
      ? values.map((v) => `${quoteType}${v}${quoteType}`)
      : values;
    setOutput(quotedValues.join(delimiter));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">List to String</h2>
      <div className="space-y-2">
        <label
          htmlFor="list-input"
          className="block text-sm font-medium text-gray-700"
        >
          Enter list (one item per line)
        </label>
        <textarea
          id="list-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your list here..."
          rows={5}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="delimiter"
          className="block text-sm font-medium text-gray-700"
        >
          Delimiter
        </label>
        <input
          id="delimiter"
          type="text"
          value={delimiter}
          onChange={(e) => setDelimiter(e.target.value)}
          placeholder="Enter delimiter"
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          id="use-quotes"
          type="checkbox"
          checked={useQuotes}
          onChange={(e) => setUseQuotes(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label
          htmlFor="use-quotes"
          className="text-sm font-medium text-gray-700"
        >
          Use quotes
        </label>
      </div>
      {useQuotes && (
        <div className="space-y-2">
          <label
            htmlFor="quote-type"
            className="block text-sm font-medium text-gray-700"
          >
            Quote type
          </label>
          <select
            id="quote-type"
            value={quoteType}
            onChange={(e) => setQuoteType(e.target.value)}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">Select quote type</option>
            <option value="'">Single quotes</option>
            <option value='"'>Double quotes</option>
          </select>
        </div>
      )}
      <button
        onClick={handleConvert}
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Convert
      </button>
      <div className="space-y-2">
        <label
          htmlFor="output"
          className="block text-sm font-medium text-gray-700"
        >
          Output
        </label>
        <textarea
          id="output"
          value={output}
          readOnly
          rows={3}
          className="w-full px-3 py-2 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none"
        />
      </div>
    </div>
  );
}
