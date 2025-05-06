// src/app/learn-fill-blank/page.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react"; // Import thêm useRef, useCallback

// Định nghĩa lại hoặc import interface Word
interface Word {
  id: number;
  english: string;
  vietnamese: string;
  ipa: string | null;
  type: string | null;
  createdAt: string;
  updatedAt: string;
}

// --- Component Icon Loa ---
const SpeakerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
    />
  </svg>
);
// ---------------------------

export default function LearnFillBlankPage() {
  // --- State Variables ---
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ref tới thẻ input để có thể focus vào nó
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Fetch dữ liệu từ API ---
  useEffect(() => {
    const fetchWords = async () => {
      setIsLoading(true);
      setError(null);
      setWords([]);
      setCurrentWord(null);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/words";
      console.log("Đang tải từ vựng từ:", apiUrl);

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Lỗi HTTP: ${response.status}`);
        }
        let data: Word[] = await response.json();

        if (data && data.length > 0) {
          // Xáo trộn thứ tự các từ
          data = data.sort(() => Math.random() - 0.5);
          setWords(data);
          setCurrentWord(data[0]); // Thiết lập từ đầu tiên
          setCurrentIndex(0);
          console.log(`Đã tải ${data.length} từ.`);
          // Focus vào input khi dữ liệu đã sẵn sàng
          setTimeout(() => inputRef.current?.focus(), 0);
        } else {
          setError("Không có từ vựng nào trong hệ thống.");
        }
      } catch (err: any) {
        console.error("Lỗi khi tải từ vựng:", err);
        setError(`Không thể tải dữ liệu: ${err.message}.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWords();
  }, []); // Chỉ chạy 1 lần khi component mount

  // --- Hàm chuyển sang từ tiếp theo và reset trạng thái ---
  // Sử dụng useCallback để tối ưu, chỉ tạo lại hàm khi dependencies thay đổi
  const goToNextWord = useCallback(() => {
    if (words.length === 0) return;

    const nextIndex = (currentIndex + 1) % words.length; // Quay vòng
    setCurrentIndex(nextIndex);
    setCurrentWord(words[nextIndex]); // Cập nhật từ hiện tại

    // Reset trạng thái cho từ mới
    setUserAnswer("");
    setFeedback(null);
    setIsCorrect(null);
    setShowAnswer(false);

    // Focus vào ô input để người dùng nhập từ mới
    // Dùng setTimeout nhỏ để đảm bảo input đã kịp render lại trước khi focus
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [currentIndex, words]); // Dependencies của hàm này

  // --- Các hàm xử lý sự kiện ---
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setUserAnswer(newValue);
    // Nếu người dùng bắt đầu gõ lại sau khi đã có kết quả hoặc xem đáp án, reset trạng thái
    if (isCorrect !== null || showAnswer) {
      setFeedback(null);
      setIsCorrect(null);
      setShowAnswer(false);
    }
  };

  // Hàm kiểm tra đáp án
  const handleCheckAnswer = useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault(); // Ngăn form submit nếu được gọi từ form
      if (
        !currentWord ||
        !userAnswer.trim() ||
        isCorrect === true ||
        showAnswer
      ) {
        // Không làm gì nếu chưa có từ, chưa nhập, đã đúng, hoặc đã xem đáp án
        return;
      }

      // Chuẩn hóa đáp án (bỏ khoảng trắng thừa, chuyển về chữ thường)
      const correctAnswer = currentWord.english.trim().toLowerCase();
      const userAnswerCleaned = userAnswer.trim().toLowerCase();

      if (userAnswerCleaned === correctAnswer) {
        setFeedback("🎉 Chính xác!");
        setIsCorrect(true);
        // Tự động chuyển sang từ tiếp theo sau 1.2 giây
        setTimeout(goToNextWord, 1200);
      } else {
        setFeedback("Chưa đúng. Thử lại hoặc xem đáp án.");
        setIsCorrect(false);
        inputRef.current?.focus(); // Focus lại vào ô input để sửa
      }
    },
    [currentWord, userAnswer, isCorrect, showAnswer, goToNextWord]
  ); // Dependencies

  // Hàm hiển thị đáp án
  const handleShowAnswer = () => {
    if (!currentWord) return;
    setShowAnswer(true);
    setFeedback(null);
    setIsCorrect(null);
  };

  // Hàm bỏ qua / chuyển từ tiếp theo
  const handleSkipOrNext = () => {
    goToNextWord(); // Chỉ đơn giản là gọi hàm chuyển từ
  };

  // Hàm phát âm (Sẽ hoàn thiện ở Bước 18)
  const handlePronounce = useCallback(() => {
    // Kiểm tra xem có từ hiện tại không
    if (!currentWord) return;
    console.log("Phát âm:", currentWord.english);

    // Kiểm tra trình duyệt có hỗ trợ Web Speech API không
    if ("speechSynthesis" in window) {
      // Hủy các lần phát âm trước đó nếu có
      window.speechSynthesis.cancel();
      // Tạo đối tượng phát âm mới với từ tiếng Anh
      const utterance = new SpeechSynthesisUtterance(currentWord.english);
      // Thiết lập ngôn ngữ (ví dụ: Anh-Mỹ)
      utterance.lang = "en-US";
      // Yêu cầu trình duyệt đọc
      window.speechSynthesis.speak(utterance);
    } else {
      // Thông báo nếu trình duyệt không hỗ trợ
      alert("Trình duyệt của bạn không hỗ trợ tính năng phát âm.");
    }
  }, [currentWord]); // Phụ thuộc vào currentWord

  // Xử lý nhấn phím Enter để kiểm tra đáp án
  useEffect(() => {
    const handleEnterKey = (event: KeyboardEvent) => {
      // Chỉ kiểm tra khi nhấn Enter, có nhập liệu, chưa xem đáp án, và chưa đúng
      if (
        event.key === "Enter" &&
        userAnswer.trim() &&
        !showAnswer &&
        isCorrect !== true
      ) {
        handleCheckAnswer(); // Gọi hàm kiểm tra
      }
    };

    const inputElement = inputRef.current;
    inputElement?.addEventListener("keydown", handleEnterKey);

    // Cleanup: Gỡ bỏ event listener khi component unmount hoặc dependencies thay đổi
    return () => {
      inputElement?.removeEventListener("keydown", handleEnterKey);
    };
  }, [userAnswer, showAnswer, isCorrect, handleCheckAnswer]); // Dependencies cho effect này

  // --- Render Giao diện ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <p className="text-xl text-gray-600 animate-pulse">
          Đang chuẩn bị bài học...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-red-600 bg-red-100 p-4 rounded-lg">
          {error}
        </p>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-gray-700">
          Không có từ vựng để học. Vui lòng thêm từ mới.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex flex-col items-center gap-5 pt-8 max-w-lg">
      {/* Cập nhật màu tiêu đề */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
        Điền Từ (Việt → Anh)
      </h1>
      {/* Cập nhật nền card, border */}
      <div className="w-full bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8 text-center border border-gray-200 dark:border-gray-700">
        {/* Cập nhật màu chữ hướng dẫn */}
        <p className="text-base text-gray-600 dark:text-gray-400 mb-2">
          Điền từ tiếng Anh tương ứng:
        </p>
        {/* Cập nhật màu chữ từ tiếng Việt */}
        <p className="text-4xl md:text-5xl font-bold text-blue-700 dark:text-blue-400 mb-6 min-h-[60px] flex items-center justify-center">
          {currentWord.vietnamese}
        </p>

        {/* Input và Nút Kiểm Tra */}
        <div className="flex flex-col items-center gap-4">
          <label htmlFor="userAnswerInput" className="sr-only">
            Nhập từ tiếng Anh
          </label>
          <input
            ref={inputRef}
            id="userAnswerInput"
            type="text"
            value={userAnswer}
            onChange={handleInputChange}
            // Cập nhật input styles
            className={`text-lg shadow-sm appearance-none border rounded w-full max-w-md py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:border-transparent ${
              isCorrect === true
                ? "border-green-500 dark:border-green-400 ring-green-400 dark:ring-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                : isCorrect === false
                ? "border-red-500 dark:border-red-400 ring-red-400 dark:ring-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                : "border-gray-300 dark:border-gray-600 ring-blue-500 dark:ring-blue-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            } ${
              showAnswer || isCorrect === true
                ? "disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                : ""
            }`}
            placeholder="Gõ câu trả lời..."
            aria-label="Gõ câu trả lời tiếng Anh"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            disabled={showAnswer || isCorrect === true}
            autoFocus
          />
          {/* Nút kiểm tra (gradient thường ổn) */}
          <button
            type="button"
            onClick={() => handleCheckAnswer()}
            className="w-full max-w-md bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!userAnswer.trim() || showAnswer || isCorrect === true}
          >
            Kiểm Tra
          </button>
        </div>

        {/* Khu vực Phản hồi / Đáp án */}
        <div className="mt-5 min-h-[3em]">
          {feedback && !showAnswer && (
            // Cập nhật màu chữ feedback
            <p
              className={`text-xl font-medium ${
                isCorrect
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {feedback}
            </p>
          )}
          {showAnswer && (
            // Cập nhật màu nền/chữ đáp án
            <div className="text-xl font-medium text-indigo-800 dark:text-indigo-200 bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-md">
              Đáp án:{" "}
              <strong className="font-bold">{currentWord.english}</strong>
              {currentWord.ipa && (
                <span className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                  [{currentWord.ipa}]
                </span>
              )}
            </div>
          )}
        </div>
      </div>{" "}
      {/* End card */}
      {/* Các nút hành động */}
      <div className="grid grid-cols-3 gap-3 w-full mt-3">
        {/* Cập nhật dark styles cho các nút */}
        <button
          onClick={handlePronounce}
          disabled={!currentWord}
          className="col-span-1 bg-sky-100 dark:bg-sky-800 hover:bg-sky-200 dark:hover:bg-sky-700 text-sky-700 dark:text-sky-200 font-medium py-2.5 px-4 rounded-lg shadow-sm text-sm transition duration-200 border border-sky-200 dark:border-sky-700 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {" "}
          <SpeakerIcon /> Phát âm{" "}
        </button>
        <button
          onClick={handleShowAnswer}
          disabled={showAnswer || !currentWord}
          className={`col-span-1 bg-amber-100 dark:bg-amber-800 hover:bg-amber-200 dark:hover:bg-amber-700 text-amber-700 dark:text-amber-200 font-medium py-2.5 px-4 rounded-lg shadow-sm text-sm transition duration-200 border border-amber-200 dark:border-amber-700 ${
            showAnswer ? "opacity-60 cursor-not-allowed" : ""
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {" "}
          💡 Xem đáp án{" "}
        </button>
        <button
          onClick={handleSkipOrNext}
          disabled={!currentWord}
          className="col-span-1 bg-slate-600 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg shadow transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCorrect === true || showAnswer ? "Tiếp theo ➡️" : "Bỏ qua ➡️"}
        </button>
      </div>
      {/* Cập nhật màu chữ chỉ số */}
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
        Từ {currentIndex + 1} / {words.length}
      </p>
    </div>
  );
}
