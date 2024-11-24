import "./globals.css";
import { Inter } from "next/font/google";
import { Navbar } from "./components/navbar";

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
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
