// src/app/learn-flashcards/page.tsx
"use client"; // Cần thiết vì sử dụng hooks (useState, useEffect)

import React, { useState, useEffect } from "react";
import Flashcard from "@/components/Flashcard"; // Import component Flashcard đã tạo

// Định nghĩa cấu trúc dữ liệu cho một từ vựng ( khớp với dữ liệu từ backend)
interface Word {
  id: number;
  english: string;
  vietnamese: string;
  ipa: string | null;
  type: string | null;
  createdAt: string; // Kiểu Date thường được trả về dưới dạng string trong JSON
  updatedAt: string;
}

export default function LearnFlashcardsPage() {
  // State lưu danh sách tất cả các từ lấy từ API
  const [words, setWords] = useState<Word[]>([]);
  // State lưu chỉ số (index) của thẻ đang được hiển thị trong mảng words
  const [currentIndex, setCurrentIndex] = useState(0);
  // State cho biết dữ liệu đang được tải hay không
  const [isLoading, setIsLoading] = useState(true);
  // State lưu thông báo lỗi nếu có lỗi xảy ra khi fetch dữ liệu
  const [error, setError] = useState<string | null>(null);

  // Sử dụng useEffect để gọi API lấy danh sách từ khi component được mount lần đầu
  useEffect(() => {
    const fetchWords = async () => {
      setIsLoading(true); // Bắt đầu trạng thái loading
      setError(null); // Reset lỗi cũ
      const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/words"; // Lấy URL API từ biến môi trường

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          // Kiểm tra nếu request không thành công (status code không phải 2xx)
          throw new Error(
            `Lỗi HTTP: ${response.status} ${response.statusText}`
          );
        }
        const data: Word[] = await response.json(); // Parse dữ liệu JSON trả về

        // Tùy chọn: Xáo trộn thứ tự các từ để học ngẫu nhiên hơn
        // data.sort(() => Math.random() - 0.5);

        setWords(data); // Lưu danh sách từ vào state
        setCurrentIndex(0); // Bắt đầu từ thẻ đầu tiên
        console.log("Fetched words:", data); // Log dữ liệu lấy được (hữu ích khi debug)
      } catch (err: any) {
        // Bắt lỗi (lỗi mạng hoặc lỗi từ fetch)
        console.error("Không thể tải danh sách từ:", err);
        setError(
          `Không thể tải dữ liệu từ vựng: ${err.message}. Vui lòng kiểm tra kết nối hoặc thử lại.`
        );
      } finally {
        setIsLoading(false); // Kết thúc trạng thái loading (dù thành công hay lỗi)
      }
    };

    fetchWords(); // Gọi hàm fetch dữ liệu
  }, []); // Mảng dependency rỗng [] nghĩa là effect này chỉ chạy 1 lần sau khi component mount

  // --- Các hàm điều hướng thẻ ---
  const goToNextCard = () => {
    if (words.length === 0) return; // Không làm gì nếu không có từ nào
    // Tăng chỉ số hiện tại lên 1. Dùng phép chia lấy dư (%) để quay vòng về 0 khi đến cuối danh sách
    setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
  };

  const goToPreviousCard = () => {
    if (words.length === 0) return; // Không làm gì nếu không có từ nào
    // Giảm chỉ số hiện tại đi 1. Cộng thêm words.length trước khi lấy dư để xử lý trường hợp âm và quay vòng về cuối danh sách
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + words.length) % words.length
    );
  };
  // ----------------------------

  // --- Render giao diện ---
  // Hiển thị trạng thái loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <p className="text-xl text-gray-600 animate-pulse">
          Đang tải dữ liệu từ vựng...
        </p>
      </div>
    );
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-red-600 bg-red-100 p-4 rounded-lg">
          {error}
        </p>
      </div>
    );
  }

  // Hiển thị nếu không có từ vựng nào
  if (words.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-gray-700">
          Bạn chưa có từ vựng nào. Hãy vào trang "Thêm Từ" để bắt đầu!
        </p>
      </div>
    );
  }

  // Lấy thông tin của từ hiện tại dựa vào currentIndex
  const currentWord = words[currentIndex];

  // Hiển thị giao diện chính khi đã có dữ liệu
  return (
    <div className="container mx-auto p-4 flex flex-col items-center gap-6 md:gap-8 pt-8">
      {/* Cập nhật màu tiêu đề */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
        Học với Flashcards
      </h1>

      <Flashcard
        key={currentWord.id}
        english={currentWord.english}
        vietnamese={currentWord.vietnamese}
        ipa={currentWord.ipa}
        type={currentWord.type}
      />

      {/* Cập nhật màu chỉ số thẻ */}
      <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
        Thẻ {currentIndex + 1} / {words.length}
      </p>

      {/* Cập nhật nút điều hướng */}
      <div className="flex justify-center gap-4 w-full max-w-sm mt-2">
        <button
          onClick={goToPreviousCard}
          // Thêm dark style cho nút xám
          className="flex-1 bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg shadow transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={words.length <= 1}
        >
          ⬅️ Thẻ Trước
        </button>
        <button
          onClick={goToNextCard}
          // Nút gradient xanh thường ổn, có thể thêm dark:hover nếu muốn
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={words.length <= 1}
        >
          Thẻ Tiếp Theo ➡️
        </button>
      </div>
    </div>
  );
}
