// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Hoặc font bạn chọn
import "./globals.css"; // Import file CSS global (chứa Tailwind directives)
import { ThemeProvider } from "@/components/ThemeProvider"; // <<<--- Import ThemeProvider
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "English Learning App",
  description: "Ứng dụng học tiếng Anh đơn giản",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      {/* Đổi bg-gray-100 thành bg-slate-100 */}
      <body
        className={`${inter.className} bg-slate-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen`}
      >
        <ThemeProvider>
          <div className="fixed top-4 right-4 z-50">
            <ThemeSwitcher />
          </div>
          <main className="pt-16 pb-8">
            {" "}
            {/* Thêm pb-8 */}
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
