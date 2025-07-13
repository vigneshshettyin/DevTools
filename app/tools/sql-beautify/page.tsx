import { Metadata } from "next";
import { SqlBeautifyPage } from "../../components/tool-pages/sql-beautify-page";

export const metadata: Metadata = {
  title: "SQL Beautify & Flow Analyzer - DevTools",
  description: "Format SQL queries and analyze execution flow. Free online tool for developers to beautify SQL and understand query performance.",
  keywords: "sql beautify, sql formatter, sql flow analyzer, query optimizer, developer tools",
  openGraph: {
    title: "SQL Beautify & Flow Analyzer - DevTools",
    description: "Format SQL queries and analyze execution flow",
    type: "website",
  },
};

export default function Page() {
  return <SqlBeautifyPage />;
} 