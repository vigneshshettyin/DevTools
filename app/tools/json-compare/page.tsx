import { Metadata } from "next";
import { JsonComparePage } from "../../components/tool-pages/json-compare-page";

export const metadata: Metadata = {
  title: "JSON Compare & Diff Tool - DevTools",
  description: "Compare and diff JSON objects with visual highlighting. Free online tool for developers to analyze JSON differences and similarities.",
  keywords: "json compare, json diff, json comparison tool, json analyzer, developer tools",
  openGraph: {
    title: "JSON Compare & Diff Tool - DevTools",
    description: "Compare and diff JSON objects with visual highlighting",
    type: "website",
  },
};

export default function Page() {
  return <JsonComparePage />;
} 