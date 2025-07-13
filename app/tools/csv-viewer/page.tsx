import { Metadata } from "next";
import { CsvViewerPage } from "../../components/tool-pages/csv-viewer-page";

export const metadata: Metadata = {
  title: "CSV Viewer & Query Tool - DevTools",
  description: "View, edit, and query CSV data with SQL-like syntax. Free online tool for developers to analyze and manipulate CSV files.",
  keywords: "csv viewer, csv editor, csv query tool, sql csv, data analysis, developer tools",
  openGraph: {
    title: "CSV Viewer & Query Tool - DevTools",
    description: "View, edit, and query CSV data with SQL-like syntax",
    type: "website",
  },
};

export default function Page() {
  return <CsvViewerPage />;
} 