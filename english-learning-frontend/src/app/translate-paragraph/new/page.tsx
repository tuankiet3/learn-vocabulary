"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewParagraphPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Chúc mừng bạn đã hoàn thành!
        </h1>
        
        <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg mb-8">
          <p className="text-lg text-green-800 dark:text-green-200 mb-4">
            Bạn đã hoàn thành việc dịch đoạn văn. Hãy tiếp tục luyện tập để cải thiện kỹ năng dịch của mình!
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/translate-paragraph"
            className="block w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Dịch đoạn văn mới
          </Link>
          
          <Link
            href="/"
            className="block w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-3 px-6 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
} 