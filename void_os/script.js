function toggleWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    
    if (win.style.display === 'block') {
        win.style.display = 'none';
    } else {
        win.style.display = 'block';
        bringToFront(win);
    }
}

function bringToFront(win) {
    document.querySelectorAll('.window').forEach(w => w.style.zIndex = "5");
    win.style.zIndex = "100";
}

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
            const out = document.getElementById('terminal-output');
            const msg = document.createElement('p');
            msg.innerHTML = "> ИНИЦИАЛИЗАЦИЯ ВЫХОДА... <br>> <span style='color: #ff00ea;'>[ИЗВЛЕЧЕНИЕ ДАННЫХ В ФИЗИЧЕСКУЮ ПАМЯТЬ]</span>";
            out.appendChild(msg);

            try {
                const secretContent = "ОТЧЕТ ОБЪЕКТА: #666\n---------------------------\nСТАТУС: ДЕСКРИПТОР ПУСТОТЫ ОТКЛЮЧЕН ОТ ЯДРА\n\nВНИМАНИЕ.НАЙДЕНО ПОСЛАНИЕ ОТ ДЕСКРИПТОРА\nНЕ ВНИКАЙ СЛИШКОМ СИЛЬНО В БЕЗДНУ, ОНИ СМОТРЯТ...";
                const blob = new Blob([secretContent], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'RECOVERED_LOG.txt';
                document.body.appendChild(a);
                a.click();
        
                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }, 100);
            } catch (err) {
                console.error("Ошибка скачивания:", err);
            }

    setTimeout(() => {
        document.body.style.transition = "all 0.5s ease";
        document.body.style.filter = "brightness(0) contrast(2) grayscale(1)";
        document.body.style.transform = "scaleY(0.01)";
        
        setTimeout(() => {
            window.location.href = "../index.html?from=void"; 
        }, 600);
    }, 2000); 
    break;
            case 'whoami':
                response = "РАНГ: Aspicite. ТВОЙ ГРЕХ: Любопытство.";
                break;
            case 'status':
                response = "СОСТОЯНИЕ: Код верен. Дескриптор пустоты покинул нас. Регрессия не обратима.";
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
        
        if (content === "STATUS_DECODED_BY_FLAYER_666") {
            
            secretWindow.style.display = 'block';
            secretWindow.style.zIndex = '999'; 
            secretWindow.style.top = '150px';
            secretWindow.style.left = '150px';
            
            if (typeof makeDraggable === "function") makeDraggable();
            
        } else {
            alert("ОШИБКА: Файл поврежден или содержит ложную печать");
        }
    };

    
    
    reader.readAsText(file);
    input.value = ""; 
}

function executeExitSequence() {
    const termInput = document.getElementById('terminal-input');
    termInput.disabled = true;

    setTimeout(() => {
        document.body.style.transition = "all 0.8s cubic-bezier(0.11, 0, 0.5, 0)";
        document.body.style.filter = "brightness(5) contrast(3) grayscale(1)";
        document.body.style.transform = "scaleY(0.005) scaleX(1.2)";
        document.body.style.background = "#fff";
    }, 500);

    setTimeout(() => {
        document.body.style.opacity = "0";
    }, 1200);

    setTimeout(() => {
        if (window.chrome && window.chrome.webview) {
            window.chrome.webview.postMessage("close_window");
        } else {
            document.body.innerHTML = "<div style='color:white; font-family:monospace; padding:20px;'>C:\> _</div>";
            document.body.style.filter = "none";
            document.body.style.transform = "none";
            document.body.style.opacity = "1";
            document.body.style.background = "#000";
        }
    }, 1500);
}


window.checkKey = checkKey;
window.onload = makeDraggable;