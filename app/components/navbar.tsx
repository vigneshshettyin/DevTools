"use client";

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { Code2, ChevronDown, List, FileText, GitCompare, Sparkles, Table, Database } from 'lucide-react'
import { ThemeToggle } from './theme-provider'

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const tools = [
    {
      id: "list-to-string",
      name: "List to String",
      icon: <List className="w-4 h-4" />,
      href: "/tools/list-to-string",
    },
    {
      id: "string-to-list",
      name: "String to List",
      icon: <FileText className="w-4 h-4" />,
      href: "/tools/string-to-list",
    },
    {
      id: "json-compare",
      name: "JSON Compare",
      icon: <GitCompare className="w-4 h-4" />,
      href: "/tools/json-compare",
    },
    {
      id: "json-beautify",
      name: "JSON Beautify",
      icon: <Sparkles className="w-4 h-4" />,
      href: "/tools/json-beautify",
    },
    {
      id: "csv-viewer",
      name: "CSV Viewer",
      icon: <Table className="w-4 h-4" />,
      href: "/tools/csv-viewer",
    },
    {
      id: "sql-beautify",
      name: "SQL Beautify",
      icon: <Database className="w-4 h-4" />,
      href: "/tools/sql-beautify",
    },

  ];

  const getCurrentTool = () => {
    return tools.find(tool => pathname === tool.href) || { name: "Select Tool", icon: <Code2 className="w-4 h-4" /> };
  };

  const currentTool = getCurrentTool();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Code2 className="w-8 h-8 text-gray-900 dark:text-white" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">DevTools</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* Tool Switcher Dropdown - Only show on tool pages */}
          {pathname !== "/" && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  {currentTool.icon}
                  <span>{currentTool.name}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    {tools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={tool.href}
                        onClick={() => setIsDropdownOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          pathname === tool.href ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {tool.icon}
                        <span>{tool.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <ThemeToggle />
        </div>
      </div>
      
      {/* Backdrop to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </nav>
  )
}

