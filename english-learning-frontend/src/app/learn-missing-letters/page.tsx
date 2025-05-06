// src/app/learn-missing-letters/page.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

// Interface Word
interface Word {
  id: number;
  english: string;
  vietnamese: string;
  ipa: string | null;
  type: string | null;
  createdAt: string;
  updatedAt: string;
}

// Hàm Helper: Tạo ô trống
const generateBlanks = (
  word: string,
  difficulty: number = 0.4
): { display: (string | null)[]; blankIndices: number[] } => {
  if (!word) return { display: [], blankIndices: [] };
  const letters = word.split("");
  const display: (string | null)[] = [...letters];
  const indices = Array.from(letters.keys());
  const letterIndices = indices.filter((i) => letters[i].match(/[a-zA-Z]/)); // Chỉ làm trống chữ cái
  letterIndices.sort(() => Math.random() - 0.5); // Xáo trộn
  // Đảm bảo số ô trống hợp lệ (ít nhất 1, không quá số chữ cái)
  const numBlanks = Math.min(
    letterIndices.length,
    Math.max(1, Math.floor(letters.length * difficulty))
  );
  const blankIndices: number[] = [];
  for (let i = 0; i < numBlanks; i++) {
    const indexToBlank = letterIndices[i];
    // Kiểm tra lại để tránh lỗi không mong muốn
    if (display[indexToBlank] !== null) {
      display[indexToBlank] = null;
      blankIndices.push(indexToBlank);
    }
  }
  blankIndices.sort((a, b) => a - b); // Sắp xếp chỉ số ô trống
  return { display, blankIndices };
};

// Component Icon Loa
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

