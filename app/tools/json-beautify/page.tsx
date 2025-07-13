import { Metadata } from "next";
import { JsonBeautifyPage } from "../../components/tool-pages/json-beautify-page";

export const metadata: Metadata = {
  title: "JSON Beautify & Formatter - DevTools",
  description: "Format and beautify JSON with syntax highlighting. Free online tool for developers to format, validate, and prettify JSON data.",
  keywords: "json beautify, json formatter, json prettifier, json validator, developer tools",
  openGraph: {
    title: "JSON Beautify & Formatter - DevTools",
    description: "Format and beautify JSON with syntax highlighting",
    type: "website",
  },
};

export default function Page() {
  return <JsonBeautifyPage />;
} 