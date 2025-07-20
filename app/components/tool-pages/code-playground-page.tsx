"use client";

import { useState, useEffect } from 'react';
import { CodePlaygroundEditor } from '../code-playground-editor';
import { Eye, RefreshCw } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: 'html' | 'css' | 'javascript';
  isOpen?: boolean;
}

type EditorTheme = 'vs-dark' | 'vs-light' | 'hc-black';
type EditorType = 'monaco' | 'rich-text';

export function CodePlaygroundPage() {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: 'index.html',
      name: 'index.html',
      type: 'file',
      language: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Playground</title>
</head>
<body>
    <div class="container">
        <h1>Welcome to Code Playground</h1>
        <p>Edit the HTML, CSS, and JavaScript to see real-time changes.</p>
        <div id="output"></div>
    </div>
</body>
</html>`
    },
    {
      id: 'styles.css',
      name: 'styles.css',
      type: 'file',
      language: 'css',
      content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    text-align: center;
    max-width: 600px;
    padding: 2rem;
}

h1 {
    color: #ffd700;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

p {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    opacity: 0.9;
}

#output {
    margin-top: 2rem;
    padding: 1.5rem;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
}

button {
    padding: 10px 20px;
    margin: 5px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}`
    },
    {
      id: 'script.js',
      name: 'script.js',
      type: 'file',
      language: 'javascript',
      content: `// JavaScript code runs here
console.log('JavaScript is working!');

// Wait for DOM to be ready
function init() {
    const output = document.getElementById('output');
    if (output) {
        output.innerHTML = '<h3>✅ JavaScript is running successfully!</h3>';
        
        // Create interactive elements
        createButtons(output);
        createCounter(output);
        createColorPicker(output);
    }
}

function createButtons(output) {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginTop = '1rem';
    
    const alertBtn = document.createElement('button');
    alertBtn.textContent = 'Show Alert';
    alertBtn.style.background = '#ffd700';
    alertBtn.style.color = '#333';
    alertBtn.onclick = () => alert('Hello from JavaScript!');
    
    const consoleBtn = document.createElement('button');
    consoleBtn.textContent = 'Log to Console';
    consoleBtn.style.background = '#4CAF50';
    consoleBtn.style.color = 'white';
    consoleBtn.onclick = () => {
        console.log('Button clicked at:', new Date().toLocaleTimeString());
        alert('Check the browser console!');
    };
    
    buttonContainer.appendChild(alertBtn);
    buttonContainer.appendChild(consoleBtn);
    output.appendChild(buttonContainer);
}

function createCounter(output) {
    let count = 0;
    const counterDiv = document.createElement('div');
    counterDiv.style.marginTop = '1rem';
    
    const counterBtn = document.createElement('button');
    counterBtn.textContent = 'Count: ' + count;
    counterBtn.style.background = '#2196F3';
    counterBtn.style.color = 'white';
    counterBtn.onclick = () => {
        count++;
        counterBtn.textContent = 'Count: ' + count;
    };
    
    counterDiv.appendChild(counterBtn);
    output.appendChild(counterDiv);
}

function createColorPicker(output) {
    const colorDiv = document.createElement('div');
    colorDiv.style.marginTop = '1rem';
    
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = '#ffd700';
    colorInput.style.marginRight = '10px';
    
    const colorLabel = document.createElement('span');
    colorLabel.textContent = 'Change title color: ';
    colorLabel.style.marginRight = '10px';
    
    colorInput.onchange = (e) => {
        document.querySelector('h1').style.color = e.target.value;
    };
    
    colorDiv.appendChild(colorLabel);
    colorDiv.appendChild(colorInput);
    output.appendChild(colorDiv);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}`
    }
  ]);

  const [selectedFile, setSelectedFile] = useState<string>('index.html');
  const [isPreviewOpen] = useState(true);
  const [editorTheme, setEditorTheme] = useState<EditorTheme>('vs-dark');
  const [editorType, setEditorType] = useState<EditorType>('monaco');
  const [output, setOutput] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const selectedFileData = files.find(f => f.id === selectedFile);

  // Update output when files change
  useEffect(() => {
    const htmlFile = files.find(f => f.id === 'index.html');
    const cssFile = files.find(f => f.id === 'styles.css');
    const jsFile = files.find(f => f.id === 'script.js');

    if (htmlFile && cssFile && jsFile) {
      setIsPreviewLoading(true);
      
      // Extract body content from HTML
      const bodyContent = htmlFile.content?.replace(/<!DOCTYPE html>|<html[^>]*>|<\/html>|<head[^>]*>|<\/head>|<body[^>]*>|<\/body>/gi, '').trim() || '';
      
      const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Code Playground</title>
          <style>${cssFile.content || ''}</style>
        </head>
        <body>
          ${bodyContent}
          <script>
            try {
              ${jsFile.content || ''}
            } catch (error) {
              console.error('JavaScript Error:', error);
              const output = document.getElementById('output');
              if (output) {
                output.innerHTML = '<h3>JavaScript Error:</h3><p style="color: #ff6b6b;">❌ ' + error.message + '</p>';
              }
            }
          </script>
        </body>
        </html>
      `;
      
      setOutput(fullHtml);
      
      // Simulate loading delay for better UX
      setTimeout(() => setIsPreviewLoading(false), 300);
    }
  }, [files]);

  const updateFileContent = (fileId: string, content: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, content } : f
    ));
  };

  const getFileColor = (file: FileItem) => {
    if (file.type === 'folder') return 'text-blue-500';
    switch (file.language) {
      case 'html': return 'text-orange-500';
      case 'css': return 'text-blue-500';
      case 'javascript': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const refreshPreview = () => {
    setIsPreviewLoading(true);
    setTimeout(() => setIsPreviewLoading(false), 200);
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Top Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Code Playground</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={editorTheme}
            onChange={(e) => setEditorTheme(e.target.value as EditorTheme)}
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 rounded text-sm border border-gray-300 dark:border-gray-600"
          >
            <option value="vs-dark">Dark Theme</option>
            <option value="vs-light">Light Theme</option>
            <option value="hc-black">High Contrast</option>
          </select>
          
          <select
            value={editorType}
            onChange={(e) => setEditorType(e.target.value as EditorType)}
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 rounded text-sm border border-gray-300 dark:border-gray-600"
          >
            <option value="monaco">Monaco Editor</option>
            <option value="rich-text">Rich Text Editor</option>
          </select>
          
          <button
            onClick={refreshPreview}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            title="Refresh Preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor Tabs */}
          <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center">
            <div className="flex items-center space-x-1 px-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`px-3 py-2 text-sm cursor-pointer border-r border-gray-200 dark:border-gray-700 flex items-center space-x-2 ${
                    selectedFile === file.id 
                      ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedFile(file.id)}
                >
                  <span className={getFileColor(file)}>{file.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 flex">
            {/* Code Editor */}
            <div className="flex-1">
              {selectedFileData && (
                <CodePlaygroundEditor
                  title={selectedFileData.name}
                  value={selectedFileData.content || ''}
                  onChange={(content) => updateFileContent(selectedFileData.id, content)}
                  language={selectedFileData.language || 'html'}
                  theme={editorTheme}
                  editorType={editorType}
                />
              )}
            </div>

            {/* Preview Panel */}
            {isPreviewOpen && (
              <div className="w-1/2 border-l border-gray-200 dark:border-gray-700 flex flex-col">
                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>PREVIEW</span>
                    {isPreviewLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  </h3>
                </div>
                <div className="flex-1 bg-white relative">
                  {isPreviewLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                        <span className="text-gray-600">Updating preview...</span>
                      </div>
                    </div>
                  )}
                  <iframe
                    srcDoc={output}
                    className="w-full h-full border-0"
                    title="Code Playground Output"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 