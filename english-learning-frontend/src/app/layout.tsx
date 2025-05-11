// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Hoặc font bạn chọn
import "./globals.css"; // Import file CSS global (chứa Tailwind directives)
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learn Vocabulary",
  description: "Learn English vocabulary effectively",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <ThemeProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {children}
            <ThemeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
