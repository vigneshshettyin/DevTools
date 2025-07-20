"use client";

import { useState } from 'react';
import { Copy, Download } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface CodePlaygroundEditorProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  language: 'html' | 'css' | 'javascript';
  placeholder?: string;
  theme?: 'vs-dark' | 'vs-light' | 'hc-black';
  editorType?: 'monaco' | 'rich-text';
}

export function CodePlaygroundEditor({ 
  title, 
  value, 
  onChange, 
  language, 
  placeholder,
  theme = 'vs-dark',
  editorType = 'monaco'
}: CodePlaygroundEditorProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase()}.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getMonacoLanguage = () => {
    switch (language) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'javascript': return 'javascript';
      default: return 'plaintext';
    }
  };

  const renderRichTextEditor = () => (
    <div className="h-full bg-white dark:bg-gray-900">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none border-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        placeholder={placeholder}
        spellCheck={false}
      />
    </div>
  );

  const renderMonacoEditor = () => (
    <Editor
      height="100%"
      defaultLanguage={getMonacoLanguage()}
      language={getMonacoLanguage()}
      value={value}
      onChange={(value) => onChange(value || '')}
      theme={theme}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible',
        },
        automaticLayout: true,
        wordWrap: 'on',
        folding: true,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 3,
        glyphMargin: false,
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        overviewRulerLanes: 0,
        renderLineHighlight: 'all',
        renderWhitespace: 'none',
        contextmenu: true,
        quickSuggestions: true,
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        tabCompletion: 'on',
        autoIndent: 'full',
        formatOnPaste: true,
        formatOnType: true,
      }}
    />
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700 dark:text-gray-400">{title}</span>
          <span className="text-xs text-gray-500 dark:text-gray-500">({editorType === 'monaco' ? 'Monaco' : 'Rich Text'})</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            title="Copy code"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            title="Download code"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        {editorType === 'rich-text' ? renderRichTextEditor() : renderMonacoEditor()}
        {isCopied && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs z-10">
            Copied!
          </div>
        )}
      </div>
    </div>
  );
} 