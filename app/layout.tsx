import "./globals.css";
import { Inter } from "next/font/google";
import { Navbar } from "./components/navbar";
import { ThemeProvider } from "./components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DevTools",
  description: "A collection of developer tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors`}>
        <ThemeProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
