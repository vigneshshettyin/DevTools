"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type Tool = {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ReactNode;
};

interface ToolSelectorProps {
  tools: Tool[];
  currentTool: string;
  onToolChange: (toolId: string) => void;
}

export function ToolSelector({ tools, currentTool, onToolChange }: ToolSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentToolData = tools.find(tool => tool.id === currentTool);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <div className="flex items-center space-x-3">
          {currentToolData?.icon}
          <span className="font-medium text-gray-900 dark:text-white">
            {currentToolData?.name}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                onToolChange(tool.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 ${
                currentTool === tool.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
              }`}
            >
              {tool.icon}
              <span className="font-medium">{tool.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 