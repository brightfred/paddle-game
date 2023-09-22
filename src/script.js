// DOM selectors
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const rulesModal = document.getElementById('rulesModal');
const closeModal = document.querySelector('.close');

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
document.addEventListener('mousemove', mouseMove);

// Mousemove event handler
function mouseMove(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
    }
}

// Keyboard event handlers
function keyDown(e) {
    if (e.key === 'Right' || e.key === 'd' || e.key === 'D') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'Left' || e.key === 'a' || e.key === 'A') {
        paddle.dx = -paddle.speed;
    }
}

function keyUp(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' || e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        paddle.dx = 0;
    }
}

// Game variables
let score = 0;
let lives = 3;

const paddleWidth = 100;
const paddleHeight = 10;
const paddle = {
    x: canvas.width / 2 - paddleWidth / 2,
    y: canvas.height - paddleHeight - 30,
    width: paddleWidth,
    height: paddleHeight,
    dx: 0,
    speed: 5,
    color: '#301934', // Dark Purple
};

const ballSize = 10;
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    speed: 4,
    dx: 4 * (Math.random() > 0.5 ? 1 : -1),
    dy: -4,
    color: '#301934', // Dark Purple
};

const brickInfo = {
    width: 70,
    height: 20,
    offsetX: 45,
    offsetY: 60,
    padding: 10,
    visible: true,
    color: '#FFD700', // Bumblebee Yellow
};
const brickRowCount = 9; // Updated to 5 rows
const brickColumnCount = 5; // Updated to 9 columns
const bricks = [];

for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.width + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.height + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = { x, y, ...brickInfo };
    }
}

// Move paddle
function movePaddle() {
    paddle.x += paddle.dx;

    if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
    }

    if (paddle.x < 0) {
        paddle.x = 0;
    }
}

// Move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }

    if (ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    if (
        ball.x + ball.size > paddle.x &&
        ball.x - ball.size < paddle.x + paddle.width &&
        ball.y + ball.size > paddle.y
    ) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.speed;
        }
    }

    bricks.forEach((column) => {
        column.forEach((brick) => {
            if (brick.visible) {
                if (
                    ball.x - ball.size > brick.x &&
                    ball.x + ball.size < brick.x + brick.width &&
                    ball.y + ball.size > brick.y &&
                    ball.y - ball.size < brick.y + brick.height
                ) {
                    ball.dy *= -1;
                    brick.visible = false;
                    increaseScore();
                }
            }
        });
    });

    if (ball.y + ball.size > canvas.height) {
        lives--;
        if (lives === 0) {
            gameOver();
        } else {
            resetBall();
        }
    }
}

function startGame() {
    resetBricks();
    resetBall();
    score = 0;
    lives = 3;
    update();
}

function increaseScore() {
    score++;

    if (score % (brickRowCount * brickColumnCount) === 0) {
        resetBricks();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = -4;
}

function resetBricks() {
    bricks.forEach((column) => {
        column.forEach((brick) => {
            brick.visible = true;
        });
    });
}

function gameOver() {
    alert('Game Over');
    document.location.reload();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.closePath();

    bricks.forEach((column) => {
        column.forEach((brick) => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.width, brick.height);
            ctx.fillStyle = brick.visible ? brick.color : 'transparent';
            ctx.fill();
            ctx.closePath();
        });
    });

    // Set the text color to dark purple for score and lives
    ctx.fillStyle = '#301934'; // Dark Purple
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
    ctx.fillText(`Lives: ${lives}`, 20, 30);
}

function update() {
    movePaddle();
    moveBall();
    draw();

    console.log('Update function is running');

    requestAnimationFrame(update);
}

startBtn.addEventListener('click', () => {
    startGame();
});

closeModal.addEventListener('click', () => {
    rulesModal.style.display = 'none';
});

// Start game
startGame();