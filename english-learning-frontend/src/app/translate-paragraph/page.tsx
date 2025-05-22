"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface TranslationState {
  currentSentenceIndex: number;
  sentences: string[];
  translations: { [key: number]: string };
  feedback: { [key: number]: string };
}

export default function TranslateParagraphPage() {
  const router = useRouter();
  const [paragraph, setParagraph] = useState("");
  const [translationState, setTranslationState] = useState<TranslationState>({
    currentSentenceIndex: 0,
    sentences: [],
    translations: {},
    feedback: {},
  });
  const [currentTranslation, setCurrentTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleParagraphSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paragraph.trim()) {
      setError("Vui lòng nhập đoạn văn");
      return;
    }

    // Split paragraph into sentences (simple split by period for now)
    const sentences = paragraph
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    setTranslationState({
      currentSentenceIndex: 0,
      sentences,
      translations: {},
      feedback: {},
    });
    setError("");
  };

  const handleTranslationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTranslation.trim()) {
      setError("Vui lòng nhập bản dịch");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/analyze-translation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original: translationState.sentences[translationState.currentSentenceIndex],
          translation: currentTranslation,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze translation");
      }

      const feedback = await response.json();
      
      console.log('API Feedback:', feedback); // Debug log
      console.log('Feedback message:', feedback.message); // Debug log

      setTranslationState((prev) => {
        const newState = {
          ...prev,
          translations: {
            ...prev.translations,
            [prev.currentSentenceIndex]: currentTranslation,
          },
          feedback: {
            ...prev.feedback,
            [prev.currentSentenceIndex]: feedback.message,
          },
        };
        console.log('New translation state:', newState); // Debug log
        return newState;
      });

      setCurrentTranslation("");

      // Move to next sentence or complete
      if (translationState.currentSentenceIndex < translationState.sentences.length - 1) {
        setTranslationState((prev) => ({
          ...prev,
          currentSentenceIndex: prev.currentSentenceIndex + 1,
        }));
      } else {
        // TODO: Handle completion - maybe show summary or redirect
        router.push("/translate-paragraph/new");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi phân tích bản dịch");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
        Luyện Dịch Đoạn Văn
      </h1>

      {translationState.sentences.length === 0 ? (
        <form onSubmit={handleParagraphSubmit} className="max-w-2xl mx-auto">
          <div className="mb-4">
            <label
              htmlFor="paragraph"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Nhập đoạn văn tiếng Việt
            </label>
            <textarea
              id="paragraph"
              value={paragraph}
              onChange={(e) => setParagraph(e.target.value)}
              className="w-full h-48 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
              placeholder="Nhập đoạn văn cần dịch..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Bắt đầu dịch
          </button>
        </form>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Câu {translationState.currentSentenceIndex + 1} /{" "}
              {translationState.sentences.length}
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
              <p className="text-lg text-gray-800 dark:text-gray-200">
                {translationState.sentences[translationState.currentSentenceIndex]}
              </p>
            </div>
          </div>

          <form onSubmit={handleTranslationSubmit}>
            <div className="mb-4">
              <label
                htmlFor="translation"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Bản dịch tiếng Anh
              </label>
              <textarea
                id="translation"
                value={currentTranslation}
                onChange={(e) => setCurrentTranslation(e.target.value)}
                className="w-full h-32 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
                placeholder="Nhập bản dịch của bạn..."
              />
            </div>

            {translationState.feedback[translationState.currentSentenceIndex] && (
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                {/* Debug info - only visible in development */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mb-2 text-xs text-gray-500">
                    Debug: {JSON.stringify(translationState.feedback[translationState.currentSentenceIndex])}
                  </div>
                )}
                {translationState.feedback[translationState.currentSentenceIndex].toLowerCase().includes("rất cao") && (
                  <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
                        Chúc mừng bạn! Bản dịch của bạn rất chính xác!
                      </h3>
                    </div>
                  </div>
                )}
                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Phản hồi:
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Câu gốc tiếng Việt:</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {translationState.sentences[translationState.currentSentenceIndex]}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Câu dịch tiếng Anh:</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {translationState.translations[translationState.currentSentenceIndex]}
                    </p>
                  </div>
                  <div className="border-t border-blue-200 dark:border-blue-800 pt-2">
                    <div className="mb-2">
                      <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">1. Lỗi ngữ pháp:</h4>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {translationState.feedback[translationState.currentSentenceIndex].split('**1. Lỗi ngữ pháp (Grammar errors):**')[1]?.split('**2.')[0] || 'Không có lỗi ngữ pháp.'}
                      </p>
                    </div>
                    <div className="mb-2">
                      <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">2. Thiếu dấu câu:</h4>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {translationState.feedback[translationState.currentSentenceIndex].split('**2. Thiếu dấu câu (Missing punctuation):**')[1]?.split('**3.')[0] || 'Không thiếu dấu câu.'}
                      </p>
                    </div>
                    <div className="mb-2">
                      <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">3. Đề xuất sửa lỗi:</h4>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {translationState.feedback[translationState.currentSentenceIndex].split('**3. Đề xuất sửa lỗi (Suggested corrections):**')[1]?.split('**4.')[0] || 'Không có đề xuất sửa lỗi.'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">4. Mức độ chính xác tổng thể:</h4>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {translationState.feedback[translationState.currentSentenceIndex].split('**4. Mức độ chính xác tổng thể (Overall accuracy):**')[1]?.split('---')[0] || 'Chưa có đánh giá.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Đang xử lý..." : "Gửi bản dịch"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
} 