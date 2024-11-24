"use client"

import { useState } from 'react'

export function StringToList() {
  const [input, setInput] = useState('')
  const [delimiter, setDelimiter] = useState(',')
  const [output, setOutput] = useState('')

  const handleConvert = () => {
    const values = input.split(delimiter).map(v => v.trim())
    const unquotedValues = values.map(v => v.replace(/^['"](.*)['"]$/, '$1'))
    setOutput(unquotedValues.join('\n'))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">String to List</h2>
      <div className="space-y-2">
        <label htmlFor="string-input" className="block text-sm font-medium text-gray-700">
          Enter delimiter-separated string
        </label>
        <input
          id="string-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your string here..."
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="delimiter" className="block text-sm font-medium text-gray-700">
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
      <button
        onClick={handleConvert}
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Convert
      </button>
      <div className="space-y-2">
        <label htmlFor="output" className="block text-sm font-medium text-gray-700">
          Output
        </label>
        <textarea
          id="output"
          value={output}
          readOnly
          rows={5}
          className="w-full px-3 py-2 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none"
        />
      </div>
    </div>
  )
}

