// Функция открытия/закрытия
function toggleWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    
    if (win.style.display === 'block') {
        win.style.display = 'none';
    } else {
        win.style.display = 'block';
        // При открытии выносим окно на передний план
        bringToFront(win);
    }
}

function bringToFront(win) {
    document.querySelectorAll('.window').forEach(w => w.style.zIndex = "5");
    win.style.zIndex = "100";
}

// Усовершенствованная логика перетаскивания для ВСЕХ окон
function makeDraggable() {
    document.querySelectorAll('.window').forEach(win => {
        const header = win.querySelector('.window-header');
        
        header.onmousedown = function(e) {
            bringToFront(win);
            
            let shiftX = e.clientX - win.getBoundingClientRect().left;
            let shiftY = e.clientY - win.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                win.style.left = pageX - shiftX + 'px';
                win.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(e) {
                moveAt(e.pageX, e.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            document.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                document.onmouseup = null;
            };
        };

        header.ondragstart = function() {
            return false;
        };
    });
}

const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

terminalInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const command = this.value.toLowerCase().trim();
        const p = document.createElement('p');
        p.textContent = "> " + this.value;
        p.style.color = "#555";
        terminalOutput.appendChild(p);

        // ЛОГИКА КОМАНД
        let response = "";
        switch(command) {
            case 'help':
                response = "Доступные команды: help, whoami, contemptum.exe, status, cls, exit.";
                break;
        case 'exit':
            const output = document.getElementById('terminal-output');
            const p = document.createElement('p');
            p.innerHTML = "> ИНИЦИАЛИЗАЦИЯ ВЫХОДА... <span style='color: #ff00ea;'>[СВЯЗЬ РАЗОРВАНА]</span>";
            output.appendChild(p);

            setTimeout(() => {
                document.body.style.transition = "all 0.5s ease";
                document.body.style.filter = "brightness(0) contrast(2)";
                document.body.style.transform = "scaleY(0.01)";
        
                setTimeout(() => {
                    window.location.href = "../index.html"; 
                }, 500);
            }, 1000);
            break;
            case 'whoami':
                response = "РАНГ: Aspicite. ТВОЙ ГРЕХ: Любопытство.";
                break;
            case 'status':
                response = "СОСТОЯНИЕ: Код чист. Вера сильна. Глаз плачет.";
                break;
            case 'contemptum.exe':
                response = "ОШИБКА: Требуется ключ с физического носителя.(USB-накопитель)";
                break;
            case 'cls':
                terminalOutput.innerHTML = "";
                this.value = "";
                return;
            default:
                response = "КОМАНДА '" + command + "' НЕ НАЙДЕНА. ТЬМА ПОГЛОТИЛА ВВОД.";
        }

        const respP = document.createElement('p');
        respP.textContent = response;
        terminalOutput.appendChild(respP);
        
        document.getElementById('terminal-body').scrollTop = document.getElementById('terminal-body').scrollHeight;
        
        this.value = "";
    }
});

function checkKey(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result.trim();
        const secretWindow = document.getElementById('window-secret');
        
        // ВАЖНО: Убедись, что фраза совпадает символ в символ!
        if (content === "STATUS_DECODED_BY_FLAYER_666") {
            console.log("Ключ верен"); // Для отладки (F12)
            
            // Принудительно открываем и выводим наверх
            secretWindow.style.display = 'block';
            secretWindow.style.zIndex = '999'; 
            secretWindow.style.top = '150px';
            secretWindow.style.left = '150px';
            
            // Вызываем функцию перетаскивания еще раз, чтобы новое окно "ожило"
            if (typeof makeDraggable === "function") makeDraggable();
            
        } else {
            alert("ОШИБКА: Файл поврежден или содержит неверную подпись.");
        }
    };
    
    reader.readAsText(file);
    // Сбрасываем инпут, чтобы можно было загрузить тот же файл еще раз
    input.value = ""; 
}

function executeExitSequence() {
    const termInput = document.getElementById('terminal-input');
    termInput.disabled = true; // Блокируем ввод

    // 1. Эффект "схлопывания" экрана через CSS фильтры
    setTimeout(() => {
        document.body.style.transition = "all 0.8s cubic-bezier(0.11, 0, 0.5, 0)";
        document.body.style.filter = "brightness(5) contrast(3) grayscale(1)";
        document.body.style.transform = "scaleY(0.005) scaleX(1.2)";
        document.body.style.background = "#fff";
    }, 500);

    // 2. Полное исчезновение
    setTimeout(() => {
        document.body.style.opacity = "0";
    }, 1200);

    // 3. Возврат в реальность
    setTimeout(() => {
        // Если используешь C# WebView, это подаст сигнал программе закрыться
        if (window.chrome && window.chrome.webview) {
            window.chrome.webview.postMessage("close_window");
        } else {
            // Если это просто браузер — имитируем конец сессии
            document.body.innerHTML = "<div style='color:white; font-family:monospace; padding:20px;'>C:\> _</div>";
            document.body.style.filter = "none";
            document.body.style.transform = "none";
            document.body.style.opacity = "1";
            document.body.style.background = "#000";
        }
    }, 1500);
}



// Запускаем регистрацию окон после загрузки страницы
window.onload = makeDraggable;