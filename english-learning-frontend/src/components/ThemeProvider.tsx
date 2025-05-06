// src/components/ThemeProvider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class" // Áp dụng theme vào class của thẻ <html>
      defaultTheme="system" // Theme mặc định theo hệ điều hành
      enableSystem // Cho phép chọn theme "system"
      disableTransitionOnChange // Tắt hiệu ứng chuyển động khi đổi theme để tránh nháy màn hình
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
