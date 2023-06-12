const character = document.getElementById("character");
const coin = document.getElementById("coin");
const helpBtn = document.getElementById("help");

const gameContainer = document.getElementById("game-container");
const scoreContainer = document.getElementById("score-container");

//TODO: Slove the problem of score

helpBtn.addEventListener("click", () => {
  alert(
    "Use WASD or arrow keys to move the ghost around to collect as much coins as possible to score points. Each coin worth 2 points"
  );
});

let score = 0;
let highestScore = localStorage.getItem("highestScore") || 0;
let timeRemaining = 30;
let timerInterval;

document.addEventListener("keydown", (event) => {
  const characterRect = character.getBoundingClientRect();
  const containerRect = gameContainer.getBoundingClientRect();
  let {
    left: characterX,
    top: characterY,
    width: characterWidth,
    height: characterHeight,
  } = characterRect;
  const {
    left: containerLeft,
    top: containerTop,
    width: containerWidth,
    height: containerHeight,
  } = containerRect;

  switch (event.key) {
    case "ArrowUp":
    case "w":
      if (characterY - characterHeight > containerTop) {
        character.style.top = `${characterY - characterHeight}px`;
      }
      break;
    case "ArrowDown":
    case "s":
      if (characterY + characterHeight < containerTop + containerHeight) {
        character.style.top = `${characterY + characterHeight}px`;
      }
      break;
    case "ArrowLeft":
    case "a":
      if (characterX - characterWidth > containerLeft) {
        character.style.left = `${characterX - characterWidth}px`;
      }
      break;
    case "ArrowRight":
    case "d":
      if (characterX + characterWidth < containerLeft + containerWidth) {
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
  const { left: coinLeft, top: coinTop } = newPosition;
  const containerRect = gameContainer.getBoundingClientRect();
  const {
    left: containerLeft,
    top: containerTop,
    width: containerWidth,
    height: containerHeight,
  } = containerRect;
  const { width: coinWidth, height: coinHeight } = coin.getBoundingClientRect();

  if (
    coinLeft >= containerLeft &&
    coinLeft + coinWidth <= containerLeft + containerWidth &&
    coinTop >= containerTop &&
    coinTop + coinHeight <= containerTop + containerHeight
  ) {
    coin.style.top = `${coinTop}px`;
    coin.style.left = `${coinLeft}px`;
  } else {
    collectCoin();
  }
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

  return { left: randomX, top: randomY };
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

  score = 0;
  timeRemaining = 30;
  updateScore();
  updateTimer();

  character.style.top = "50%";
  character.style.left = "50%";
}

function initGame() {
  scoreContainer.style.width = `${gameContainer.offsetWidth}px`;

  startTimer();
  updateHighestScore();
}

initGame();
