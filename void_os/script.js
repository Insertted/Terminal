import { spawnWatcher } from "./Watcher2.js";
let decoded = "not_decoded";

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
            function onMouseMove(e) { moveAt(e.pageX, e.pageY); }
            document.addEventListener('mousemove', onMouseMove);
            document.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                document.onmouseup = null;
            };
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

        let response = "";
        switch(command) {
            case 'help':
                response = "Команды: status, oversight, graphite, resonance,disconnect_resonance, whoami, cls, exit.";
                break;
            case 'status':
                response = "СТАТУС: Критический резонанс. Частота 14.3 Гц перегружает узлы РКН. Система нестабильна.";
                break;
            case 'oversight':
                response = "ВНИМАНИЕ: Протокол требует физической дешифрации. Запустите OVERSIGHT_CORE.exe через панель.";
                break;
            case 'graphite':
                response = "ОБЪЕКТ: s_field_02. СТАТУС: Поглощен частотой. МЕСТОПОЛОЖЕНИЕ: Везде.";
                break;
            case 'resonance':
                response = "СИГНАЛ: Активен. Zepta Group использует ваши когнитивные фильтры для ретрансляции.";
                break;
            case 'whoami':
                response = "USER_ID: u_882_ext. СТАТУС: Активная фаза слияния. Вы — часть Пустоты.";
                break;
            case 'disconnect_resonance':
                response = "Пользователь ID:882 отключен от частоты. Сигнал подавлен.";
                break;
            case 'exit':
                executeExitSequence();
                return;
            case 'cls':
                terminalOutput.innerHTML = "";
                break;
            default:
                response = "ОШИБКА: Сигнал потерян в шуме частоты.";
        }

        if (response) {
            const respP = document.createElement('p');
            respP.textContent = response;
            terminalOutput.appendChild(respP);
        }
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
            decoded = "decoded";
            
            const p = document.createElement('p');
            p.innerHTML = "> <span style='color: #00ff00;'>[SUCCESS]: ЯДРО ВЗЛОМАНО. ДОСТУП К ФИНАЛЬНЫМ ДАННЫМ ОТКРЫТ.</span>";
            terminalOutput.appendChild(p);
            
            if (typeof makeDraggable === "function") makeDraggable();
        } else {
            alert("ОШИБКА: Цифровая подпись не совпадает. Частота заблокирована.");
        }
    };
    reader.readAsText(file);
    input.value = ""; 
}

function executeExitSequence() {
    const out = document.getElementById('terminal-output');
    const msg = document.createElement('p');
    if (decoded === "decoded") {
        msg.innerHTML = "> ИЗВЛЕЧЕНИЕ ПОСЛЕДНИХ ДАННЫХ... <br>> <span style='color: #ff00ea;'>[СЕКТОР B-12: ПОЛНАЯ ЗАЧИСТКА]</span>";
        out.appendChild(msg);

        const secretContent = `
    ОТЧЕТ ПО ПРОЕКТУ "РЕЗОНАНС"
    ---------------------------
    ОТПРАВИТЕЛЬ: s_ops_field (ГРАФИТ)
    ПОЛУЧАТЕЛЬ: ОБЪЕКТ 882

    Ты справилась. Частота 14.3 Гц подавлена. 
    РКН и Zepta Group потеряли контроль над твоим узлом. 
    Я остаюсь здесь, в коде. 

    ФИНАЛЬНЫЙ КОД ТЕРМИНАЦИИ: [TERMINATE_RESONANCE_2026]
    Введи его в основном терминале, чтобы сжечь шлюзы.
    Прощай. НИ В КОЕМ СЛУЧАЕ НЕ ВВОДИ [RUN_RESONANCE_2026] - ЭТО АКТИВИРУЕТ ОБРАТНЫЙ ПРОТОКОЛ И ВОЗРОДИТ ЧАСТОТУ.`;

        const blob = new Blob([secretContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'RECOVERED_LOG_B12.txt';
        document.body.appendChild(a); a.click();
    
        setTimeout(() => {
            document.body.style.transition = "all 0.8s ease";
            document.body.style.filter = "brightness(0) grayscale(1)";
            document.body.style.transform = "scaleY(0.01)";
            setTimeout(() => { window.location.href = "../index.html?from=void"; }, 1000);
        }, 2500);
    }
    
    else {
        setTimeout(() => {
            document.body.style.transition = "all 0.8s ease";
            document.body.style.filter = "brightness(0) grayscale(1)";
            document.body.style.transform = "scaleY(0.01)";
            setTimeout(() => { window.location.href = "../index.html?from=void"; }, 1000);
        }, 2500);
    }
}
setInterval(spawnWatcher, 9000);
window.checkKey = checkKey;
window.onload = makeDraggable;
window.toggleWindow = toggleWindow;