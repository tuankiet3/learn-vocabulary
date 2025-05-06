// src/components/Flashcard.tsx
"use client";

import React, { useState, useCallback } from "react"; // Import thêm useCallback

// --- Component Icon Loa (SVG đơn giản) ---
const SpeakerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    {" "}
    {/* Thay đổi kích thước nếu cần */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
    />
  </svg>
);
// -----------------------------------------

interface FlashcardProps {
  english: string;
  vietnamese: string;
  ipa?: string | null;
  type?: string | null;
}

const Flashcard: React.FC<FlashcardProps> = ({
  english,
  vietnamese,
  ipa,
  type,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // --- Hàm phát âm từ ---
  // Sử dụng useCallback để tránh tạo lại hàm này mỗi khi component re-render không cần thiết
  const speakWord = useCallback((text: string, lang: string = "en-US") => {
    // Kiểm tra xem trình duyệt có hỗ trợ Speech Synthesis API không
    if ("speechSynthesis" in window) {
      // Hủy các yêu cầu phát âm trước đó (nếu có) để tránh đọc chồng chéo
      window.speechSynthesis.cancel();

      // Tạo một đối tượng phát âm mới
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang; // Thiết lập ngôn ngữ (ví dụ: 'en-US' cho tiếng Anh Mỹ, 'en-GB' cho Anh Anh)
      utterance.rate = 1.0; // Tốc độ đọc (từ 0.1 đến 10, mặc định là 1)
      utterance.pitch = 1.0; // Cao độ giọng (từ 0 đến 2, mặc định là 1)

      // Thực hiện phát âm
      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Lỗi phát âm:", error);
        // Thông báo lỗi đơn giản cho người dùng
        alert("Xin lỗi, không thể phát âm từ này vào lúc này.");
      }
    } else {
      // Thông báo nếu trình duyệt không hỗ trợ
      console.error("Trình duyệt không hỗ trợ Speech Synthesis.");
      alert("Tính năng phát âm không được hỗ trợ trên trình duyệt của bạn.");
    }
  }, []); // Mảng dependency rỗng vì hàm không phụ thuộc vào props hay state nào để định nghĩa lại chính nó

  // --- Hàm xử lý khi nhấn nút Loa ---
  const handleSpeakButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    // QUAN TRỌNG: Ngăn sự kiện click này lan tỏa lên thẻ cha (div chứa thẻ)
    // Nếu không có dòng này, nhấn nút loa cũng sẽ làm lật thẻ
    event.stopPropagation();
    speakWord(english, "en-US"); // Gọi hàm phát âm với từ tiếng Anh
  };
  // -------------------------------

  return (
    <div
      className="group h-60 w-full max-w-sm cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent shadow-lg [perspective:1000px] hover:shadow-xl dark:hover:shadow-blue-900/40 transition-shadow duration-300" // Thêm dark:border, dark:hover:shadow
      onClick={handleFlip}
      title="Nhấn để lật thẻ"
    >
      <div
        className={`relative h-full w-full rounded-lg text-center transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Mặt trước */}
        <div
          className="absolute inset-0 flex h-full w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-sky-100 via-white to-sky-100 dark:from-sky-900 dark:via-gray-800 dark:to-sky-900 p-4 text-sky-900 dark:text-sky-100 [backface-visibility:hidden]" // Thêm dark: bg và text
        >
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            {type && (
              <span className="rounded-full bg-sky-600 dark:bg-sky-500 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
                {type}
              </span>
            )}
            <button
              onClick={handleSpeakButtonClick}
              className="text-sky-600 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-100 focus:outline-none p-1.5 rounded-full hover:bg-sky-200/70 dark:hover:bg-sky-700/50 active:bg-sky-300/50 transition-colors duration-200" // Thêm dark: text, hover:bg
              title={`Phát âm "${english}"`}
            >
              <SpeakerIcon />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center flex-grow pt-6">
            <h2 className="mb-1 text-3xl font-bold">{english}</h2>
            {ipa && (
              <p className="text-base text-sky-700 dark:text-sky-300">{ipa}</p> // Thêm dark: text
            )}
          </div>
          <span className="absolute bottom-3 text-xs text-gray-500 dark:text-gray-400">
            (Nhấn để xem nghĩa)
          </span>
        </div>

        {/* Mặt sau */}
        <div
          className="absolute inset-0 flex h-full w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 via-white to-emerald-100 dark:from-emerald-900 dark:via-gray-800 dark:to-emerald-900 p-4 text-emerald-900 dark:text-emerald-100 [backface-visibility:hidden] [transform:rotateY(180deg)]" // Thêm dark: bg và text
        >
          <h3 className="text-2xl font-semibold">{vietnamese}</h3>
          <span className="absolute bottom-3 text-xs text-gray-500 dark:text-gray-400">
            (Nhấn để xem từ)
          </span>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
