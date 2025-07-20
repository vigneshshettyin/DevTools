"use client";

import { useState, useRef } from 'react';
import { Send, Clock, Code, FileText, Globe, Database, Copy, Download, Eye, EyeOff, Upload, X } from 'lucide-react';
import { JSONTree } from 'react-json-tree';
import { useTheme } from '../theme-provider';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
type BodyType = 'json' | 'form' | 'urlencoded' | 'raw' | 'file';

interface Header {
  key: string;
  value: string;
}

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  time: number;
  size: number;
}

interface FileUpload {
  name: string;
  file: File;
}

const darkTheme = {
  base00: '#1e1e1e', // background
  base01: '#2d2d2d', // lighter background
  base02: '#3c3c3c', // selection background
  base03: '#4d4d4d', // comments, invisibles, line highlighting
  base04: '#6a6a6a', // dark foreground
  base05: '#cccccc', // default foreground
  base06: '#e6e6e6', // light foreground
  base07: '#ffffff', // light background
  base08: '#f2777a', // variables
  base09: '#f99157', // integers
  base0A: '#ffcc66', // classes
  base0B: '#99cc99', // strings
  base0C: '#66cccc', // support
  base0D: '#6699cc', // functions
  base0E: '#cc99cc', // keywords
  base0F: '#d27b53', // deprecated
};

const lightTheme = {
  base00: '#ffffff', // background
  base01: '#f5f5f5', // lighter background
  base02: '#e8e8e8', // selection background
  base03: '#d0d0d0', // comments, invisibles, line highlighting
  base04: '#a0a0a0', // dark foreground
  base05: '#333333', // default foreground
  base06: '#202020', // light foreground
  base07: '#000000', // light background
  base08: '#d73a49', // variables
  base09: '#f97583', // integers
  base0A: '#ffa657', // classes
  base0B: '#4ec9b0', // strings
  base0C: '#79b8ff', // support
  base0D: '#6f42c1', // functions
  base0E: '#d73a49', // keywords
  base0F: '#e36209', // deprecated
};

