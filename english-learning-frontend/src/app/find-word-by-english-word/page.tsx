"use client";

import React, { useState } from "react";

interface Word {
  id: number;
  english: string;
  vietnamese: string;
  ipa: string | null;
  type: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function FindWordByEnglishWordPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<Word | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);
    setSearchResult(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/words/search?english=${encodeURIComponent(
          searchTerm.trim()
        )}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError("Không tìm thấy từ này trong từ điển.");
        } else {
          throw new Error(`Lỗi HTTP: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      setSearchResult(data);
    } catch (err: any) {
      setError(`Lỗi khi tìm kiếm: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePronounce = () => {
    if (!searchResult) return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(searchResult.english);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Trình duyệt của bạn không hỗ trợ tính năng phát âm.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
        Tìm Từ Tiếng Anh
      </h1>

      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nhập từ tiếng Anh cần tìm..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang tìm..." : "Tìm kiếm"}
          </button>
        </div>
      </form>

      {error && (
        <div className="max-w-md mx-auto p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {searchResult && (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {searchResult.english}
            </h2>
            <button
              onClick={handlePronounce}
              className="p-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              title="Phát âm"
            >
              🔊
            </button>
          </div>

          {searchResult.ipa && (
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              IPA: [{searchResult.ipa}]
            </p>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-lg text-gray-700 dark:text-gray-200">
              {searchResult.vietnamese}
            </p>
            {searchResult.type && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Loại từ: {searchResult.type}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 