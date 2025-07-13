import { Metadata } from "next";
import { ListToStringPage } from "../../components/tool-pages/list-to-string-page";

export const metadata: Metadata = {
  title: "List to String Converter - DevTools",
  description: "Convert lists to formatted strings with custom separators. Free online tool for developers to transform arrays and lists into readable strings.",
  keywords: "list to string, array converter, string formatter, developer tools, list separator",
  openGraph: {
    title: "List to String Converter - DevTools",
    description: "Convert lists to formatted strings with custom separators",
    type: "website",
  },
};

export default function Page() {
  return <ListToStringPage />;
} 