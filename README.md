# Dev Tools - Comprehensive Development Utilities

A modern, feature-rich collection of development tools built with Next.js, React, and TypeScript. Perfect for developers who need quick access to common utilities and tools.

## 🚀 Features

### **Text & Data Tools**
- **List to String Converter**: Convert lists to formatted strings with custom separators
- **String to List Converter**: Convert strings to lists with custom delimiters
- **JSON Beautifier**: Format and beautify JSON with syntax highlighting
- **JSON Compare**: Compare and diff JSON objects with visual highlighting
- **CSV Viewer & Query**: View, edit, and query CSV data with SQL-like syntax
- **SQL Beautifier & Flow**: Format SQL queries and analyze execution flow

### **Code & Development Tools**
- **Code Playground**: Write HTML, CSS, and JavaScript with real-time preview
- **API Tester**: Test APIs with all HTTP methods, headers, and body types
- **Diagram Creator**: Create diagrams and flowcharts with drawing tools

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Code Editor**: Monaco Editor
- **JSON Viewer**: React JSON Tree
- **Theme**: Dark/Light mode support
- **UI**: Responsive design with modern components

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd dev-tools

# Install dependencies
npm install

# Run the development server
npm run dev
```

## 🎯 Usage

### **List to String Converter**
Convert arrays or lists into formatted strings with custom separators.

### **String to List Converter**
Split strings into arrays using custom delimiters and separators.

### **JSON Beautifier**
Format and beautify JSON data with syntax highlighting and validation.

### **JSON Compare**
Compare two JSON objects and highlight differences with visual indicators.

### **CSV Viewer & Query**
- Upload and view CSV files
- Execute SQL-like queries on CSV data
- Filter, sort, and search data
- Export results

### **SQL Beautifier**
Format SQL queries with proper indentation and syntax highlighting.

### **Code Playground**
- Real-time HTML, CSS, and JavaScript editing
- Live preview with iframe sandboxing
- File-based organization (index.html, styles.css, script.js)
- Full screen mode support
- Dark/light theme support

### **API Tester**
- **HTTP Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Body Types**: JSON, URL-encoded form, raw text, file upload
- **Headers Management**: Add, edit, and remove request headers
- **Response Viewer**: Beautified JSON response with react-json-tree
- **File Upload**: Support for images and files
- **Theme Support**: Light/dark mode for response viewer
- **Export**: Save and load API requests

### **Diagram Creator**
- **Drawing Tools**: Rectangle, Circle, Triangle, Text, Lines, Arrows
- **Arrow Types**: Single arrows, double arrows with 8 direction options
- **Freehand Drawing**: Pen tool for freehand sketches
- **Selection Tools**: Select, multi-select, and move elements
- **Collapsible Sidebar**: Organized tools with expandable interface
- **Color Palette**: 8 different colors with stroke width control
- **Export**: Save diagrams as high-resolution PNG images
- **Full Screen**: Toggle full screen mode for immersive drawing
- **Zoom Controls**: Zoom in/out with smooth scaling
- **Grid Background**: Visual grid for better alignment
- **Theme Support**: Light/dark mode for all elements

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Automatic theme switching with system preference
- **Modern Interface**: Clean, professional design with smooth animations
- **Keyboard Shortcuts**: Efficient navigation and tool switching
- **Accessibility**: Screen reader support and keyboard navigation

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📁 Project Structure

```
dev-tools/
├── app/
│   ├── components/
│   │   ├── tool-pages/          # Individual tool components
│   │   ├── navbar.tsx           # Navigation component
│   │   └── theme-provider.tsx   # Theme context
│   ├── tools/                   # Tool route pages
│   │   ├── list-to-string/
│   │   ├── string-to-list/
│   │   ├── json-beautify/
│   │   ├── json-compare/
│   │   ├── csv-viewer/
│   │   ├── sql-beautify/
│   │   ├── code-playground/
│   │   ├── api-tester/
│   │   └── diagram/
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── public/                      # Static assets
└── package.json
```

## 🎯 Key Features by Tool

### **Code Playground**
- Monaco Editor integration for professional code editing
- Real-time preview with iframe sandboxing
- File-based organization (HTML, CSS, JS)
- Full screen mode for immersive coding
- Theme support for both editor and preview

### **API Tester**
- Comprehensive HTTP method support
- Multiple body type formats
- File upload capabilities
- Beautified JSON response viewer
- Request/response history
- Header management interface

### **Diagram Creator**
- Professional drawing tools with SVG rendering
- Advanced selection and manipulation
- Collapsible sidebar with organized tools
- Arrow tools with multiple directions
- Freehand drawing with pen tool
- Export to high-resolution images
- Zoom and pan controls

## 🔧 Configuration

The project uses standard Next.js configuration with:
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- PostCSS for CSS processing

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, React, and TypeScript**
