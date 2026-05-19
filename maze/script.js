import { downloadFile } from '../modules/Download.js';
import { sendNotification } from '../modules/TGbot.js';

const mazeSize = 45; 
const container = document.getElementById('maze-container');
let maze = [];
let playerPos = { x: 0, y: 0 };
const goalPos = { x: mazeSize - 1, y: mazeSize - 1 };

const SECRET_PASSWORD = "VOID";

// Логика входа
document.getElementById('pass-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const input = this.value.toUpperCase();
        const overlay = document.getElementById('password-overlay');
        const error = document.getElementById('pass-error');

        if (input === SECRET_PASSWORD) {
            overlay.style.display = 'none';
            console.log("ACCESS GRANTED");
        } else {
            error.style.display = 'block';
            this.value = '';
            document.querySelector('.login-box').style.animation = 'shake 0.2s 3';
            setTimeout(() => {
                document.querySelector('.login-box').style.animation = '';
            }, 500);
        }
    }
});

function init() {
    document.body.style.backgroundColor = '#fff';
    setTimeout(() => {
        document.body.style.backgroundColor = '#050505';
    }, 100);

    maze = Array(mazeSize).fill(null).map(() => Array(mazeSize).fill(1));
    generatePath(0, 0);
    
    maze[mazeSize - 1][mazeSize - 1] = 0;
    maze[mazeSize - 1][mazeSize - 2] = 0;
    maze[mazeSize - 2][mazeSize - 1] = 0;

    addTraps();
    render();
}

function generatePath(cx, cy) {
    maze[cy][cx] = 0;
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]].sort(() => Math.random() - 0.5);

    for (let [dx, dy] of directions) {
        let nx = cx + dx * 2;
        let ny = cy + dy * 2;
        if (nx >= 0 && nx < mazeSize && ny >= 0 && ny < mazeSize && maze[ny][nx] === 1) {
            maze[cy + dy][cx + dx] = 0;
            generatePath(nx, ny);
        }
    }
}

function addTraps() {
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            if (maze[y][x] === 0) {
                const isStart = (x === 0 && y === 0);
                const isGoal = (x === goalPos.x && y === goalPos.y);
                if (!isStart && !isGoal) {
                    let wallCount = 0;
                    const neighbors = [{ dx: 0, dy: 1 }, { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: -1, dy: 0 }];
                    neighbors.forEach(dir => {
                        let nx = x + dir.dx;
                        let ny = y + dir.dy;
                        if (nx < 0 || nx >= mazeSize || ny < 0 || ny >= mazeSize || maze[ny][nx] === 1) wallCount++;
                    });
                    if (wallCount >= 3 && Math.random() < 0.8) maze[y][x] = 2; 
                }
            }
        }
    }
}

function render() {
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${mazeSize}, 1fr)`;
    const fragment = document.createDocumentFragment();
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `c-${x}-${y}`;
            if (maze[y][x] === 1) cell.classList.add('wall-data');
            if (maze[y][x] === 2) cell.classList.add('trap-data');
            if (x === playerPos.x && y === playerPos.y) cell.classList.add('player');
            if (x === goalPos.x && y === goalPos.y) cell.classList.add('goal');
            fragment.appendChild(cell);
        }
    }
    container.appendChild(fragment);
}

function move(dx, dy) {
    let nx = playerPos.x + dx;
    let ny = playerPos.y + dy;

    if (nx >= 0 && nx < mazeSize && ny >= 0 && ny < mazeSize) {
        const cellType = maze[ny][nx];
        if (cellType === 1) {
            document.getElementById(`c-${nx}-${ny}`).classList.add('wall-hit');
            return;
        }
        if (cellType === 2) {
            document.getElementById(`c-${nx}-${ny}`).classList.add('trap-hit');
            setTimeout(() => {
                alert("FIREWALL BREACHED! Переподключение к узлу...");
                playerPos = { x: 0, y: 0 }; 
                updatePlayerUI(); 
            }, 100);
            return;
        }

        playerPos.x = nx;
        playerPos.y = ny;
        document.getElementById(`c-${nx}-${ny}`).classList.add('visited');
        
        if (playerPos.x === goalPos.x && playerPos.y === goalPos.y) {
            handleVictory();
        }
    }
    updatePlayerUI();
}

// Финальная логика победы
function handleVictory() {
    alert("ГРАФИТ: 'Частота затихает... Я стер их локальные дампы, но Zepta Group уже начала эвакуацию данных. Забирай код и беги, пока сектор B-12 не ушел в изоляцию.'");
    
    const finalCode = "STATUS_DECODED_BY_FLAYER_666";
    const blob = new Blob([finalCode], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FINAL_SEQUENCE.txt'; 
    document.body.appendChild(a);
    a.click();

    sendNotification("Пользователь извлек финальный код и завершил лабиринт.");
    
    setTimeout(() => {
        window.location.href = '../app/index.html?status=critical_shutdown';
    }, 1000);я
}

function updatePlayerUI() {
    document.querySelectorAll('.player').forEach(el => el.classList.remove('player'));
    const current = document.getElementById(`c-${playerPos.x}-${playerPos.y}`);
    if (current) current.classList.add('player');
}

window.addEventListener('keydown', (e) => {
    const keys = { 'ArrowUp': [0,-1], 'ArrowDown': [0,1], 'ArrowLeft': [-1,0], 'ArrowRight': [1,0] };
    if (keys[e.key]) move(...keys[e.key]);
});

init();