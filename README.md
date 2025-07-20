# DevTools

A modern, all-in-one developer toolbox web app built with Next.js, React, and Tailwind CSS. Includes a comprehensive suite of productivity tools for developers, data analysts, and power users.

---

## 🚀 Features & Tools

### 1. **List to String**
- Convert a list of items (one per line) into a single delimited string.
- Supports custom delimiters and optional quoting (single/double).

### 2. **String to List**
- Convert a delimited string into a list (one item per line).
- Supports custom delimiters and removes quotes.

### 3. **JSON Compare**
- Compare two JSON objects side by side.
- Visual tree view with search and highlight.
- Shows missing fields and value differences.
- Supports both text and tree view modes.

### 4. **JSON Beautify**
- Beautify (pretty-print) or minify JSON.
- Tree view with search and highlight.
- Configurable indentation.
- Copy output to clipboard.

### 5. **CSV Viewer & Query Tool**
- Upload and view CSV files in a sortable, paginated table.
- SQL-like querying: `SELECT`, `WHERE` (with `=`, `>`, `<`, `>=`, `<=`, `LIKE`), and `LIMIT`.
- Download filtered/queried results as CSV.
- Download a sample CSV for testing.

### 6. **SQL Beautify & Flow Analyzer**
- Format and beautify SQL queries with proper indentation.
- Support for multiple SQL dialects (MySQL, PostgreSQL, SQLite, etc.).
- Analyze and display SQL execution flow step by step.
- Minify SQL queries for production use.
- Sample queries for common operations (SELECT, INSERT, UPDATE, DELETE, CREATE).

### 7. **Code Playground** 🆕
- Real-time HTML, CSS, and JavaScript editor with live preview.
- VS Code-like interface with file tabs and collapsible panels.
- Support for multiple file types (HTML, CSS, JavaScript).
- Monaco Editor integration with syntax highlighting.
- Rich text editor fallback option.
- Theme switching (Dark, Light, High Contrast).
- Copy and download code functionality.

### 8. **API Tester** 🆕
- Complete Postman-like API testing interface.
- Support for all HTTP methods: GET, POST, PUT, DELETE, PATCH, OPTIONS.
- Multiple request body types: JSON, Form Data, URL Encoded, Raw, File Upload.
- Custom headers management with add/remove functionality.
- Beautiful JSON response viewer with tree structure.
- Response metrics (time, size) and status code highlighting.
- Copy and download response functionality.
- File upload support with drag & drop interface.

---

## 🛠️ Tech Stack
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI:** [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **CSV Parsing:** [PapaParse](https://www.papaparse.com/)
- **Table:** Custom (was react-table, now simplified for type safety)
- **JSON Tree:** [react-json-tree](https://github.com/reduxjs/redux-devtools/tree/main/packages/react-json-tree)
- **SQL Formatting:** [sql-formatter](https://github.com/zeroturnaround/sql-formatter)
- **Code Editor:** [Monaco Editor](https://microsoft.github.io/monaco-editor/) (VS Code's editor)
- **Theme:** Dark/Light mode support with system preference detection

---

## 🎨 UI Features
- **Responsive Design:** Works seamlessly on desktop and mobile devices
- **Dark/Light Mode:** Automatic theme switching with manual toggle
- **Modern Interface:** Clean, shadcn-inspired design with smooth animations
- **Keyboard Navigation:** Full keyboard support for all tools
- **Accessibility:** WCAG compliant with proper ARIA labels and focus management

---

## 🖥️ Setup & Development

1. **Clone the repo:**
   ```bash
   git clone <repo-url>
   cd dev-tools
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. **Open in browser:**
   Visit [http://localhost:3000](http://localhost:3000)

---

## 📂 Usage

### **General Navigation**
- Use the dropdown at the top to switch between tools.
- Dark/light mode toggle in the navbar.
- All tools support keyboard shortcuts and accessibility features.

### **CSV Tool**
- Download a sample file or upload your own.
- Query CSV data using SQL-like syntax, e.g.:
  - `SELECT * FROM data`
  - `SELECT name, age FROM data WHERE age > 25`
  - `SELECT * FROM data WHERE name LIKE 'John' LIMIT 5`

### **Code Playground**
- Write HTML, CSS, and JavaScript with real-time preview.
- Switch between Monaco Editor and Rich Text Editor.
- Use theme controls to change editor appearance.
- Copy or download your code snippets.

### **API Tester**
- Test any API endpoint with full HTTP method support.
- Add custom headers and request bodies.
- Upload files for multipart requests.
- View formatted JSON responses with syntax highlighting.

---

## 📁 Sample Data
- A sample CSV file is available at [`/public/sample-data.csv`](public/sample-data.csv) and can be downloaded from the CSV tool UI.

---

## 🔧 Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## ✨ Contributing
Pull requests and suggestions are welcome! Please open an issue or PR for improvements.

### **Adding New Tools**
1. Create a new tool page in `app/tools/[tool-name]/page.tsx`
2. Add the tool component in `app/components/tool-pages/[tool-name]-page.tsx`
3. Update the navbar in `app/components/navbar.tsx`
4. Add the tool to the home page in `app/page.tsx`

---

## 📜 License
MIT

---

## 🚀 Recent Updates
- ✅ Added Code Playground with Monaco Editor integration
- ✅ Added API Tester with full HTTP method support
- ✅ Enhanced UI with shadcn-inspired design
- ✅ Added comprehensive light/dark mode support
- ✅ Improved accessibility and keyboard navigation
- ✅ Added file upload capabilities to API Tester
- ✅ Enhanced JSON response viewer with tree structure
