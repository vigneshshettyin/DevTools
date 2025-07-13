"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Search, Download, Database } from "lucide-react";

interface CSVData {
  [key: string]: string | number | boolean | null;
}

export function CsvViewer() {
  const [csvData, setCsvData] = useState<CSVData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState<CSVData[]>([]);
  const [error, setError] = useState("");
  const [isQueryMode, setIsQueryMode] = useState(false);
  const [fileName, setFileName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError("");
    setQuery("");
    setQueryResult([]);
    setCurrentPage(1);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError("Error parsing CSV file. Please check the format.");
          return;
        }

        const data = results.data as CSVData[];
        if (data.length === 0) {
          setError("No data found in CSV file.");
          return;
        }

        const cols = Object.keys(data[0]);
        setColumns(cols);
        setCsvData(data);
      },
      error: (error) => {
        setError(`Error reading file: ${error.message}`);
      },
    });
  };

  const executeQuery = () => {
    if (!query.trim()) {
      setQueryResult([]);
      setColumns(Object.keys(csvData[0] || {}));
      return;
    }

    try {
      // SQL-like query parser
      const selectMatch = query.match(/select\s+(.+?)\s+from/i);
      const whereMatch = query.match(/where\s+(.+?)(?:\s+limit|$)/i);
      const limitMatch = query.match(/limit\s+(\d+)/i);

      let filteredData = [...csvData];
      let selectedColumns: string[] = Object.keys(csvData[0] || {});

      // WHERE clause
      if (whereMatch) {
        const condition = whereMatch[1].trim();
        // Support: column operator value (e.g., age > 25, name = 'John', name LIKE 'John')
        const condMatch = condition.match(/([\w.]+)\s*(=|>|<|>=|<=|like)\s*['"]?([^'"]+)['"]?/i);
        if (condMatch) {
          const [, field, operator, value] = condMatch;
          filteredData = filteredData.filter((row) => {
            const cell = row[field];
            if (cell === undefined) return false;
            if (operator.toLowerCase() === 'like') {
              return String(cell).toLowerCase().includes(String(value).toLowerCase());
            }
            if (typeof cell === 'number' || !isNaN(Number(cell))) {
              const numCell = Number(cell);
              const numValue = Number(value);
              switch (operator) {
                case '>': return numCell > numValue;
                case '<': return numCell < numValue;
                case '>=': return numCell >= numValue;
                case '<=': return numCell <= numValue;
                case '=': return numCell === numValue;
                default: return false;
              }
            } else {
              switch (operator) {
                case '=': return String(cell) === value;
                default: return false;
              }
            }
          });
        }
      }

      // SELECT clause
      if (selectMatch) {
        selectedColumns = selectMatch[1].split(',').map((col) => col.trim());
        if (selectedColumns[0] !== '*') {
          filteredData = filteredData.map((row) => {
            const newRow: CSVData = {};
            selectedColumns.forEach((col) => {
              newRow[col] = row[col];
            });
            return newRow;
          });
        } else {
          selectedColumns = Object.keys(csvData[0] || {});
        }
      }

      // LIMIT clause
      if (limitMatch) {
        const limit = parseInt(limitMatch[1]);
        filteredData = filteredData.slice(0, limit);
      }

      setQueryResult(filteredData);
      setColumns(selectedColumns);
      setError("");
    } catch {
      setError("Invalid query syntax. Try: SELECT * FROM data WHERE column LIKE 'value' LIMIT 10");
    }
  };

  const exportToCSV = (data: CSVData[]) => {
    if (data.length === 0) return;

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `exported_${fileName}`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dataToShow = isQueryMode ? queryResult : csvData;
  const totalPages = Math.ceil(dataToShow.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = dataToShow.slice(startIndex, endIndex);

  const sampleQueries = [
    "SELECT * FROM data",
    "SELECT name, age FROM data WHERE age > 25",
    "SELECT * FROM data WHERE name LIKE 'John'",
    "SELECT * FROM data LIMIT 5",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">CSV Viewer & Query Tool</h2>
        <div className="flex items-center space-x-2">
          <a
            href="/sample-data.csv"
            download
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Download Sample CSV
          </a>
          {csvData.length > 0 && (
            <>
              <button
                onClick={() => setIsQueryMode(!isQueryMode)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  isQueryMode
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Database className="w-4 h-4 inline mr-1" />
                {isQueryMode ? "Table View" : "Query Mode"}
              </button>
              <button
                onClick={() => exportToCSV(dataToShow)}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4 inline mr-1" />
                Export
              </button>
            </>
          )}
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Upload CSV File
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/30"
          />
          {fileName && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Loaded: {fileName}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {csvData.length > 0 && (
        <>
          {/* Query Interface */}
          {isQueryMode && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  SQL-like Query
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="SELECT * FROM data WHERE column LIKE 'value' LIMIT 10"
                    className="flex-1 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={executeQuery}
                    className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                  >
                    <Search className="w-4 h-4 inline mr-1" />
                    Query
                  </button>
                </div>
              </div>

              {/* Sample Queries */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sample Queries
                </label>
                <div className="flex flex-wrap gap-2">
                  {sampleQueries.map((sampleQuery, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(sampleQuery)}
                      className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {sampleQuery}
                    </button>
                  ))}
                </div>
              </div>

              {queryResult.length > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Query returned {queryResult.length} rows
                </div>
              )}
            </div>
          )}

          {/* Table */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isQueryMode ? "Query Results" : "Data Table"} ({dataToShow.length} rows)
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      {columns.map((column, index) => (
                        <th
                          key={index}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {currentData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        {columns.map((column, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                            <div className="px-2 py-1 text-sm">
                              {typeof row[column] === "string" && String(row[column]).length > 50
                                ? `${String(row[column]).substring(0, 50)}...`
                                : String(row[column] || "")}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {"<<"}
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {"<"}
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {">"}
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {">>"}
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  >
                    {[10, 20, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        Show {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
} 