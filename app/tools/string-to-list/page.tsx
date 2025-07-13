import { Metadata } from "next";
import { StringToListPage } from "../../components/tool-pages/string-to-list-page";

export const metadata: Metadata = {
  title: "String to List Converter - DevTools",
  description: "Convert strings to lists with custom delimiters. Free online tool for developers to parse and split strings into arrays.",
  keywords: "string to list, string splitter, delimiter parser, array converter, developer tools",
  openGraph: {
    title: "String to List Converter - DevTools",
    description: "Convert strings to lists with custom delimiters",
    type: "website",
  },
};

export default function Page() {
  return <StringToListPage />;
} 