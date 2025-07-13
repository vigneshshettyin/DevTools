import Link from "next/link";
import { List, FileText, GitCompare, Sparkles, Table, Database } from "lucide-react";

export default function Home() {
  const tools = [
    {
      id: "list-to-string",
      name: "List to String",
      description: "Convert lists to formatted strings with custom separators",
      icon: <List className="w-6 h-6" />,
      href: "/tools/list-to-string",
    },
    {
      id: "string-to-list",
      name: "String to List",
      description: "Convert strings to lists with custom delimiters",
      icon: <FileText className="w-6 h-6" />,
      href: "/tools/string-to-list",
    },
    {
      id: "json-compare",
      name: "JSON Compare",
      description: "Compare and diff JSON objects with visual highlighting",
      icon: <GitCompare className="w-6 h-6" />,
      href: "/tools/json-compare",
    },
    {
      id: "json-beautify",
      name: "JSON Beautify",
      description: "Format and beautify JSON with syntax highlighting",
      icon: <Sparkles className="w-6 h-6" />,
      href: "/tools/json-beautify",
    },
    {
      id: "csv-viewer",
      name: "CSV Viewer & Query",
      description: "View, edit, and query CSV data with SQL-like syntax",
      icon: <Table className="w-6 h-6" />,
      href: "/tools/csv-viewer",
    },
    {
      id: "sql-beautify",
      name: "SQL Beautify & Flow",
      description: "Format SQL queries and analyze execution flow",
      icon: <Database className="w-6 h-6" />,
      href: "/tools/sql-beautify",
    },

  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          DevTools
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Essential developer productivity tools for your daily workflow
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="group block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                {tool.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {tool.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Why DevTools?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fast & Efficient</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Streamlined tools designed for developer productivity with instant results.
            </p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Modern UI</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Clean, responsive design with dark mode support for comfortable usage.
            </p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No Installation</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Web-based tools that work instantly in your browser without any setup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
