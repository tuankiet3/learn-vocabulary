// DOM elements
let vietnameseWord = document.querySelector(".vietnamese");
let inputField = document.querySelector(".english");
let submitButton = document.querySelector(".btn");
let speakButton = document.querySelector(".speak-btn");
let showAnswerButton = document.querySelector(".show-answer-btn");
let answerText = document.querySelector(".answer");
let imageElement = document.querySelector(".word-image");

// Lưu danh sách từ vựng
let vocabulary = {};
let currentVietnamese = "";
let currentEnglish = "";

// Tải file vocabulary.txt và xử lý dữ liệu
let reset = () => {
  fetch("vocabulary.txt")
    .then((response) => response.text())
    .then((data) => {
      let lines = data.split("\n");
      lines.forEach((line) => {
        let parts = line.split(": ");
        if (parts.length === 2) {
          vocabulary[parts[1].trim()] = parts[0].trim(); // Lưu từ Việt - Anh
        }
      });
      loadNewWord();
    });
};
reset();

// Hiển thị từ ngẫu nhiên
function loadNewWord() {
  let keys = Object.keys(vocabulary);
  if (keys.length === 0) reset(); // Nếu hết từ, tải lại từ mới
  currentVietnamese = keys[Math.floor(Math.random() * keys.length)];
  currentEnglish = vocabulary[currentVietnamese]; // Lưu từ tiếng Anh hiện tại
  vietnameseWord.textContent = currentVietnamese;
  vocabulary = Object.fromEntries(
    Object.entries(vocabulary).filter(
      ([key, value]) => key !== currentVietnamese
    )
  );
  console.log(keys.length);
  inputField.value = "";
  inputField.style.border = "1px solid black"; // Reset màu input
  answerText.style.display = "none"; // Ẩn đáp án khi đổi từ
}

// Kiểm tra câu trả lời
function checkAnswer() {
  let answer = inputField.value.trim().toLowerCase();
  let correctAnswer = currentEnglish.toLowerCase();

  if (answer === correctAnswer) {
    loadNewWord(); // Nếu đúng, hiển thị từ mới + ảnh mới
  } else {
    inputField.style.border = "2px solid red"; // Nếu sai, đổi màu đỏ
  }
}

// Phát âm từ tiếng Anh
function speakWord() {
  if (currentEnglish) {
    let utterance = new SpeechSynthesisUtterance(currentEnglish);
    utterance.lang = "en-US"; // Giọng Anh Mỹ
    speechSynthesis.speak(utterance);
  }
}

// Hiển thị đáp án
function showAnswer() {
  answerText.textContent = `Answer: ${currentEnglish}`;
  answerText.style.display = "block"; // Hiện đáp án
}

// Sự kiện khi nhấn nút Submit
submitButton.addEventListener("click", checkAnswer);

// Sự kiện khi nhấn Enter trong input
inputField.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

// Sự kiện khi nhấn nút phát âm
speakButton.addEventListener("click", speakWord);

// Sự kiện khi nhấn nút hiển thị đáp án
showAnswerButton.addEventListener("click", showAnswer);
