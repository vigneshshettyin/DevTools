"use client";

import { useState } from "react";
import { format } from "sql-formatter";

export function SqlBeautify() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [dialect, setDialect] = useState<"sql" | "mysql" | "postgresql" | "sqlite" | "mariadb" | "bigquery" | "db2" | "db2i" | "duckdb" | "hive" | "tidb" | "n1ql" | "plsql" | "redshift" | "spark" | "trino" | "transactsql" | "singlestoredb" | "snowflake" | "tsql">("sql");
  const [executionFlow, setExecutionFlow] = useState<string[]>([]);

  const beautifySql = () => {
    setError("");
    setOutput("");
    setExecutionFlow([]);

    try {
      const beautified = format(input, {
        language: dialect,
      });
      setOutput(beautified);
      analyzeExecutionFlow(input);
    } catch {
      setError("Invalid SQL format. Please check your input.");
    }
  };

  const minifySql = () => {
    setError("");
    setOutput("");
    setExecutionFlow([]);

    try {
      const minified = format(input, {
        language: dialect,
      });
      setOutput(minified);
      analyzeExecutionFlow(input);
    } catch {
      setError("Invalid SQL format. Please check your input.");
    }
  };

  const analyzeExecutionFlow = (sql: string) => {
    const flow: string[] = [];
    const sqlUpper = sql.toUpperCase();
    
    // Simple regex-based analysis
    if (sqlUpper.includes("SELECT")) {
      flow.push("1. FROM clause - Determine source tables");
      if (sqlUpper.includes("WHERE")) {
        flow.push("2. WHERE clause - Filter rows");
      }
      if (sqlUpper.includes("GROUP BY")) {
        flow.push("3. GROUP BY clause - Group rows");
      }
      if (sqlUpper.includes("HAVING")) {
        flow.push("4. HAVING clause - Filter groups");
      }
      flow.push("5. SELECT clause - Choose columns");
      if (sqlUpper.includes("ORDER BY")) {
        flow.push("6. ORDER BY clause - Sort results");
      }
      if (sqlUpper.includes("LIMIT")) {
        flow.push("7. LIMIT clause - Limit results");
      }
    } else if (sqlUpper.includes("INSERT")) {
      flow.push("1. Validate table exists");
      flow.push("2. Check column constraints");
      flow.push("3. Insert data into table");
      flow.push("4. Return affected row count");
    } else if (sqlUpper.includes("UPDATE")) {
      flow.push("1. FROM clause - Determine source tables");
      if (sqlUpper.includes("WHERE")) {
        flow.push("2. WHERE clause - Filter rows to update");
      }
      flow.push("3. UPDATE clause - Modify data");
      flow.push("4. Return affected row count");
    } else if (sqlUpper.includes("DELETE")) {
      flow.push("1. FROM clause - Determine source table");
      if (sqlUpper.includes("WHERE")) {
        flow.push("2. WHERE clause - Filter rows to delete");
      }
      flow.push("3. DELETE clause - Remove rows");
      flow.push("4. Return affected row count");
    } else if (sqlUpper.includes("CREATE")) {
      flow.push("1. Validate table name");
      flow.push("2. Check column definitions");
      flow.push("3. Create table structure");
      flow.push("4. Apply constraints and indexes");
    } else if (sqlUpper.includes("DROP")) {
      flow.push("1. Validate table exists");
      flow.push("2. Check dependencies");
      flow.push("3. Drop table structure");
      flow.push("4. Clean up related objects");
    } else if (sqlUpper.includes("ALTER")) {
      flow.push("1. Validate table exists");
      flow.push("2. Check modification constraints");
      flow.push("3. Apply structural changes");
      flow.push("4. Update metadata");
    } else {
      flow.push("1. Parse SQL statement");
      flow.push("2. Validate syntax and permissions");
      flow.push("3. Create execution plan");
      flow.push("4. Execute query");
      flow.push("5. Return results");
    }
    
    setExecutionFlow(flow);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setExecutionFlow([]);
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  const sampleQueries = [
    "SELECT name, age FROM users WHERE age > 25 ORDER BY age DESC LIMIT 10",
    "INSERT INTO users (name, email, age) VALUES ('John', 'john@example.com', 30)",
    "UPDATE users SET age = 31 WHERE name = 'John'",
    "DELETE FROM users WHERE age < 18",
    "CREATE TABLE products (id INT PRIMARY KEY, name VARCHAR(100), price DECIMAL(10,2))",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">SQL Beautify & Flow Analyzer</h2>
        <button
          onClick={clearAll}
          className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Input SQL
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter SQL query to beautify..."
          rows={8}
          className="w-full px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
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

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Dialect:
          </label>
          <select
            value={dialect}
            onChange={(e) => setDialect(e.target.value as typeof dialect)}
            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="sql">Standard SQL</option>
            <option value="mysql">MySQL</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="sqlite">SQLite</option>
            <option value="mariadb">MariaDB</option>
            <option value="bigquery">BigQuery</option>
            <option value="redshift">Redshift</option>
            <option value="snowflake">Snowflake</option>
          </select>
        </div>

        <button
          onClick={beautifySql}
          className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
        >
          Beautify
        </button>

        <button
          onClick={minifySql}
          className="px-4 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors"
        >
          Minify
        </button>
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
              onClick={() => setInput(sampleQuery)}
              className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {sampleQuery.substring(0, 30)}...
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {output && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Formatted SQL
              </label>
              <button
                onClick={copyToClipboard}
                className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              >
                Copy to Clipboard
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              rows={12}
              className="w-full px-3 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Execution Flow
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 min-h-[300px]">
              {executionFlow.length > 0 ? (
                <div className="space-y-2">
                  {executionFlow.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 text-sm text-gray-900 dark:text-white">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Enter a SQL query to see execution flow
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 