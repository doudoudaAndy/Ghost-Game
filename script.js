const character = document.getElementById("character");
const coin = document.getElementById("coin");
let score = 0;
let highestScore = localStorage.getItem("highestScore") || 0;
let timeRemaining = 30;
let timerInterval;

const gameContainer = document.getElementById("game-container");
const scoreContainer = document.getElementById("score-container");

document.addEventListener("keydown", (event) => {
  const characterRect = character.getBoundingClientRect();
  const containerRect = gameContainer.getBoundingClientRect();
  let {
    left: characterX,
    top: characterY,
    width: characterWidth,
    height: characterHeight,
  } = characterRect;
  const { width: containerWidth, height: containerHeight } = containerRect;

  characterX <= containerRect.left;
  characterY <= containerRect.top;

  switch (event.key) {
    case "ArrowUp":
    case "w":
      if (characterY > 0) {
        character.style.top = `${characterY - characterHeight}px`;
      }
      break;
    case "ArrowDown":
    case "s":
      if (characterY + characterHeight < containerHeight) {
        character.style.top = `${characterY + characterHeight}px`;
      }
      break;
    case "ArrowLeft":
    case "a":
      if (characterX > 0) {
        character.style.left = `${characterX - characterWidth}px`;
      }
      break;
    case "ArrowRight":
    case "d":
      if (characterX + characterWidth < containerWidth) {
        character.style.left = `${characterX + characterWidth}px`;
      }
      break;
  }

  if (checkCollision(characterRect, coin.getBoundingClientRect())) {
    collectCoin();
  }
});

function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = score;

  if (score > highestScore) {
    highestScore = score;
    updateHighestScore();
  }
}

function updateHighestScore() {
  const highestScoreElement = document.getElementById("highest-score");
  highestScoreElement.textContent = highestScore;
  localStorage.setItem("highestScore", highestScore);
}

function collectCoin() {
  score++;
  updateScore();

  const newPosition = getRandomPosition();
  coin.style.top = `${newPosition[1]}px`;
  coin.style.left = `${newPosition[0]}px`;
}

function checkCollision(rect1, rect2) {
  const isCollision =
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top &&
    rect1.left < rect2.right &&
    rect1.right > rect2.left;

  if (isCollision) {
    collectCoin();
  }

  return isCollision;
}

function getRandomPosition() {
  const containerRect = gameContainer.getBoundingClientRect();

  const maxX = containerRect.width - coin.offsetWidth;
  const maxY = containerRect.height - coin.offsetHeight;

  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  return [randomX, randomY];
}

function updateTimer() {
  const timeElement = document.getElementById("time");
  timeElement.textContent = `${timeRemaining}s`;

  if (timeRemaining === 0) {
    clearInterval(timerInterval);
    endGame();
  } else {
    timeRemaining--;
  }
}

function startTimer() {
  timerInterval = setInterval(updateTimer, 1000);
}

function endGame() {
  clearInterval(timerInterval);
  alert("Time's up!");

  // Reset score, time, and positions
  score = 0;
  timeRemaining = 30;
  updateScore();
  updateTimer();

  // Reset coin position
  const coinPosition = getRandomPosition();
  coin.style.top = `${coinPosition[1]}px`;
  coin.style.left = `${coinPosition[0]}px`;

  // Reset character position
  const containerRect = gameContainer.getBoundingClientRect();
  const characterX = containerRect.width / 2 - character.offsetWidth / 2;
  const characterY = containerRect.height / 2 - character.offsetHeight / 2;
  character.style.transform = `translate(${characterX}px, ${characterY}px)`;
}

function initGame() {
  // Adjust score container width to match game area
  scoreContainer.style.width = `${gameContainer.offsetWidth}px`;

  startTimer();
  updateHighestScore();
}

initGame();
