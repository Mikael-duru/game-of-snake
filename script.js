const gameBoard = document.querySelector("#gameBoard");
const gameContext = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");

// get the game board width and height in DOM.
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

// Utility styles for the game
const boardBgColor = "#fff";
const snakeBody = "green";
const snakeBorder = "#212121";
const foodColor = "red";
const unitSize = 25; //size of everything within the game

let running = false;
let xVelocity = unitSize; // movement along the x axis (left or right);
let yVelocity = 0; // movement along the y axis (top or bottom);
let foodX;
let foodY;
let score = 0;

// snake body parts, grows when it eats.
let snake = [
  {x:unitSize * 2, y:0},
  {x:unitSize, y:0},
  {x:0, y:0},
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart(){
  running = true;
  scoreText.textContent = score;
  createFood();
  drawFood();
  nextTick();
};

function nextTick(){
  if(running){
    setTimeout(() => {
      clearBoard();
      drawFood();
      updateSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, 100)
  }
  else {
    displayGameOver();
  }
};

// clears the board
function clearBoard(){
  gameContext.fillStyle = boardBgColor;
  gameContext.fillRect(0, 0, gameWidth, gameHeight)
};

// places the food randomly on the board.
function createFood(){
  function randomFood(min,max){
    const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;

    return randNum;
  }
  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameWidth - unitSize);
};

function drawFood(){
  gameContext.fillStyle = foodColor;
  gameContext.fillRect(foodX, foodY, unitSize, unitSize);
};

// snake grows when it eats
function updateSnake(){
  const head = {
    x: snake[0].x + xVelocity,
    y: snake[0].y + yVelocity
  };

  // snake growth
  snake.unshift(head);

  if(snake[0].x === foodX && snake[0].y === foodY){
    score++;
    scoreText.textContent = score;
    createFood();
  }
  else{
    snake.pop();
  }
};

function drawSnake(){
  gameContext.fillStyle = snakeBody;
  gameContext.strokeStyle = snakeBorder;
  snake.forEach(snakePart => {
    gameContext.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    gameContext.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  })
};

function changeDirection(e){
  // get codes of key pressed 
  const keyPressed = e.keyCode;

  // store key codes of direction-arrow keys
  const arrowLeft = 37;
  const arrowUp = 38;
  const arrowRight = 39;
  const arrowDown = 40;

  const goingLeft = (xVelocity === -unitSize);
  const goingUp = (yVelocity === -unitSize);
  const goingRight = (xVelocity === unitSize);
  const goingDown = (yVelocity === unitSize);

  switch(true){
    case(keyPressed === arrowLeft && !goingRight):
      xVelocity = -unitSize;
      yVelocity = 0;
      break
    case(keyPressed === arrowUp && !goingDown):
      xVelocity = 0;
      yVelocity = -unitSize;
      break
    case(keyPressed === arrowRight && !goingLeft):
      xVelocity = unitSize;
      yVelocity = 0;
      break
    case(keyPressed === arrowDown && !goingUp):
      xVelocity = 0;
      yVelocity = unitSize;
      break
  }
};

function checkGameOver(){
  switch(true){
    case(snake[0].x < 0):
      running = false;
      break;
    case(snake[0].x >= gameWidth):
      running = false;
      break;
    case(snake[0].y < 0):
      running = false;
      break;
    case(snake[0].y >= gameHeight):
      running = false;
      break;
  }

  // iterating the snake parts excluding the head  
  for(let i = 1; i < snake.length; i++){
    // if the head touches its body parts, game ends
    if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
      running = false;
    }
  }
};

function displayGameOver(){
  gameContext.font = "50px Shantell Sans";
  gameContext.fillStyle = "#000";
  gameContext.textAlign = "center";
  gameContext.fillText("GAME OVER", gameWidth / 2, gameHeight / 2);
  running = false
};

function resetGame(){
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;
  snake =[
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0},
  ];
  gameStart();
};

