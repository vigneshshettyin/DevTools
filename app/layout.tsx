import "./globals.css";
import { Inter } from "next/font/google";
import { Navbar } from "./components/navbar";
import { ThemeProvider } from "./components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DevTools - Essential Developer Productivity Tools",
  description: "Free online developer tools for productivity. Convert lists to strings, compare JSON, beautify code, view CSV data, format SQL, and generate README files.",
  keywords: "developer tools, json compare, csv viewer, sql formatter, list converter, code beautifier",
  authors: [{ name: "DevTools" }],
  creator: "DevTools",
  publisher: "DevTools",
  robots: "index, follow",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tools.vshetty.dev",
    title: "DevTools - Essential Developer Productivity Tools",
    description: "Free online developer tools for productivity. Convert lists to strings, compare JSON, beautify code, view CSV data, format SQL, and generate README files.",
    siteName: "DevTools",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevTools - Essential Developer Productivity Tools",
    description: "Free online developer tools for productivity",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3B82F6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors`}>
        <ThemeProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
