const gridContainer = document.querySelector(".grid-container");
let cards = [];
let pickedCards = [];
let firstCard, secondCard;

let score = 0;
let timer = 60;
let timerRunning = false;
let countdown = null;
let sound = new Audio("./data/cardsound32562-37691.mp3");
let winSound = new Audio("./data/winSound.mp3");
let loseSound = new Audio("./data/losingSound.mp3");

document.querySelector(".score").textContent = score;

const timerDisplay = document.querySelector("#timer");

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
  });
  

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
    <div class="front">
    <img class="front-image" src=${card.image} />
    </div>
    <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}
function playSoundOnFlipCard(){

  sound.pause()
  sound.currentTime= 0;
  sound.play();

}

function flipCard(event) {
  if (!timerRunning) {
    startTimer();
  }
  if (pickedCards.length === 2) return;
  const clickedCard = event.currentTarget;
  console.log(clickedCard);
  const firstCard = pickedCards[0];
  if (clickedCard === firstCard) return;
  playSoundOnFlipCard()

  clickedCard.classList.add("flipped");
  pickedCards.push(clickedCard);
  if (pickedCards.length === 1) return;

  score++;
  if (checkForMatch(firstCard, clickedCard)) {
    pickedCards.forEach(disableCard);
    pickedCards = [];
  } else {
    setTimeout(() => {
      pickedCards.forEach(unflipCards);
      pickedCards = [];
    }, 1000);
  }
  document.querySelector(".score").textContent = score;

  checkGameWin();
}

function startTimer() {
  timerRunning = true;
  countdown = setInterval(function () {
    timer--;
    timerDisplay.textContent = `${timer}s`;
    if (timer === 0) {
      loseSound.play();
      clearInterval(countdown);
      loseDialog.show();
      restart();
    }
  }, 1000);
}

function checkForMatch(cardA, cardB) {
  let isMatch = cardA.dataset.name === cardB.dataset.name;

  return isMatch;
}

function disableCard(card) {
  card.removeEventListener("click", flipCard);
}
function checkGameWin() {
  const allCards = document.querySelectorAll(".card");
  const flippedCards = document.querySelectorAll(".flipped");

  if (flippedCards.length === allCards.length) {
    winSound.play();
    clearInterval(countdown);
    winDialog.showModal();
  }
}

function unflipCards(card) {
  card.classList.remove("flipped");
}

function restart() {
  pickedCards.forEach(unflipCards);
  pickedCards = [];
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  timer = 60;
  timerRunning = false;
  clearInterval(countdown);
  timerDisplay.textContent = `${timer}s`;

  generateCards();
}
const restartButton = document.getElementById("restart");
restartButton.addEventListener("click", restart);