// Component Chính
export default function LearnMissingLettersPage() {
  // --- States ---
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayWord, setDisplayWord] = useState<(string | null)[]>([]);
  const [blankIndices, setBlankIndices] = useState<number[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // Mảng ref cho các input

  // --- Hàm chuẩn bị một từ (tạo ô trống, reset state) ---
  // useCallback để tránh tạo lại hàm không cần thiết
  const setupWord = useCallback((word: Word) => {
    console.log(`Setting up word: ${word.english}`);
    const { display, blankIndices: indices } = generateBlanks(word.english); // Tạo ô trống
    setDisplayWord(display);
    setBlankIndices(indices);
    setUserAnswers(Array(indices.length).fill("")); // Reset mảng câu trả lời
    inputRefs.current = Array(indices.length).fill(null); // Reset mảng refs
    // Reset trạng thái phản hồi
    setFeedback(null);
    setIsCorrect(null);
    setShowAnswer(false);
    // Focus vào ô input đầu tiên sau một chút độ trễ để đảm bảo nó đã render
    setTimeout(() => {
      console.log("Focusing first input");
      inputRefs.current[0]?.focus();
    }, 100);
  }, []); // Hàm này không thay đổi nên dependency rỗng

  // --- Tải dữ liệu từ API ---
  useEffect(() => {
    const fetchWords = async () => {
      setIsLoading(true);
      setError(null);
      setWords([]);
      setCurrentWord(null);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/words";
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
        let data: Word[] = await response.json();
        if (data && data.length > 0) {
          data = data.sort(() => Math.random() - 0.5); // Xáo trộn từ
          setWords(data);
          setCurrentIndex(0);
          setCurrentWord(data[0]);
          setupWord(data[0]); // Chuẩn bị từ đầu tiên
        } else {
          setError("Không có từ vựng nào trong hệ thống.");
        }
      } catch (err: any) {
        setError(`Không thể tải dữ liệu: ${err.message}.`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWords();
  }, [setupWord]); // Phụ thuộc vào setupWord (dù nó không đổi, nhưng để đúng quy tắc của hook)

  // --- Hàm chuyển từ tiếp theo ---
  const goToNextWord = useCallback(() => {
    if (words.length === 0) return;
    const nextIndex = (currentIndex + 1) % words.length;
    setCurrentIndex(nextIndex);
    const nextWord = words[nextIndex];
    setCurrentWord(nextWord);
    setupWord(nextWord); // Chuẩn bị từ mới
  }, [currentIndex, words, setupWord]);

  // --- Các hàm xử lý sự kiện ---
  const handleInputChange = (indexInBlanksArray: number, value: string) => {
    // Không cho phép thay đổi nếu đã xem đáp án hoặc đã đúng
    if (showAnswer || isCorrect === true) return;

    const newAnswers = [...userAnswers];
    // Chỉ lấy ký tự cuối cùng được nhập, chuyển thành chữ thường
    const lastChar = value.slice(-1).toLowerCase();
    newAnswers[indexInBlanksArray] = lastChar;
    setUserAnswers(newAnswers);

    // Reset feedback khi người dùng nhập
    setFeedback(null);
    setIsCorrect(null);

    // Tự động focus ô trống tiếp theo nếu nhập thành công 1 ký tự và chưa phải ô cuối
    if (lastChar && indexInBlanksArray < blankIndices.length - 1) {
      inputRefs.current[indexInBlanksArray + 1]?.focus();
    }
  };

  // Xử lý phím Backspace
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    indexInBlanksArray: number
  ) => {
    // Nếu nhấn Backspace, ô hiện tại trống, và không phải ô đầu tiên
    if (
      event.key === "Backspace" &&
      !userAnswers[indexInBlanksArray] &&
      indexInBlanksArray > 0
    ) {
      inputRefs.current[indexInBlanksArray - 1]?.focus(); // Focus ô trước đó
    }
  };

  // Kiểm tra đáp án
  const handleCheckAnswer = useCallback(() => {
    // Chỉ kiểm tra nếu có từ hiện tại, tất cả ô đã được điền, chưa đúng, và chưa xem đáp án
    if (
      !currentWord ||
      userAnswers.some((ans) => !ans) ||
      isCorrect === true ||
      showAnswer
    ) {
      return;
    }
    // Lấy các chữ cái đúng tại vị trí ô trống
    const correctLetters = blankIndices.map((idx) =>
      currentWord.english[idx].toLowerCase()
    );
    // So sánh mảng câu trả lời của người dùng với mảng chữ cái đúng
    const isMatch = userAnswers.every((ans, i) => ans === correctLetters[i]);

    if (isMatch) {
      setFeedback("🎉 Chính xác!");
      setIsCorrect(true);
      // Tự động chuyển từ sau 1.5 giây
      setTimeout(goToNextWord, 1500);
    } else {
      setFeedback("Chưa đúng. Kiểm tra lại các chữ cái.");
      setIsCorrect(false);
      // Focus vào ô sai đầu tiên để người dùng sửa (nâng cao)
      const firstIncorrectIndex = userAnswers.findIndex(
        (ans, i) => ans !== correctLetters[i]
      );
      if (firstIncorrectIndex !== -1) {
        inputRefs.current[firstIncorrectIndex]?.focus();
        inputRefs.current[firstIncorrectIndex]?.select(); // Bôi đen chữ để dễ sửa
      }
    }
  }, [
    currentWord,
    userAnswers,
    blankIndices,
    isCorrect,
    showAnswer,
    goToNextWord,
  ]); // Dependencies

  // Hiển thị đáp án
  const handleShowAnswer = useCallback(() => {
    if (!currentWord) return;
    setShowAnswer(true);
    setFeedback(null);
    setIsCorrect(null);
    // Điền đáp án đúng vào các ô input
    setUserAnswers(
      blankIndices.map((idx) => currentWord.english[idx].toLowerCase())
    );
  }, [currentWord, blankIndices]);

  // Bỏ qua / Tiếp theo
  const handleSkipOrNext = () => {
    goToNextWord();
  };

  // Phát âm
  const handlePronounce = useCallback(() => {
    if (!currentWord) return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentWord.english);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Trình duyệt không hỗ trợ phát âm.");
    }
  }, [currentWord]);

  // --- Render ---
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <p className="text-xl text-gray-600 animate-pulse">
          Đang tải bài học...
        </p>
      </div>
    );
  if (error)
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-red-600 bg-red-100 p-4 rounded-lg">
          {error}
        </p>
      </div>
    );
  if (!currentWord)
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-gray-700">Không có từ vựng để học.</p>
      </div>
    );

  return (
    <div className="container mx-auto p-4 flex flex-col items-center gap-5 pt-8 max-w-2xl">
      {/* Cập nhật màu tiêu đề */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
        Điền Chữ Cái Còn Thiếu
      </h1>
      {/* Cập nhật nền card, border */}
      <div className="w-full bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8 text-center border border-gray-200 dark:border-gray-700">
        {/* Cập nhật màu chữ hướng dẫn, từ tiếng Việt */}
        <p className="text-base text-gray-600 dark:text-gray-400 mb-2">
          Hoàn thành từ tiếng Anh cho nghĩa:
        </p>
        <p className="text-3xl md:text-4xl font-semibold text-blue-700 dark:text-blue-400 mb-8">
          {currentWord.vietnamese}
        </p>

        {/* Khu vực hiển thị từ với ô trống */}
        <div
          className="flex justify-center items-center gap-1 flex-wrap mb-6 min-h-[3rem]"
          aria-label="Từ cần điền"
        >
          {displayWord.map((char, index) => {
            const blankArrayIndex = blankIndices.indexOf(index);
            const isBlank = blankArrayIndex !== -1;
            if (isBlank) {
              // Ô input
              return (
                <input
                  key={`${currentWord.id}-blank-${index}`}
                  ref={(el) => {
                    inputRefs.current[blankArrayIndex] = el;
                  }}
                  type="text"
                  value={userAnswers[blankArrayIndex] || ""}
                  onChange={(e) =>
                    handleInputChange(blankArrayIndex, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, blankArrayIndex)}
                  maxLength={1}
                  // Cập nhật style cho input nhỏ
                  className={`w-9 h-11 md:w-11 md:h-14 border-b-2 text-center text-2xl md:text-3xl font-semibold uppercase focus:outline-none focus:ring-0 ${
                    showAnswer
                      ? "border-indigo-400 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30"
                      : isCorrect === true
                      ? "border-green-500 dark:border-green-400 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30"
                      : isCorrect === false && userAnswers[blankArrayIndex]
                      ? "border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30"
                      : "border-gray-400 dark:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700" // Cập nhật màu nền tối
                  } transition-colors duration-200 ${
                    showAnswer || isCorrect === true
                      ? "disabled:cursor-not-allowed pointer-events-none"
                      : ""
                  }`}
                  disabled={showAnswer || isCorrect === true}
                  aria-label={`Chữ cái thứ ${index + 1}`}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
              );
            } else {
              // Chữ cái tĩnh
              return (
                <span
                  key={`${currentWord.id}-char-${index}`}
                  // Cập nhật màu chữ cái tĩnh
                  className="flex items-center justify-center w-9 h-11 md:w-11 md:h-14 text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 uppercase"
                >
                  {char}
                </span>
              );
            }
          })}
        </div>

        {/* Nút Kiểm Tra */}
        <button
          type="button"
          onClick={handleCheckAnswer}
          className="w-full max-w-xs mx-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={
            userAnswers.some((ans) => !ans) || showAnswer || isCorrect === true
          }
        >
          Kiểm Tra
        </button>

        {/* Khu vực Phản hồi / Đáp án */}
        <div className="mt-5 min-h-[2.5em]">
          {feedback && !showAnswer && (
            // Cập nhật màu feedback
            <p
              className={`text-lg font-medium ${
                isCorrect
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {feedback}
            </p>
          )}
          {showAnswer && currentWord && (
            // Cập nhật màu đáp án
            <div className="text-lg font-medium text-indigo-800 dark:text-indigo-200 bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-md">
              Đáp án:{" "}
              <strong className="font-bold uppercase tracking-widest">
                {currentWord.english}
              </strong>
            </div>
          )}
        </div>
      </div>{" "}
      {/* End card */}
      {/* Các nút hành động (Copy style từ trang Điền Từ) */}
      <div className="grid grid-cols-3 gap-3 w-full mt-3">
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
      {/* Cập nhật màu chỉ số */}
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
        Từ {currentIndex + 1} / {words.length}
      </p>
    </div>
  );
}
