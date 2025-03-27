// DOM elements
let flashcard = document.querySelector(".flashcard");
let cardFront = document.querySelector(".card-front");
let cardBack = document.querySelector(".card-back");
let nextButton = document.querySelector(".btn");
let speakButton = document.querySelector(".speak-btn");
let imageElement = document.querySelector(".word-image");
let ignoreButton = document.querySelector(".ignore-btn");
let resetButton = document.querySelector(".reset-btn");

// Lưu danh sách từ vựng
let vocabulary = [];
let currentWord = {};

// Tải file vocabulary.txt và xử lý dữ liệu
let reset = () => {
  fetch("vocabulary.txt")
    .then((response) => response.text())
    .then((data) => {
      let lines = data.split("\n");
      lines.forEach((line) => {
        let parts = line.split(": ");
        if (parts.length === 2) {
          vocabulary.push({
            english: parts[0].trim(),
            vietnamese: parts[1].trim(),
          });
        }
      });
      loadNewWord();
    });
};
reset();
let currentEnglish = "";
// Hiển thị từ ngẫu nhiên
function loadNewWord() {
  let randomIndex = Math.floor(Math.random() * vocabulary.length);
  currentWord = vocabulary[randomIndex];
  cardFront.textContent = currentWord.english;
  cardBack.textContent = currentWord.vietnamese;
  currentEnglish = currentWord.english;
  flashcard.classList.remove("flipped"); // Reset trạng thái lật thẻ
  speakWord(); // Phát âm từ mới
}
// Phát âm từ tiếng Anh
function speakWord() {
  if (currentEnglish) {
    let utterance = new SpeechSynthesisUtterance(currentEnglish);
    utterance.lang = "en-US"; // Giọng Anh Mỹ
    speechSynthesis.speak(utterance);
  }
}
// Xử lý lật flashcard
flashcard.addEventListener("click", () => {
  flashcard.classList.toggle("flipped");
  if (flashcard.classList.contains("flipped")) {
    speakWord();
  }
});

let ignore = () => {
  vocabulary = vocabulary.filter((word) => word !== currentWord);

  console.log(vocabulary);
  loadNewWord();
};

// Sự kiện khi nhấn nút phát âm
speakButton.addEventListener("click", speakWord);
resetButton.addEventListener("click", reset);
// Sự kiện khi nhấn nút bỏ qua
ignoreButton.addEventListener("click", ignore);
// Chuyển sang từ mới
nextButton.addEventListener("click", loadNewWord);
