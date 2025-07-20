"use client";

import { useState, useRef } from 'react';
import { Expand, Minimize, Download, Trash2, RotateCcw, Type, Square, Circle, Triangle, MousePointer, Move, ArrowRight, ArrowUpRight, ArrowUp, ArrowUpLeft, ArrowLeft, ArrowDownLeft, ArrowDown, ArrowDownRight, PenTool, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../theme-provider';

interface DiagramElement {
  id: string;
  type: 'rectangle' | 'circle' | 'triangle' | 'text' | 'line' | 'arrow' | 'double-arrow' | 'curved-line' | 'freehand';
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  color: string;
  strokeWidth: number;
  points?: { x: number; y: number }[];
  direction?: 'right' | 'up-right' | 'up' | 'up-left' | 'left' | 'down-left' | 'down' | 'down-right';
}

interface DiagramState {
  elements: DiagramElement[];
  selectedElement: string | null;
  selectedElements: string[];
  isFullScreen: boolean;
  zoom: number;
  panX: number;
  panY: number;
  isSelecting: boolean;
  selectionBox: { x: number; y: number; width: number; height: number } | null;
  sidebarCollapsed: boolean;
}

export function DiagramPage() {
  const { theme } = useTheme();
  const [diagramState, setDiagramState] = useState<DiagramState>({
    elements: [],
    selectedElement: null,
    selectedElements: [],
    isFullScreen: false,
    zoom: 1,
    panX: 0,
    panY: 0,
    isSelecting: false,
    selectionBox: null,
    sidebarCollapsed: false
  });
  
  const [currentTool, setCurrentTool] = useState<'select' | 'move' | 'rectangle' | 'circle' | 'triangle' | 'text' | 'line' | 'arrow' | 'double-arrow' | 'curved-line' | 'freehand'>('select');
  const [currentColor, setCurrentColor] = useState('#3b82f6');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [freehandPoints, setFreehandPoints] = useState<{ x: number; y: number }[]>([]);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];

  const arrowDirections = [
    { key: 'right', icon: <ArrowRight className="w-4 h-4" />, label: 'Right' },
    { key: 'up-right', icon: <ArrowUpRight className="w-4 h-4" />, label: 'Up-Right' },
    { key: 'up', icon: <ArrowUp className="w-4 h-4" />, label: 'Up' },
    { key: 'up-left', icon: <ArrowUpLeft className="w-4 h-4" />, label: 'Up-Left' },
    { key: 'left', icon: <ArrowLeft className="w-4 h-4" />, label: 'Left' },
    { key: 'down-left', icon: <ArrowDownLeft className="w-4 h-4" />, label: 'Down-Left' },
    { key: 'down', icon: <ArrowDown className="w-4 h-4" />, label: 'Down' },
    { key: 'down-right', icon: <ArrowDownRight className="w-4 h-4" />, label: 'Down-Right' }
  ];

  const [currentArrowDirection, setCurrentArrowDirection] = useState('right');

  const deleteElement = (id: string) => {
    setDiagramState(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== id),
      selectedElement: prev.selectedElement === id ? null : prev.selectedElement,
      selectedElements: prev.selectedElements.filter(elId => elId !== id)
    }));
  };

  const deleteSelectedElements = () => {
    setDiagramState(prev => ({
      ...prev,
      elements: prev.elements.filter(el => !prev.selectedElements.includes(el.id)),
      selectedElement: null,
      selectedElements: []
    }));
  };

  const toggleSidebar = () => {
    setDiagramState(prev => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed
    }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - diagramState.panX) / diagramState.zoom;
    const y = (e.clientY - rect.top - diagramState.panY) / diagramState.zoom;
    
    if (currentTool === 'select') {
      // Check if clicking on an element
      const clickedElement = diagramState.elements.find(el => 
        x >= el.x && x <= el.x + el.width &&
        y >= el.y && y <= el.y + el.height
      );
      
      if (clickedElement) {
        if (e.shiftKey) {
          // Multi-select
          setDiagramState(prev => ({
            ...prev,
            selectedElement: clickedElement.id,
            selectedElements: prev.selectedElements.includes(clickedElement.id)
              ? prev.selectedElements.filter(id => id !== clickedElement.id)
              : [...prev.selectedElements, clickedElement.id]
          }));
        } else {
          // Single select
          setDiagramState(prev => ({
            ...prev,
            selectedElement: clickedElement.id,
            selectedElements: [clickedElement.id]
          }));
          setIsDragging(true);
          setDragOffset({ x: x - clickedElement.x, y: y - clickedElement.y });
        }
      } else {
        // Start selection box
        setDiagramState(prev => ({
          ...prev,
          selectedElement: null,
          selectedElements: [],
          isSelecting: true,
          selectionBox: { x, y, width: 0, height: 0 }
        }));
        setDrawStart({ x, y });
      }
    } else if (currentTool === 'move') {
      // Move tool - start panning
      setIsDragging(true);
      setDrawStart({ x: e.clientX, y: e.clientY });
    } else if (currentTool === 'freehand') {
      // Start freehand drawing
      setIsDrawing(true);
      setFreehandPoints([{ x, y }]);
    } else {
      // Drawing tools
      setIsDrawing(true);
      setDrawStart({ x, y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - diagramState.panX) / diagramState.zoom;
    const y = (e.clientY - rect.top - diagramState.panY) / diagramState.zoom;
    
    if (currentTool === 'move' && isDragging) {
      // Pan the canvas
      const deltaX = e.clientX - drawStart.x;
      const deltaY = e.clientY - drawStart.y;
      setDiagramState(prev => ({
        ...prev,
        panX: prev.panX + deltaX,
        panY: prev.panY + deltaY
      }));
      setDrawStart({ x: e.clientX, y: e.clientY });
    } else if (currentTool === 'select' && isDragging && diagramState.selectedElement) {
      // Move selected element
      const element = diagramState.elements.find(el => el.id === diagramState.selectedElement);
      if (element) {
        const newX = x - dragOffset.x;
        const newY = y - dragOffset.y;
        setDiagramState(prev => ({
          ...prev,
          elements: prev.elements.map(el => 
            el.id === diagramState.selectedElement 
              ? { ...el, x: newX, y: newY }
              : el
          )
        }));
      }
    } else if (currentTool === 'select' && diagramState.isSelecting) {
      // Update selection box
      const width = Math.abs(x - drawStart.x);
      const height = Math.abs(y - drawStart.y);
      const startX = Math.min(x, drawStart.x);
      const startY = Math.min(y, drawStart.y);
      
      setDiagramState(prev => ({
        ...prev,
        selectionBox: { x: startX, y: startY, width, height }
      }));
    } else if (currentTool === 'freehand' && isDrawing) {
      // Add point to freehand drawing
      setFreehandPoints(prev => [...prev, { x, y }]);
    } else if (isDrawing && currentTool !== 'select' && currentTool !== 'move' && currentTool !== 'freehand') {
      // Drawing preview
      const width = Math.abs(x - drawStart.x);
      const height = Math.abs(y - drawStart.y);
      const startX = Math.min(x, drawStart.x);
      const startY = Math.min(y, drawStart.y);
      
      setDiagramState(prev => ({
        ...prev,
        elements: [...prev.elements.filter(el => el.id !== 'preview'), {
          id: 'preview',
          type: currentTool as DiagramElement['type'],
          x: startX,
          y: startY,
          width,
          height,
          color: currentColor,
          strokeWidth,
          direction: currentTool === 'arrow' || currentTool === 'double-arrow' ? currentArrowDirection as DiagramElement['direction'] : undefined
        }]
      }));
    }
  };

  const handleMouseUp = () => {
    if (currentTool === 'select' && diagramState.isSelecting) {
      // Finalize selection box
      const selectedElements = diagramState.elements.filter(el => {
        if (!diagramState.selectionBox) return false;
        const { x, y, width, height } = diagramState.selectionBox;
        return (
          el.x >= x && el.x <= x + width &&
          el.y >= y && el.y <= y + height &&
          el.x + el.width >= x && el.x + el.width <= x + width &&
          el.y + el.height >= y && el.y + el.height <= y + height
        );
      });
      
      setDiagramState(prev => ({
        ...prev,
        isSelecting: false,
        selectionBox: null,
        selectedElements: selectedElements.map(el => el.id),
        selectedElement: selectedElements.length === 1 ? selectedElements[0].id : null
      }));
    } else if (currentTool === 'freehand' && isDrawing) {
      // Finalize freehand drawing
      setIsDrawing(false);
      
      if (freehandPoints.length > 1) {
        setDiagramState(prev => {
          const newElement: DiagramElement = {
            id: Date.now().toString(),
            type: 'freehand',
            x: Math.min(...freehandPoints.map(p => p.x)),
            y: Math.min(...freehandPoints.map(p => p.y)),
            width: Math.max(...freehandPoints.map(p => p.x)) - Math.min(...freehandPoints.map(p => p.x)),
            height: Math.max(...freehandPoints.map(p => p.y)) - Math.min(...freehandPoints.map(p => p.y)),
            color: currentColor,
            strokeWidth,
            points: freehandPoints
          };
          
          return {
            ...prev,
            elements: [...prev.elements.filter(el => el.id !== 'preview'), newElement],
            selectedElement: newElement.id,
            selectedElements: [newElement.id]
          };
        });
      }
      setFreehandPoints([]);
    } else if (isDrawing) {
      // Finalize drawing
      setIsDrawing(false);
      
      setDiagramState(prev => {
        const previewElement = prev.elements.find(el => el.id === 'preview');
        if (!previewElement) return prev;
        
        const newElement: DiagramElement = {
          ...previewElement,
          id: Date.now().toString(),
          text: currentTool === 'text' ? 'Text' : undefined
        };
        
        return {
          ...prev,
          elements: [...prev.elements.filter(el => el.id !== 'preview'), newElement],
          selectedElement: newElement.id,
          selectedElements: [newElement.id]
        };
      });
    }
    
    setIsDragging(false);
  };

  const toggleFullScreen = () => {
    setDiagramState(prev => ({
      ...prev,
      isFullScreen: !prev.isFullScreen
    }));
  };

  const resetCanvas = () => {
    setDiagramState(prev => ({
      ...prev,
      elements: [],
      selectedElement: null,
      selectedElements: [],
      panX: 0,
      panY: 0,
      zoom: 1
    }));
  };

  const exportDiagram = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 1920;
    canvas.height = 1080;
    
    // Draw background
    ctx.fillStyle = theme === 'dark' ? '#1f2937' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw elements
    diagramState.elements.forEach(element => {
      ctx.strokeStyle = element.color;
      ctx.lineWidth = element.strokeWidth;
      ctx.fillStyle = element.color + '20';
      
      switch (element.type) {
        case 'rectangle':
          ctx.fillRect(element.x, element.y, element.width, element.height);
          ctx.strokeRect(element.x, element.y, element.width, element.height);
          break;
        case 'circle':
          ctx.beginPath();
          ctx.arc(element.x + element.width/2, element.y + element.height/2, Math.min(element.width, element.height)/2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(element.x + element.width/2, element.y);
          ctx.lineTo(element.x, element.y + element.height);
          ctx.lineTo(element.x + element.width, element.y + element.height);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        case 'text':
          if (element.text) {
            ctx.fillStyle = element.color;
            ctx.font = '16px Arial';
            ctx.fillText(element.text, element.x, element.y + 16);
          }
          break;
        case 'line':
          ctx.beginPath();
          ctx.moveTo(element.x, element.y);
          ctx.lineTo(element.x + element.width, element.y + element.height);
          ctx.stroke();
          break;
        case 'arrow':
        case 'double-arrow':
          ctx.beginPath();
          ctx.moveTo(element.x, element.y);
          ctx.lineTo(element.x + element.width, element.y + element.height);
          ctx.stroke();
          // Draw arrowhead
          const angle = Math.atan2(element.height, element.width);
          const arrowLength = 20;
          ctx.beginPath();
          ctx.moveTo(element.x + element.width, element.y + element.height);
          ctx.lineTo(
            element.x + element.width - arrowLength * Math.cos(angle - Math.PI / 6),
            element.y + element.height - arrowLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(element.x + element.width, element.y + element.height);
          ctx.lineTo(
            element.x + element.width - arrowLength * Math.cos(angle + Math.PI / 6),
            element.y + element.height - arrowLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
          break;
        case 'freehand':
          if (element.points && element.points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(element.points[0].x, element.points[0].y);
            for (let i = 1; i < element.points.length; i++) {
              ctx.lineTo(element.points[i].x, element.points[i].y);
            }
            ctx.stroke();
          }
          break;
      }
    });
    
    // Download
    const link = document.createElement('a');
    link.download = 'diagram.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const renderElement = (element: DiagramElement) => {
    const isSelected = diagramState.selectedElements.includes(element.id);
    const isPrimarySelected = diagramState.selectedElement === element.id;
    const selectedStyle = isSelected ? 'ring-2 ring-blue-500' : '';
    const primarySelectedStyle = isPrimarySelected ? 'ring-2 ring-yellow-500' : '';
    
    const baseStyle = `absolute ${selectedStyle} ${primarySelectedStyle}`;
    
    switch (element.type) {
      case 'rectangle':
        return (
          <div
            key={element.id}
            className={`${baseStyle} border-2`}
            style={{
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              borderColor: element.color,
              backgroundColor: element.color + '20',
              borderWidth: element.strokeWidth
            }}
            onClick={() => setDiagramState(prev => ({ 
              ...prev, 
              selectedElement: element.id,
              selectedElements: [element.id]
            }))}
          />
        );
      case 'circle':
        return (
          <div
            key={element.id}
            className={`${baseStyle} rounded-full border-2`}
            style={{
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              borderColor: element.color,
              backgroundColor: element.color + '20',
              borderWidth: element.strokeWidth
            }}
            onClick={() => setDiagramState(prev => ({ 
              ...prev, 
              selectedElement: element.id,
              selectedElements: [element.id]
            }))}
          />
        );
      case 'triangle':
        return (
          <div
            key={element.id}
            className={`${baseStyle}`}
            style={{
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height
            }}
            onClick={() => setDiagramState(prev => ({ 
              ...prev, 
              selectedElement: element.id,
              selectedElements: [element.id]
            }))}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <polygon
                points="50,10 10,90 90,90"
                fill={element.color + '20'}
                stroke={element.color}
                strokeWidth={element.strokeWidth}
              />
            </svg>
          </div>
        );
      case 'text':
        return (
          <div
            key={element.id}
            className={`${baseStyle} cursor-text`}
            style={{
              left: element.x,
              top: element.y,
              color: element.color,
              fontSize: '16px',
              fontWeight: 'bold'
            }}
            onClick={() => setDiagramState(prev => ({ 
              ...prev, 
              selectedElement: element.id,
              selectedElements: [element.id]
            }))}
          >
            {element.text || 'Text'}
          </div>
        );
      case 'line':
        return (
          <svg
            key={element.id}
            className={`${baseStyle}`}
            style={{
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              position: 'absolute',
              pointerEvents: 'none'
            }}
            onClick={() => setDiagramState(prev => ({ 
              ...prev, 
              selectedElement: element.id,
              selectedElements: [element.id]
            }))}
          >
            <line
              x1={element.x}
              y1={element.y}
              x2={element.x + element.width}
              y2={element.y + element.height}
              stroke={element.color}
              strokeWidth={element.strokeWidth}
            />
          </svg>
        );
      case 'arrow':
      case 'double-arrow':
        return (
          <svg
            key={element.id}
            className={`${baseStyle}`}
            style={{
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              position: 'absolute',
              pointerEvents: 'none'
            }}
            onClick={() => setDiagramState(prev => ({ 
              ...prev, 
              selectedElement: element.id,
              selectedElements: [element.id]
            }))}
          >
            <defs>
              <marker
                id={`arrowhead-${element.id}`}
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill={element.color}
                />
              </marker>
            </defs>
            <line
              x1={element.x}
              y1={element.y}
              x2={element.x + element.width}
              y2={element.y + element.height}
              stroke={element.color}
              strokeWidth={element.strokeWidth}
              markerEnd={`url(#arrowhead-${element.id})`}
            />
            {element.type === 'double-arrow' && (
              <line
                x1={element.x + element.width}
                y1={element.y + element.height}
                x2={element.x}
                y2={element.y}
                stroke={element.color}
                strokeWidth={element.strokeWidth}
                markerEnd={`url(#arrowhead-${element.id}-reverse)`}
              />
            )}
          </svg>
        );
      case 'freehand':
        return (
          <svg
            key={element.id}
            className={`${baseStyle}`}
            style={{
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              position: 'absolute',
              pointerEvents: 'none'
            }}
            onClick={() => setDiagramState(prev => ({ 
              ...prev, 
              selectedElement: element.id,
              selectedElements: [element.id]
            }))}
          >
            {element.points && element.points.length > 1 && (
              <path
                d={`M ${element.points.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                stroke={element.color}
                strokeWidth={element.strokeWidth}
                fill="none"
              />
            )}
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`h-screen flex bg-white dark:bg-gray-900 ${diagramState.isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Left Sidebar */}
      <div className={`bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${diagramState.sidebarCollapsed ? 'w-12' : 'w-64'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-semibold text-gray-900 dark:text-white ${diagramState.sidebarCollapsed ? 'hidden' : 'block'}`}>
              Tools
            </h2>
            <button
              onClick={toggleSidebar}
              className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
            >
              {diagramState.sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {!diagramState.sidebarCollapsed && (
            <>
              {/* Selection Tools */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selection</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCurrentTool('select')}
                    className={`p-2 rounded text-xs ${currentTool === 'select' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    title="Select"
                  >
                    <MousePointer className="w-4 h-4 mx-auto mb-1" />
                    Select
                  </button>
                  <button
                    onClick={() => setCurrentTool('move')}
                    className={`p-2 rounded text-xs ${currentTool === 'move' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    title="Move Canvas"
                  >
                    <Move className="w-4 h-4 mx-auto mb-1" />
                    Move
                  </button>
                </div>
              </div>

              {/* Shapes */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shapes</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCurrentTool('rectangle')}
                    className={`p-2 rounded text-xs ${currentTool === 'rectangle' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    title="Rectangle"
                  >
                    <Square className="w-4 h-4 mx-auto mb-1" />
                    Rectangle
                  </button>
                  <button
                    onClick={() => setCurrentTool('circle')}
                    className={`p-2 rounded text-xs ${currentTool === 'circle' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    title="Circle"
                  >
                    <Circle className="w-4 h-4 mx-auto mb-1" />
                    Circle
                  </button>
                  <button
                    onClick={() => setCurrentTool('triangle')}
                    className={`p-2 rounded text-xs ${currentTool === 'triangle' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    title="Triangle"
                  >
                    <Triangle className="w-4 h-4 mx-auto mb-1" />
                    Triangle
                  </button>
                  <button
                    onClick={() => setCurrentTool('text')}
                    className={`p-2 rounded text-xs ${currentTool === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    title="Text"
                  >
                    <Type className="w-4 h-4 mx-auto mb-1" />
                    Text
                  </button>
                </div>
              </div>

              {/* Lines & Arrows */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lines & Arrows</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCurrentTool('line')}
                    className={`p-2 rounded text-xs ${currentTool === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    title="Line"
                  >
                    <Minus className="w-4 h-4 mx-auto mb-1" />
                    Line
                  </button>
                  <button
                    onClick={() => setCurrentTool('arrow')}
                    className={`p-2 rounded text-xs ${currentTool === 'arrow' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    title="Arrow"
                  >
                    <ArrowRight className="w-4 h-4 mx-auto mb-1" />
                    Arrow
                  </button>
                  <button
                    onClick={() => setCurrentTool('double-arrow')}
                    className={`p-2 rounded text-xs ${currentTool === 'double-arrow' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    title="Double Arrow"
                  >
                    <ArrowRight className="w-4 h-4 mx-auto mb-1" />
                    <ArrowLeft className="w-4 h-4 mx-auto mb-1" />
                    Double
                  </button>
                  <button
                    onClick={() => setCurrentTool('freehand')}
                    className={`p-2 rounded text-xs ${currentTool === 'freehand' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    title="Freehand"
                  >
                    <PenTool className="w-4 h-4 mx-auto mb-1" />
                    Freehand
                  </button>
                </div>
              </div>

              {/* Arrow Direction */}
              {(currentTool === 'arrow' || currentTool === 'double-arrow') && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Arrow Direction</h3>
                  <div className="grid grid-cols-4 gap-1">
                    {arrowDirections.map(({ key, icon, label }) => (
                      <button
                        key={key}
                        onClick={() => setCurrentArrowDirection(key)}
                        className={`p-1 rounded text-xs ${currentArrowDirection === key ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                        title={label}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Colors</h3>
                <div className="grid grid-cols-4 gap-1">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setCurrentColor(color)}
                      className={`w-8 h-8 rounded border-2 ${currentColor === color ? 'border-gray-900 dark:border-white' : 'border-gray-300 dark:border-gray-600'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Stroke Width */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stroke Width</h3>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300">{strokeWidth}px</span>
              </div>
            </>
          )}

          {/* Collapsed Sidebar Icons */}
          {diagramState.sidebarCollapsed && (
            <div className="space-y-2">
              <button
                onClick={() => setCurrentTool('select')}
                className={`p-2 rounded ${currentTool === 'select' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400'}`}
                title="Select"
              >
                <MousePointer className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentTool('rectangle')}
                className={`p-2 rounded ${currentTool === 'rectangle' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400'}`}
                title="Rectangle"
              >
                <Square className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentTool('circle')}
                className={`p-2 rounded ${currentTool === 'circle' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400'}`}
                title="Circle"
              >
                <Circle className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentTool('arrow')}
                className={`p-2 rounded ${currentTool === 'arrow' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400'}`}
                title="Arrow"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentTool('freehand')}
                className={`p-2 rounded ${currentTool === 'freehand' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400'}`}
                title="Freehand"
              >
                <PenTool className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Diagram Creator</h1>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={resetCanvas}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              title="Reset Canvas"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={exportDiagram}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              title="Export Diagram"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullScreen}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              title={diagramState.isFullScreen ? "Exit Full Screen" : "Full Screen"}
            >
              {diagramState.isFullScreen ? <Minimize className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div 
          ref={containerRef}
          className="flex-1 relative overflow-hidden bg-gray-50 dark:bg-gray-800"
        >
          <div
            ref={canvasRef}
            className={`absolute inset-0 ${currentTool === 'select' ? 'cursor-crosshair' : currentTool === 'move' ? 'cursor-grab' : currentTool === 'freehand' ? 'cursor-crosshair' : 'cursor-crosshair'}`}
            style={{
              transform: `scale(${diagramState.zoom}) translate(${diagramState.panX}px, ${diagramState.panY}px)`,
              transformOrigin: '0 0'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Grid */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            {/* Selection Box */}
            {diagramState.selectionBox && (
              <div
                className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20"
                style={{
                  left: diagramState.selectionBox.x,
                  top: diagramState.selectionBox.y,
                  width: diagramState.selectionBox.width,
                  height: diagramState.selectionBox.height
                }}
              />
            )}
            
            {/* Elements */}
            {diagramState.elements.map(renderElement)}
          </div>
          
          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
            <button
              onClick={() => setDiagramState(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.2, 3) }))}
              className="p-2 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700"
            >
              +
            </button>
            <button
              onClick={() => setDiagramState(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.2, 0.1) }))}
              className="p-2 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700"
            >
              -
            </button>
          </div>
        </div>

        {/* Properties Panel */}
        {(diagramState.selectedElement || diagramState.selectedElements.length > 0) && (
          <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Properties {diagramState.selectedElements.length > 1 && `(${diagramState.selectedElements.length} selected)`}
            </h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => diagramState.selectedElements.length > 1 ? deleteSelectedElements() : deleteElement(diagramState.selectedElement!)}
                className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                title="Delete Element(s)"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {diagramState.selectedElements.length === 1 
                  ? `Selected: ${diagramState.elements.find(el => el.id === diagramState.selectedElement)?.type}`
                  : `${diagramState.selectedElements.length} elements selected`
                }
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 