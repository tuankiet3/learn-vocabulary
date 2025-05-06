// src/app/page.tsx
import Link from "next/link";
import React from "react";

const features = [
  {
    title: "Học với Flashcards",
    description: "Ôn tập từ vựng qua thẻ ghi nhớ hai mặt.",
    href: "/learn-flashcards",
    icon: "🃏",
    bgColor:
      "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900",
    textColor: "text-blue-800 dark:text-blue-100",
    hoverBg: "hover:bg-blue-200/50 dark:hover:bg-blue-700/50",
  },
  {
    title: "Học Điền Từ",
    description: "Nhìn nghĩa tiếng Việt, điền từ tiếng Anh tương ứng.",
    href: "/learn-fill-blank",
    icon: "✍️",
    bgColor:
      "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900",
    textColor: "text-green-800 dark:text-green-100",
    hoverBg: "hover:bg-green-200/50 dark:hover:bg-green-700/50",
  },
  {
    title: "Điền Chữ Cái Thiếu",
    description: "Hoàn thành từ tiếng Anh bị thiếu một vài chữ cái.",
    href: "/learn-missing-letters",
    icon: "🧩",
    bgColor:
      "bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900",
    textColor: "text-yellow-800 dark:text-yellow-100",
    hoverBg: "hover:bg-yellow-200/50 dark:hover:bg-yellow-700/50",
  },
  {
    title: "Thêm Từ Mới",
    description: "Quản lý và thêm từ vựng của riêng bạn vào hệ thống.",
    href: "/add-word",
    icon: "➕",
    bgColor:
      "bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900",
    textColor: "text-purple-800 dark:text-purple-100",
    hoverBg: "hover:bg-purple-200/50 dark:hover:bg-purple-700/50",
  },
  {
    title: "Tìm Từ Bằng Từ Tiếng Anh",
    description: "Nhập từ tiếng Anh để tìm nghĩa tiếng Việt tương ứng.",
    href: "/find-word-by-english-word",
    icon: "🔍",
    bgColor:
      "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-800 dark:to-red-900",
    textColor: "text-red-800 dark:text-red-100",
    hoverBg: "hover:bg-red-200/50 dark:hover:bg-red-700/50",
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 md:mb-12 text-gray-800 dark:text-gray-100">
        Ứng dụng Học Tiếng Anh
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.href} legacyBehavior>
            <a
              className={`block p-6 rounded-lg shadow-md hover:shadow-xl ${feature.hoverBg} ${feature.bgColor} transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-center mb-3">
                <span className="text-3xl mr-4">{feature.icon}</span>
                <h2 className={`text-2xl font-semibold ${feature.textColor}`}>
                  {feature.title}
                </h2>
              </div>
              <p className={`text-base ${feature.textColor} opacity-90`}>
                {feature.description}
              </p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
