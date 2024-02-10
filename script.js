const body = document.querySelector("body");
const gameContainer = document.getElementById("game");
const statsContainer = document.getElementById("stats");
const startBtn = document.getElementById("startBtn");
const againBtn = document.getElementById("againBtn");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

let firstTarget;
let secondTarget;
let clickCounter = 0;
let score = 0;
let startTime;
let quickestSolve = Infinity;
let quickestSolveSeconds;
let quickestSolveMinutes;

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  if (event.target.classList[1] !== "clicked"){
    if (clickCounter == 0) {
      event.target.style.backgroundColor = event.target.classList[0];
      event.target.classList.add("clicked");
      firstTarget = event.target;
      clickCounter++;
    } else if (clickCounter == 1) {
      event.target.style.backgroundColor = event.target.classList[0];
      event.target.classList.add("clicked");
      secondTarget = event.target;
      clickCounter++;
      matchCheck();
    }
  }
}

function matchCheck() {
  if (firstTarget.classList[0] === secondTarget.classList[0]) {
    score += 200;
    scoreText.innerText = "Score: " + score;
    clickCounter = 0;
    if (score === 1000){
      let solveTime = Math.floor((Date.now() - startTime)/1000);
      if (solveTime < quickestSolve) {
        localStorage.setItem("quickestSolve", solveTime);
        quickestSolve = solveTime;
        quickestSolveMinutes = Math.floor(quickestSolve/60);
        quickestSolveSeconds = quickestSolve - quickestSolveMinutes * 60;
        if (quickestSolveMinutes === 0){
          quickestSolveText.innerText = "Quickest Solve: " + quickestSolveSeconds+ " seconds";
        } else {
          quickestSolveText.innerText = "Quickest Solve: " + quickestSolveMinutes + " minutes and " + quickestSolveSeconds + " seconds";
        }
      }
      againBtn.removeAttribute("hidden");
    }
  } else {
    setTimeout(function() {
      firstTarget.style.backgroundColor = body.style.backgroundColor;
      secondTarget.style.backgroundColor = body.style.backgroundColor;
      firstTarget.classList.remove("clicked");
      secondTarget.classList.remove("clicked");
      clickCounter = 0;
    }, 1000)
  }
}

// when the DOM loads
createDivsForColors(shuffledColors);

const scoreText = document.createElement("p");
scoreText.innerText = "Score: 0";
statsContainer.append(scoreText);

const quickestSolveText = document.createElement("p");
if (localStorage.getItem("quickestSolve") === null) {
  quickestSolveText.innerText = "Quickest Solve: 99 minutes and 99 seconds";
} else {
  quickestSolve = Number(localStorage.getItem("quickestSolve"))
  if (quickestSolve >= 6000) {
    quickestSolveText.innerText = "Quickest Solve: 99 minutes and 99 seconds";
  } else {
    quickestSolveMinutes = Math.floor(quickestSolve/60);
    quickestSolveSeconds = quickestSolve - quickestSolveMinutes * 60;
    if (quickestSolveMinutes === 0){
      quickestSolveText.innerText = "Quickest Solve: " + quickestSolveSeconds+ " seconds";
    } else {
      quickestSolveText.innerText = "Quickest Solve: " + quickestSolveMinutes + " minutes and " + quickestSolveSeconds + " seconds";
    }
  }
}
statsContainer.append(quickestSolveText);

gameContainer.setAttribute("hidden","");

function gameStart () {
  gameContainer.removeAttribute("hidden");
  startBtn.setAttribute("hidden","");
  startTime = Date.now();
}

function playAgain() {
  while (gameContainer.firstChild) {
    gameContainer.removeChild(gameContainer.firstChild);
  }
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  score = 0;
  scoreText.innerText = "Score: 0";
  againBtn.setAttribute("hidden","");
}