export function ApiTesterPage() {
  const { theme } = useTheme();
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts');
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [bodyType, setBodyType] = useState<BodyType>('json');
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Content-Type', value: 'application/json' }
  ]);
  const [body, setBody] = useState('{\n  "title": "Test Post",\n  "body": "This is a test post",\n  "userId": 1\n}');
  const [urlEncodedBody, setUrlEncodedBody] = useState('title=Test Post&body=This is a test post&userId=1');
  const [rawBody, setRawBody] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHeaders, setShowHeaders] = useState(true);
  const [showBody, setShowBody] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles = files.map(file => ({
      name: file.name,
      file: file
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const sendRequest = async () => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      // Prepare headers
      const headerObj: Record<string, string> = {};
      headers.forEach(header => {
        if (header.key.trim() && header.value.trim()) {
          headerObj[header.key.trim()] = header.value.trim();
        }
      });

      // Prepare request options
      const options: RequestInit = {
        method,
        headers: headerObj,
      };

      // Add body for non-GET requests
      if (method !== 'GET' && method !== 'OPTIONS') {
        if (bodyType === 'json') {
          try {
            const jsonBody = JSON.parse(body);
            options.body = JSON.stringify(jsonBody);
            if (!headerObj['Content-Type']) {
              headerObj['Content-Type'] = 'application/json';
            }
          } catch {
            alert('Invalid JSON in request body');
            setIsLoading(false);
            return;
          }
        } else if (bodyType === 'form') {
          const formData = new FormData();
          try {
            const formEntries = body.split('\n').filter(line => line.trim());
            formEntries.forEach(entry => {
              const [key, value] = entry.split('=').map(s => s.trim());
              if (key && value) {
                formData.append(key, value);
              }
            });
            options.body = formData;
            // Remove Content-Type for FormData (browser sets it automatically)
            delete headerObj['Content-Type'];
          } catch {
            alert('Invalid form data format. Use key=value format');
            setIsLoading(false);
            return;
          }
        } else if (bodyType === 'urlencoded') {
          options.body = urlEncodedBody;
          if (!headerObj['Content-Type']) {
            headerObj['Content-Type'] = 'application/x-www-form-urlencoded';
          }
        } else if (bodyType === 'file') {
          const formData = new FormData();
          uploadedFiles.forEach(fileUpload => {
            formData.append(fileUpload.name, fileUpload.file);
          });
          options.body = formData;
          // Remove Content-Type for FormData (browser sets it automatically)
          delete headerObj['Content-Type'];
        } else {
          // Raw body
          options.body = rawBody;
          if (!headerObj['Content-Type']) {
            headerObj['Content-Type'] = 'text/plain';
          }
        }
      }

      // Make the request
      const response = await fetch(url, options);
      const responseText = await response.text();
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      const endTime = Date.now();
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data: responseData,
        time: endTime - startTime,
        size: responseText.length
      });
    } catch (error) {
      setResponse({
        status: 0,
        statusText: 'Error',
        headers: {},
        data: { error: error instanceof Error ? error.message : 'Unknown error' },
        time: Date.now() - startTime,
        size: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
    }
  };

  const downloadResponse = () => {
    if (response) {
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'api-response.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-500';
    if (status >= 300 && status < 400) return 'text-yellow-500';
    if (status >= 400 && status < 500) return 'text-orange-500';
    if (status >= 500) return 'text-red-500';
    return 'text-gray-500';
  };

  const getBodyPlaceholder = () => {
    switch (bodyType) {
      case 'json':
        return 'Enter JSON body...';
      case 'form':
        return 'key1=value1\nkey2=value2';
      case 'urlencoded':
        return 'key1=value1&key2=value2';
      case 'raw':
        return 'Enter raw body content...';
      default:
        return '';
    }
  };

  const getBodyValue = () => {
    switch (bodyType) {
      case 'json':
        return body;
      case 'form':
        return body;
      case 'urlencoded':
        return urlEncodedBody;
      case 'raw':
        return rawBody;
      default:
        return '';
    }
  };

  const setBodyValue = (value: string) => {
    switch (bodyType) {
      case 'json':
        setBody(value);
        break;
      case 'form':
        setBody(value);
        break;
      case 'urlencoded':
        setUrlEncodedBody(value);
        break;
      case 'raw':
        setRawBody(value);
        break;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <Globe className="w-5 h-5" />
          <span>API Tester</span>
        </h1>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Request Panel */}
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* URL and Method */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2 mb-4">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as HttpMethod)}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-sm font-medium"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
                <option value="OPTIONS">OPTIONS</option>
              </select>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL..."
                className="flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-sm"
              />
              <button
                onClick={sendRequest}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white px-4 py-2 rounded flex items-center space-x-2 text-sm"
              >
                {isLoading ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Send</span>
              </button>
            </div>
          </div>

          {/* Headers */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Headers</span>
                </h3>
                <button
                  onClick={() => setShowHeaders(!showHeaders)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                >
                  {showHeaders ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {showHeaders && (
                <div className="space-y-2">
                  {headers.map((header, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={header.key}
                        onChange={(e) => updateHeader(index, 'key', e.target.value)}
                        placeholder="Header name"
                        className="flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm"
                      />
                      <input
                        type="text"
                        value={header.value}
                        onChange={(e) => updateHeader(index, 'value', e.target.value)}
                        placeholder="Header value"
                        className="flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm"
                      />
                      <button
                        onClick={() => removeHeader(index)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addHeader}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                  >
                    + Add Header
                  </button>
                </div>
              )}
            </div>

            {/* Body */}
            {method !== 'GET' && method !== 'OPTIONS' && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                    <Database className="w-4 h-4" />
                    <span>Body</span>
                  </h3>
                  <button
                    onClick={() => setShowBody(!showBody)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                  >
                    {showBody ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {showBody && (
                  <div className="space-y-3">
                    <div className="flex space-x-2 flex-wrap">
                      <button
                        onClick={() => setBodyType('json')}
                        className={`px-3 py-1 rounded text-sm ${
                          bodyType === 'json' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        JSON
                      </button>
                      <button
                        onClick={() => setBodyType('form')}
                        className={`px-3 py-1 rounded text-sm ${
                          bodyType === 'form' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Form Data
                      </button>
                      <button
                        onClick={() => setBodyType('urlencoded')}
                        className={`px-3 py-1 rounded text-sm ${
                          bodyType === 'urlencoded' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        URL Encoded
                      </button>
                      <button
                        onClick={() => setBodyType('raw')}
                        className={`px-3 py-1 rounded text-sm ${
                          bodyType === 'raw' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Raw
                      </button>
                      <button
                        onClick={() => setBodyType('file')}
                        className={`px-3 py-1 rounded text-sm ${
                          bodyType === 'file' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        File Upload
                      </button>
                    </div>
                    
                    {bodyType === 'file' ? (
                      <div className="space-y-3">
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center space-x-2 mx-auto text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Choose Files</span>
                          </button>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Drag and drop files here or click to browse</p>
                        </div>
                        
                        {uploadedFiles.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Files:</h4>
                            {uploadedFiles.map((fileUpload, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded">
                                <span className="text-sm text-gray-700 dark:text-gray-300">{fileUpload.name}</span>
                                <button
                                  onClick={() => removeFile(index)}
                                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <textarea
                        value={getBodyValue()}
                        onChange={(e) => setBodyValue(e.target.value)}
                        placeholder={getBodyPlaceholder()}
                        className="w-full h-32 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-sm font-mono resize-none"
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Response Panel */}
        <div className="w-1/2 flex flex-col">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
              <Code className="w-4 h-4" />
              <span>Response</span>
              {response && (
                <span className={`text-sm font-medium ${getStatusColor(response.status)}`}>
                  {response.status} {response.statusText}
                </span>
              )}
            </h3>
            {response && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{response.time}ms</span>
                <span>•</span>
                <span>{response.size} bytes</span>
                <button
                  onClick={copyResponse}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white p-1"
                  title="Copy response"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={downloadResponse}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white p-1"
                  title="Download response"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {!response ? (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Send a request to see the response here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Headers */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Response Headers</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 text-sm">
                    {Object.entries(response.headers).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1">
                        <span className="text-blue-600 dark:text-blue-400">{key}:</span>
                        <span className="text-gray-700 dark:text-gray-300">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Response Body</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded p-3">
                    {typeof response.data === 'object' ? (
                      <JSONTree 
                        data={response.data} 
                        theme={theme === 'dark' ? darkTheme : lightTheme}
                        hideRoot={false}
                      />
                    ) : (
                      <pre className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">{String(response.data)}</pre>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 