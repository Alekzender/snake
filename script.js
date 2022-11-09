const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const cellSize = 20;
const canvasWidth = canvas.width = 800;
const canvasHeight = canvas.height = 600;
const maxCellX = canvasWidth / cellSize;
const maxCellY = canvasHeight / cellSize;
let stepInterval;

const initialStepDelay = 200;
const stepDelayFactor = 10;
const minStepDelay = 50;
let stepDelay = initialStepDelay;
let nextDx = 0;
let nextDy = 0;
const obstacles = [
    { x: 10, y: 10, },
    { x: 10, y: 11, },
    { x: 10, y: 12, },
    { x: 10, y: 13, },
    { x: 10, y: 14, },
    { x: 10, y: 15, },
    { x: 10, y: 17, },
    { x: 10, y: 18, },
    { x: 10, y: 19, },
    { x: 10, y: 20, },
    { x: 10, y: 21, },
    { x: 10, y: 22, },
]
const totalFreeCells = maxCellX * maxCellY - obstacles.length

const snakeBluprint = {
    dx: 1,
    dy: 0,
    body: [
        {
            x: maxCellX / 2,
            y: maxCellY / 2,
        },
    ],
}

let snake = JSON.parse(JSON.stringify(snakeBluprint));

let apple = randomizeApple();

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * cellSize + 1, apple.y * cellSize + 1, cellSize - 2, cellSize - 2);
    
    ctx.fillStyle = 'green';
    snake.body.forEach(cell => {
        ctx.fillRect(cell.x * cellSize + 1, cell.y * cellSize + 1, cellSize - 2, cellSize - 2);
    });

    ctx.fillStyle = 'gray';
    obstacles.forEach(cell => {
        ctx.fillRect(cell.x * cellSize + 1, cell.y * cellSize + 1, cellSize - 2, cellSize - 2);
    });
}

function update() {
    const {x, y} = snake.body[snake.body.length - 1];
    for (let i = snake.body.length - 1; i > 0; i--) {
        snake.body[i].x = snake.body[i - 1].x
        snake.body[i].y = snake.body[i - 1].y
    }
    const head = snake.body[0];
    head.x += snake.dx;
    head.y += snake.dy;
    const hasIntersection = snake.body.some((cell, index) => {
        if (index === 0) {
            return false;
        }

        return head.x === cell.x && head.y === cell.y
    });

    const hitWall = head.x < 0 || head.x >= maxCellX || head.y < 0 || head.y >= maxCellY;
    const hitObstacles = obstacles.some(el => el.x === head.x && el.y === head.y)

    if (hasIntersection || hitWall || hitObstacles) {
        alert('Game over');
        reset();
    }
    if (head.x === apple.x && head.y === apple.y) {
        snake.body.push({x, y})
        if (snake.body.length >= totalFreeCells ) {
            alert('You win');
            reset();
        }
        apple = randomizeApple();
        if (stepDelay > minStepDelay) {
            stepDelay -= stepDelayFactor;
            animate();
        }
    }
}

function animate() {
    if (stepInterval) {
        clearInterval(stepInterval)
    }
    stepInterval = setInterval(() => {
        snake.dx = nextDx;
        snake.dy = nextDy;
        update();
        draw();
    }, stepDelay)
}

function randomizeApple() {
    let result;
    let intersectsBody;
    let intersectsObstacles;
    do {
        result = {
            x: Math.floor(Math.random() * maxCellX),
            y: Math.floor(Math.random() * maxCellY),
        }
        intersectsBody = snake.body.some(el => el.x === result.x && el.y === result.y);
        intersectsObstacles = obstacles.some(el => el.x === result.x && el.y === result.y);
    } while(intersectsBody || intersectsObstacles)

    return result;
}

function reset() {
    stepDelay = initialStepDelay;
    nextDx = nextDy = 0;
    snake = JSON.parse(JSON.stringify(snakeBluprint))
    randomizeApple();
}

animate();

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && snake.dy !== 1) {
        nextDx = 0;
        nextDy = -1;

        return
    }

    if (e.key === 'ArrowDown' && snake.dy !== -1) {
        nextDx = 0;
        nextDy = 1;

        return
    }

    if (e.key === 'ArrowLeft' && snake.dx !== 1) {
        nextDx = -1;
        nextDy = 0;

        return
    }

    if (e.key === 'ArrowRight' && snake.dx !== -1) {
        nextDx = 1;
        nextDy = 0;

        return
    }
})