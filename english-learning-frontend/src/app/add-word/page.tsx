// src/app/add-word/page.tsx
"use client";

import React, { useState } from "react";

export default function AddWordPage() {
  const [english, setEnglish] = useState("");
  const [vietnamese, setVietnamese] = useState("");
  // Sử dụng object để lưu cả loại (success/error) và nội dung message
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null); // Xóa thông báo cũ khi submit
    setIsLoading(true);

    // Lấy URL backend từ biến môi trường
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/words";
    // console.log(`Sending request to: ${apiUrl}`); // Ghi log URL (hữu ích khi debug)

    try {
      // Gọi API bằng fetch
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Báo cho server biết data gửi lên là JSON
        },
        // Chuyển đổi state thành chuỗi JSON để gửi đi
        body: JSON.stringify({
          english: english.trim(),
          vietnamese: vietnamese.trim(),
        }), // trim() để loại bỏ khoảng trắng thừa
      });

      // Xử lý kết quả trả về từ backend
      if (response.ok) {
        // Nếu request thành công (status 2xx)
        const newWord = await response.json(); // Lấy data JSON từ response
        console.log("Word added successfully:", newWord);
        setMessage({
          type: "success",
          text: `Thêm thành công: "${newWord.english}" (IPA: ${
            newWord.ipa || "N/A"
          }, Type: ${newWord.type || "N/A"})`,
        });
        setEnglish(""); // Xóa nội dung input sau khi thành công
        setVietnamese("");
      } else {
        // Nếu có lỗi từ backend (status 4xx, 5xx)
        const errorData = await response.json(); // Cố gắng đọc chi tiết lỗi từ response body
        console.error("Backend error:", response.status, errorData);
        // Hiển thị thông báo lỗi từ backend (nếu có), hoặc thông báo chung
        setMessage({
          type: "error",
          text: `Lỗi ${response.status}: ${
            errorData.message || "Không thể thêm từ."
          }`,
        });
      }
    } catch (error) {
      // Nếu có lỗi mạng hoặc lỗi trong quá trình fetch
      console.error("Network or fetch error:", error);
      setMessage({
        type: "error",
        text: "Lỗi mạng hoặc không kết nối được tới server. Vui lòng thử lại.",
      });
    } finally {
      // Luôn thực hiện sau khi try hoặc catch kết thúc
      setIsLoading(false); // Tắt trạng thái loading
    }
  };

  // Phần JSX của component giữ nguyên như Bước 10, nhưng cập nhật phần hiển thị message
  return (
    <div className="container mx-auto p-4 pt-10 max-w-md">
      {/* Tiêu đề đã có màu từ layout */}
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
        Thêm từ vựng mới
      </h1>

      <form
        onSubmit={handleSubmit}
        // Cập nhật nền, shadow, border cho form
        className="bg-white dark:bg-gray-800 shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-200 dark:border-gray-700"
      >
        {/* Trường Tiếng Anh */}
        <div className="mb-5">
          {/* Cập nhật màu label */}
          <label
            htmlFor="english"
            className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2"
          >
            Từ Tiếng Anh:
          </label>
          <input
            type="text"
            id="english"
            name="english"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            // Cập nhật input style
            className="shadow-sm appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-3 px-4 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            placeholder="Ví dụ: beautiful"
            required
            disabled={isLoading}
          />
        </div>

        {/* Trường Tiếng Việt */}
        <div className="mb-6">
          {/* Cập nhật màu label */}
          <label
            htmlFor="vietnamese"
            className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2"
          >
            Nghĩa Tiếng Việt:
          </label>
          <input
            type="text"
            id="vietnamese"
            name="vietnamese"
            value={vietnamese}
            onChange={(e) => setVietnamese(e.target.value)}
            // Cập nhật input style (giống input trên)
            className="shadow-sm appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-3 px-4 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            placeholder="Ví dụ: xinh đẹp"
            required
            disabled={isLoading}
          />
        </div>

        {/* Nút Submit (Gradient thường ổn trên cả 2 theme, nhưng có thể tùy chỉnh hover/focus nếu cần) */}
        <div className="flex items-center justify-center mt-4">
          <button
            type="submit"
            // Có thể thêm dark:hover nếu muốn hiệu ứng khác biệt
            className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Đang thêm..." : "Thêm Từ"}
          </button>
        </div>

        {/* Khu vực thông báo */}
        {message && (
          // Cập nhật màu chữ thông báo
          <p
            className={`mt-6 text-center text-sm font-medium ${
              message.type === "error"
                ? "text-red-600 dark:text-red-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}
