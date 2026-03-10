export function initSnake(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const box = 20;
    let score = 0;
    let snake = [{ x: 9 * box, y: 10 * box }];
    let food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    };
    let d;

    document.addEventListener("keydown", direction);

    function direction(event) {
        if(event.keyCode == 37 && d != "RIGHT") d = "LEFT";
        else if(event.keyCode == 38 && d != "DOWN") d = "UP";
        else if(event.keyCode == 39 && d != "LEFT") d = "RIGHT";
        else if(event.keyCode == 40 && d != "UP") d = "DOWN";
    }

    function draw() {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ff00ea";
        ctx.font = "20px Arial";
        ctx.fillText("†", food.x, food.y + box);

        for(let i = 0; i < snake.length; i++) {
            ctx.fillStyle = (i == 0) ? "#ffffff" : "#333";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
            ctx.strokeStyle = "#000";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if( d == "LEFT") snakeX -= box;
        if( d == "UP") snakeY -= box;
        if( d == "RIGHT") snakeX += box;
        if( d == "DOWN") snakeY += box;

        if(snakeX == food.x && snakeY == food.y) {
            score++;
            food = {
                x: Math.floor(Math.random() * 19 + 1) * box,
                y: Math.floor(Math.random() * 19 + 1) * box
            };
        } else {
            snake.pop();
        }

        let newHead = { x: snakeX, y: snakeY };

        if(snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
            clearInterval(game);
            ctx.fillStyle = "white";
            ctx.fillText("DATA CORRUPTED", 120, 200);
        }

        snake.unshift(newHead);
    }

    function collision(head, array) {
        for(let i = 0; i < array.length; i++) {
            if(head.x == array[i].x && head.y == array[i].y) return true;
        }
        return false;
    }

    let game = setInterval(draw, 100);
}