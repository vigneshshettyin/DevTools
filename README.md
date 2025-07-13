# DevTools

A modern, all-in-one developer toolbox web app built with Next.js, React, and Tailwind CSS. Includes a suite of productivity tools for developers, data analysts, and power users.

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

---

## 🛠️ Tech Stack
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI:** [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **CSV Parsing:** [PapaParse](https://www.papaparse.com/)
- **Table:** Custom (was react-table, now simplified for type safety)
- **JSON Tree:** [react-json-tree](https://github.com/reduxjs/redux-devtools/tree/main/packages/react-json-tree)
- **SQL Formatting:** [sql-formatter](https://github.com/zeroturnaround/sql-formatter)

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
- Use the dropdown at the top to switch between tools.
- Dark/light mode toggle in the navbar.
- For CSV tool, you can download a sample file or upload your own.
- Query CSV data using SQL-like syntax, e.g.:
  - `SELECT * FROM data`
  - `SELECT name, age FROM data WHERE age > 25`
  - `SELECT * FROM data WHERE name LIKE 'John' LIMIT 5`

---

## 📁 Sample Data
- A sample CSV file is available at [`/public/sample-data.csv`](public/sample-data.csv) and can be downloaded from the CSV tool UI.

---

## ✨ Contributing
Pull requests and suggestions are welcome! Please open an issue or PR for improvements.

---

## 📜 License
MIT
