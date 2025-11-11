// Game elements
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");

// Game settings
const boardWidth = gameBoard.width;
const boardHeight = gameBoard.height;
const unitSize = 20;

// Game variables
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;

// Snake
let snake = [
    {x: unitSize * 4, y: 0},
    {x: unitSize * 3, y: 0},
    {x: unitSize * 2, y: 0},
    {x: unitSize, y: 0},
    {x: 0, y: 0}
];

// Event listeners
window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

// Start the game
gameStart();

function gameStart() {
    running = true;
    scoreText.textContent = `Pontuação: ${score}`;
    createFood();
    nextTick();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 100);
    } else {
        displayGameOver();
    }
}

function clearBoard() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, boardWidth, boardHeight);
}

function createFood() {
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, boardWidth - unitSize);
    foodY = randomFood(0, boardHeight - unitSize);
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    };

    snake.unshift(head);

    // If food is eaten
    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 10;
        scoreText.textContent = `Pontuação: ${score}`;
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = "lime";
    ctx.strokeStyle = "darkgreen";
    
    snake.forEach((snakePart, index) => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
        
        // Draw eyes on the head
        if (index === 0) {
            ctx.fillStyle = "white";
            // Left eye
            ctx.fillRect(snakePart.x + 5, snakePart.y + 5, 4, 4);
            // Right eye
            ctx.fillRect(snakePart.x + 11, snakePart.y + 5, 4, 4);
            ctx.fillStyle = "lime";
        }
    });
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity === -unitSize);
    const goingDown = (yVelocity === unitSize);
    const goingRight = (xVelocity === unitSize);
    const goingLeft = (xVelocity === -unitSize);

    switch(true) {
        case (keyPressed === LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case (keyPressed === RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
}

function checkGameOver() {
    // Check wall collision
    if (snake[0].x < 0 || 
        snake[0].x >= boardWidth || 
        snake[0].y < 0 || 
        snake[0].y >= boardHeight) {
        running = false;
        return;
    }

    // Check self collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            running = false;
            return;
        }
    }
}

function displayGameOver() {
    ctx.font = "50px 'Arial'";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("FIM DE JOGO!", boardWidth / 2, boardHeight / 2);
    
    ctx.font = "20px 'Arial'";
    ctx.fillText(`Pontuação Final: ${score}`, boardWidth / 2, boardHeight / 2 + 40);
}

function resetGame() {
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x: unitSize * 4, y: 0},
        {x: unitSize * 3, y: 0},
        {x: unitSize * 2, y: 0},
        {x: unitSize, y: 0},
        {x: 0, y: 0}
    ];
    
    // Clear any existing game over text
    clearBoard();
    gameStart();
}