// src/components/ThemeSwitcher.tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

// SVG Icons (ví dụ)
const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591"
    />
  </svg>
);
const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
    />
  </svg>
);

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false); // State để kiểm tra component đã mount chưa
  const { theme, setTheme, resolvedTheme } = useTheme(); // Lấy theme hiện tại và hàm setTheme

  // useEffect chỉ chạy ở client-side sau khi component mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Nếu chưa mount xong, không render gì cả để tránh hydration mismatch
  if (!mounted) {
    return null;
  }

  // Xác định theme thực tế đang hiển thị (quan trọng nếu default là "system")
  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      aria-label={`Switch to ${
        currentTheme === "dark" ? "light" : "dark"
      } mode`}
      title={`Switch to ${currentTheme === "dark" ? "light" : "dark"} mode`}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")} // Chuyển đổi theme khi click
    >
      {currentTheme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
