import { downloadFile } from '../modules/Download.js';
import { sendNotification } from '../modules/TGbot.js';

const mazeSize = 45; 
const container = document.getElementById('maze-container');
let maze = [];
let playerPos = { x: 0, y: 0 };
const goalPos = { x: mazeSize - 1, y: mazeSize - 1 };

const SECRET_PASSWORD = "VOID"; // Твой пароль (можешь поменять на любой)

document.getElementById('pass-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const input = this.value.toUpperCase();
        const overlay = document.getElementById('password-overlay');
        const error = document.getElementById('pass-error');

        if (input === SECRET_PASSWORD) {
            // Пароль верный
            overlay.style.display = 'none';
            console.log("ACCESS GRANTED");
            // Здесь вызывается твоя функция init(), если она еще не запустилась
        } else {
            // Пароль неверный
            error.style.display = 'block';
            this.value = ''; // Очистить поле
            // Можно добавить эффект дрожания
            document.querySelector('.login-box').style.animation = 'shake 0.2s 3';
            setTimeout(() => {
                document.querySelector('.login-box').style.animation = '';
            }, 500);
        }
    }
});


function init() {
    // 1. Создаем сетку из стен
    maze = Array(mazeSize).fill(null).map(() => Array(mazeSize).fill(1));
    
    // 2. Генерация гарантированного пути (Recursive Backtracking)
    generatePath(0, 0);
    
    // 3. Гарантируем выход (пробиваем стенки у финиша)
    maze[mazeSize - 1][mazeSize - 1] = 0;
    maze[mazeSize - 1][mazeSize - 2] = 0;
    maze[mazeSize - 2][mazeSize - 1] = 0;

    // 4. Добавляем ловушки (только на пустые клетки)
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
            // Проверяем только пустые клетки (путь)
            if (maze[y][x] === 0) {
                const isStart = (x === 0 && y === 0);
                const isGoal = (x === goalPos.x && y === goalPos.y);

                if (!isStart && !isGoal) {
                    let wallCount = 0;
                    const neighbors = [
                        { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
                        { dx: 1, dy: 0 }, { dx: -1, dy: 0 }
                    ];

                    // Считаем стены вокруг текущей клетки
                    neighbors.forEach(dir => {
                        let nx = x + dir.dx;
                        let ny = y + dir.dy;
                        // Границы лабиринта тоже считаем как стены
                        if (nx < 0 || nx >= mazeSize || ny < 0 || ny >= mazeSize || maze[ny][nx] === 1) {
                            wallCount++;
                        }
                    });

                    // Если это тупик (3 стены и более), ставим ловушку с высоким шансом
                    if (wallCount >= 3) {
                        // Можно поставить 1.0, чтобы ловушки были во ВСЕХ тупиках
                        if (Math.random() < 0.8) { 
                            maze[y][x] = 2; 
                        }
                    }
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
            
            // Технические классы для отладки
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

        if (cellType === 1) { // СТЕНА
            document.getElementById(`c-${nx}-${ny}`).classList.add('wall-hit');
            return;
        }

        if (cellType === 2) { // ЛОВУШКА
            document.getElementById(`c-${nx}-${ny}`).classList.add('trap-hit');
            setTimeout(() => {
                alert("ОШИБКА: ЛОВУШКА АКТИВИРОВАНА. СБРОС ДАННЫХ...");
                hardReset();
            }, 100);
            return;
        }

        // ОБЫЧНЫЙ ПУТЬ
        playerPos.x = nx;
        playerPos.y = ny;
        document.getElementById(`c-${nx}-${ny}`).classList.add('visited');
        
        if (playerPos.x === goalPos.x && playerPos.y === goalPos.y) {
            alert("File extracted successfully");
            downloadFile("./R_database_log.txt");
            window.location.href = '../index.html';
            sendNotification("Пользователь успешно прошел лабиринт и получил файл R_database_log.txt");
        }
    }
    updatePlayerUI();
}

function hardReset() {
    playerPos = { x: 0, y: 0 };
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('visited', 'wall-hit', 'trap-hit', 'player');
    });
    document.getElementById(`c-0-0`).classList.add('player');
}

function updatePlayerUI() {
    document.querySelectorAll('.player').forEach(el => el.classList.remove('player'));
    const current = document.getElementById(`c-${playerPos.x}-${playerPos.y}`);
    if (current) current.classList.add('player');
}

window.addEventListener('keydown', (e) => {
    const keys = { 'ArrowUp': [0,-1], 'ArrowDown': [0,1], 'ArrowLeft': [-1,0], 'ArrowRight': [1,0] };
    if (keys[e.key]) move(...keys[e.key]);

    // ЧИТ-КОД ДЛЯ ТЕСТА (Клавиша V)
    if (e.code === 'KeyV') {
        // Подсветить стены темно-серым
        document.querySelectorAll('.wall-data').forEach(el => {
            el.style.backgroundColor = el.style.backgroundColor === 'rgb(34, 34, 34)' ? '' : '#222';
        });
        // Подсветить ловушки темно-красным
        document.querySelectorAll('.trap-data').forEach(el => {
            el.style.backgroundColor = el.style.backgroundColor === 'rgb(100, 0, 0)' ? '' : '#640000';
        });
    }
});

init();