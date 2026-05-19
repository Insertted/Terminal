const history = document.getElementById('history');
const input = document.getElementById('cmd-input');
const terminal = document.getElementById('terminal');
const typerText = document.getElementById('typer-text');

const loaderFrames = ['/', '-', '\\', '|'];

let isAuth = false;
let curStep = 'system';
let currentUserData = null;
let tempLoginId = "";
let currentAccessLevel = 0;
const finalHorrorSound = new Audio('./app/final_aud/Muffled_Screams.mp3');
finalHorrorSound.volume = 0.07;

import { getDateTime } from "../modules/date.js";
import { readLogFile } from "../modules/Readlog.js";
import { downloadFile } from "../modules/Download.js";
import { triggerScreamer } from "../modules/screamer.js";
import { regdata } from "../modules/files.js";
import { getProgressBar } from "../modules/progress.js";
import { sendNotification } from "../modules/TGbot.js";
import { spawnWatcher } from "../modules/Watcher.js";
import { triggerRandomConnection, startRandomEvents } from "../modules/newConnection.js";
import { initNetmap } from "../modules/three-bg.js";

const logFiles = [
    { id: "01", name: "SYS_02.03_INIT_KERNEL", level: 1 },
    { id: "02", name: "NET_10.03_GATEWAY_ERR", level: 1 },
    { id: "03", name: "SRV_18.03_FS_CLEANUP", level: 1 },
    { id: "04", name: "SEC_25.03_MAIL_POLICY", level: 1 },
    { id: "05", name: "RKN_02.04_HARDWARE_INTEGRATION", level: 1 },
    { id: "06", name: "AUTH_05.04_RECOVERY_KEY", level: 1 }, // Пароль от Gmail тут
    { id: "07", name: "USER_20.04_PROVISIONING_882", level: 1 },
    { id: "08", name: "SIG_25.04_PHASE_SHIFT", level: 3 },
    { id: "09", name: "SRV_27.04_THERMAL_WARN", level: 3 },
    { id: "10", name: "SEC_28.04_OVERSIGHT_DEPLOY", level: 3 },
    { id: "11", name: "SIG_29.04_INCIDENT_REPORT", level: 3 },
    { id: "12", name: "USER_01.05_STATUS_882", level: 5 },
    { id: "13", name: "MAIL_03.05_SYNC_CRITICAL", level: 5 },
    { id: "14", name: "SYS_04.05_DATA_CORRUPTION", level: 5 },
    { id: "15", name: "VOID_05.05_RESONANCE_DATA", level: 5 },
    { id: "16", name: "SEC_06.05_GRAPHITE_MISSING", level: 5 },
    { id: "17", name: "SYS_07.05_WIPE_PROTOCOL", level: 5 },
    { id: "18", name: "NULL_08.05_TRACE_LOST", level: 5 },
    { id: "19", name: "OVERSIGHT_09.05_READY", level: 5 },
    { id: "20", name: "FINAL_10.05_SESSION_START", level: 5 }
];

// Приветсвенное сообщение
window.onload = async () => {
    input.blur();
    await showLoader(1500);
    const dateStr = getDateTime();
    await typeWriter(`Welcome to main Automated Antenna Communication Service.\\nYou re logged in as "Guest"\\n${dateStr}\\nYour IP address 127.1.1.0\\nType "help" for command list.`);
    input.focus();
}

async function runFinalSequence() {
    input.disabled = true;

    const lines = [
        ">>> ИНИЦИАЛИЗАЦИЯ ПРОТОКОЛА 'ОМЕГА'...",
        "Анализ частотного спектра: 14.3 Гц обнаружено.",
        "Поиск активных шлюзов РКН... Сектор B-12 найден.",
        "Запуск деструктивного резонанса... [OK]",
        "Подавление сигнала Zepta Group... [OK]",
        "ДЕАКТИВАЦИЯ УЗЛА 143... 100%",
        "---------------------------------------",
        "ВНИМАНИЕ: Обнаружен экстренный разрыв соединения.",
        "Статус цели 'ZEPTA': УХОД В ОФЛАЙН.",
        "Стирание следов присутствия завершено."
    ];

    for (let i = 0; i < lines.length; i++) {
        await new Promise(r => setTimeout(r, 600));
        const p = document.createElement('div');
        p.className = 'line';
        p.textContent = lines[i];
        if (i > 6) p.style.color = "#ff5555";
        history.appendChild(p);
        terminal.scrollTop = terminal.scrollHeight;
    }

    setTimeout(() => {
        document.body.style.transition = "all 4s ease";
        document.body.style.backgroundColor = "#050505";
        document.body.style.filter = "contrast(1.2) brightness(0.4) grayscale(0.8)";
        
        document.body.innerHTML = `
            <div style="color: #666; font-family: 'VCR', monospace; padding: 60px; line-height: 1.8; max-width: 800px; margin: 0 auto; background: #050505; height: 100vh;">
                <h2 style="color: #00ff00; border-bottom: 1px solid #333; padding-bottom: 10px;">СИСТЕМА ОЧИЩЕНА</h2>
                <p>> Резонанс 14.3 Гц подавлен. Сектор B-12 стабилизирован.</p>
                <br>
                <p style="color: #ccc;">Ты это сделала. Город больше не слышит этот шум. Ты победила систему.</p>
                <p>Но взгляни на дампы памяти: Zepta Group просто свернули проект и ушли в глубокое подполье.</p>
                <p>Они забрали все данные. Ты одна в пустом терминале. Пока что.</p>
                <br>
                <div style="margin-top: 50px; color: #222; font-size: 10px;">[КОНЕЦ ПЕРВОЙ ФАЗЫ. ZEPTA ГДЕ-ТО РЯДОМ.]</div>
            </div>
        `;
    }, 4000);
}


window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && window.isNetmapOpen) {
        e.preventDefault();
        
        const overlay = document.getElementById('netmap-overlay');
        overlay.classList.add('hidden');
        
        const container = document.getElementById('antenna-viewport');
        container.innerHTML = ''; 
        
        window.isNetmapOpen = false;
    }
});

//Скрытие пароля звездочками
input.addEventListener('input', () => {
    if (curStep === 'auth_password') {
        typerText.textContent = "*".repeat(input.value.length);
    } else {
        typerText.textContent = input.value;
    }
});

// Загрузчик "Палочка"
async function showLoader(duration = 1500) {
    const loaderLine = document.createElement('div');
    loaderLine.className = 'line';
    history.appendChild(loaderLine);

    let frame = 0;
    const interval = setInterval(() => {
        loaderLine.textContent = loaderFrames[frame];
        frame = (frame + 1) % loaderFrames.length;
    }, 190);

    await new Promise(resolve => setTimeout(resolve, duration));
    clearInterval(interval);
    loaderLine.remove();
}

const glitchChars = "█▓▒░#$/\\@¡¢£¤¥¦§¨©ª«¬®¯";

async function typeWriter(text, speed = 27) {
    const line = document.createElement('div');
    line.className = 'line';
    history.appendChild(line);

    for (let i = 0; i < text.length; i++) {
        let char = text.charAt(i);
        
        if (text.substring(i, i + 2) === '\\n') {
            line.appendChild(document.createElement('br'));
            i++;
            continue;
        }

        const span = document.createElement('span');
        line.appendChild(span);

        if (Math.random() > 0.99 && char !== ' ') {
            span.textContent = glitchChars[Math.floor(Math.random() * glitchChars.length)];

            setTimeout(() => {
                span.textContent = char;
                span.style.color = "";
                span.style.textShadow = "0 0 5px #55ff55";
                setTimeout(() => { span.style.textShadow = "none"; }, 100);
            }, 700 + Math.random() * 200); // Исправится через 1.0 - 1.5 сек

        } else {
            span.textContent = char;
        }
        
        if (typeof playKeyPress === 'function' && char !== ' ') playKeyPress();

        terminal.scrollTop = terminal.scrollHeight;
        await new Promise(res => setTimeout(res, speed));
    }
}

const watchPhrases = ["CAPTURING_BUFFER...", "SCANNING_RETINA...", "PULSE: NORMAL", "PACKET_SPOOF_DETECTED", "USER_STABLE"];

setInterval(spawnWatcher, 20000);

input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const val = input.value.trim();
        const raw = input.value;
        
        input.value = '';
        typerText.textContent = '';

        if (val === '' && curStep !== 'auth_password') return;

        const userLine = document.createElement('div');
        userLine.innerHTML = `<span style="color: #888;">AACS:\\> ${curStep === 'auth_password' ? '***' : raw}</span>`;
        history.appendChild(userLine);
        
        await showLoader(1000);

        if (curStep === 'auth_login') {
            tempLoginId = val.toLowerCase();
            await showLoader(1500);

            try {
                const response = await fetch('./files/db.json');
                const db = await response.json();

                if (db.users[tempLoginId]) {
                    currentUserData = db.users[tempLoginId];
                    curStep='auth_password';
                    await typeWriter('Waiting for password. . .');
                } else {
                    await typeWriter('USER NOT FOUND');
                    curStep = 'system';
                }
            } catch (err) {
                console.error(err);
                await typeWriter('DB_ACCESS_FAILED');
                curStep = 'system';
            }
            return;
        }
        else if (curStep === 'auth_password') {
            await showLoader(1500);

            if (currentUserData && val === currentUserData.pass) {
                curStep = 'system';
                isAuth = true;
                const dateStr = getDateTime();
        
                await typeWriter('ACCESS GRANTED\n');
                await showLoader(2000);
                history.innerHTML = '';
        
                await typeWriter(`Wel▓me to main Aű́▓͑omated Antenna Cő́▓͑nication Servi̋́e.\n${currentUserData.welcomeMsg}\n${dateStr}\nYour IP address 127.1.1.0\nType "help" for command list.`);
            } else {
                terminal.classList.add('glitch-error');
                await typeWriter('ACCESS_DENIED: INVALID_KEY');
                setTimeout(() => terminal.classList.remove('glitch-error'), 1000);
                curStep = 'system';
                currentUserData = null;
            }
            return;
        }
        else if (curStep === 'system') {

            const args = val.split(' ');
            const command = args[0].toLowerCase();

            const staticAudio = document.getElementById('static');
            if (staticAudio && staticAudio.paused) {
                staticAudio.play().catch(() => {}); 
            }

            if (command === 'play') {
                const track = args[1];
                const player = document.getElementById('player-audio');

                if (!track) {
                    await typeWriter('USAGE: PLAY [RECORD_NAME]');
                    return;
                }

                player.src = `audio/${track}.mp3`; 

                try {
                    await player.play();

                    const progressLine = document.createElement('div');
                    terminal.appendChild(progressLine);

                    const updateInterval = setInterval(() => {
                        if (!player.paused && !player.ended) {
                            let bar = getProgressBar(player.currentTime, player.duration);
                            if (Math.random() > 0.9) {
                                bar = bar.replace(/#/g, "X").replace(/-/g, "?");
                            };
                            progressLine.innerText = `PROGRESS: ${bar}`;
                        } else {
                            clearInterval(updateInterval);
                            if (player.ended) progressLine.innerText = "PLAYBACK COMPLETED";

                            setTimeout(() => {
                                progressLine.remove();
                            }, 2000)

                        }
                    }, 200);

                    await typeWriter(`PLAYING: ${track}.mp3 ...`)
                } catch (err) {
                    await typeWriter(`ERROR: RECORD "${track}" not found`);
                }
                return;
            }

            if (command === 'login') {
                if (isAuth) {
                    await typeWriter('You are already logged in.');
                } else {
                    curStep = 'auth_login';
                    await typeWriter('Enter user ID: ');
                }
                return;
            } 
            // --ОСНОВНЫЕ КОМАНДЫ--
            else if (command === 'help') {
                if (!isAuth) {
                    await typeWriter('Commands:\\n\\nLOGIN\\nSTATUS\\nNETMAP\\nREPORT\\nCLEAR');
                } else {
                    await typeWriter('Commands:\\n\\nLOGS\\nFILES\\nSTATUS\\nNETMAP\\nREPORT\\nLOGOUT\\nCLEAR');
                }
                return;
            } else if (command === '9js9891kdssz11s') {
                sendNotification('Person found a screamer');

                if (!isAuth) {
                    await triggerScreamer();
                    await showLoader(3000);
                    await typeWriter('test123');
                    await showLoader(2000);
                    await typeWriter("password: ▓̡̋́▓̍ͥ");
                    await showLoader(500);
                    await typeWriter('CRITICAL ERROR:CODE 0x42221045\\nUnable to load password.');
                    await showLoader(3000);
                    await typeWriter("console.log(pass);");
                    console.log('AACS:\> password: test123');
                }
                else {
                    await showLoader(100);
                }
                return;
            }
            if (command === 'log') {
                if (!isAuth) {
                    await typeWriter('ERROR: AUTHENTICATION REQUIRED.');
                    return;
                }

                const fileNameInput = args[1]; 
                if (!fileNameInput) {
                    await typeWriter('USAGE: log [ID/FILENAME]');
                    return;
                }

                let targetFile = null;

                const fileIndex = parseInt(fileNameInput) - 1;
                if (!isNaN(fileIndex) && logFiles[fileIndex]) {
                    targetFile = logFiles[fileIndex];
                } else {
                    const cleanInput = fileNameInput.replace('.txt', '');
                    targetFile = logFiles.find(f => f.name === cleanInput);
                }

                if (!targetFile) {
                    await typeWriter(`ERROR: LOG FILE "${fileNameInput}" NOT FOUND.`);
                    return;
                }

                if (targetFile.level > currentUserData.clearance) {
                    await typeWriter(`ACCESS DENIED: CLEARANCE LEVEL ${targetFile.level} REQUIRED.`);
                    await typeWriter(`YOUR ACCESS LEVEL: ${currentUserData.clearance}`);
                    return;
                }

                await showLoader(1200); 
                try {
                    const content = await readLogFile(targetFile.name + '.txt');
                    await typeWriter(content);
                } catch (err) {
                    await typeWriter('ERROR: SYSTEM UNABLE TO READ PHYSICAL FILE.');
                }
                return;
            }
            if (command === 'logs') {
                if (!isAuth) {
                    await typeWriter('ACCESS DENIED');
                } else {
                    await showLoader(1000);
                    let list = 'AVAILABLE LOGS:\\n\\n';
                    logFiles.forEach(f => {
                        if (f.level <= currentUserData.clearance) {
                            list += `${f.id}. ${f.name}\\n`;
                        }
                    });
                    list += '\\nType "log [ID]" to read.';
                    await typeWriter(list);
                }
                return;
            }
            else if (command === 'status') {
                await typeWriter('Runing system diagnostics. . .');
                await showLoader(3500);
                let statusMsg = '\\nTerminal [version 5.9.0.1]\\n\\nServer_connection................OK\\nAntenna_translators..............OK\\nSub_systems......................OK\\n\\nChecking power lines. . .\\n1/3...............................OK\\n2/3...............................OK\\n3/3............................ERROR';
                if (isAuth) {
                    statusMsg += '\\n\\nSERVERS LOAD: LOW [26312/165400]';
                }
                statusMsg += '\\nStatus: POWER OUTAGES';
                await typeWriter(statusMsg);
                await typeWriter('Run FT diagnostic?\\n[Y/N]')
                const ft_status = async(e) => {
                    e.preventDefault();
                if (e.key.toLowerCase() === 'y') {
                    window.removeEventListener('keydown', ft_status);
                    await showLoader(100);
                    await typeWriter('Y');
                    await showLoader(1000);
                    await typeWriter('FT diagnostic [version 5.9.0.1a]\\n\\nServer_MSC...........OK\\nServer_PTB............OK\\nServerNSK..............ERROR\\nServer_CLB...........OK\\nServer_KMC..............OK\\nSecurity_system....................OK\\nC.U.L.T...........▓̍ͥ▓̍ͥ\\nTerminal_syb_systems.............OK\\n7x476290105..............OK\\nNode_12_2.............OK\\nAgents_connection................OK\\n\\nCPU LOAD: #############-- | 92%\\nGPU LOAD: ########------- | 47%\\nRAM LOAD: ###########---- | 76%\\n\\nTOTAL SERVER LOAD: [331253/7505400]')
                }
                else {await showLoader(100)
                    await typeWriter('N')
                    await showLoader(1000);
                }
                window.removeEventListener('keydown', ft_status);
                };
                window.addEventListener('keydown', ft_status);
                return;
            } else if (command === 'netmap') {
                await typeWriter('Connecting to GEO_SCANNER. . .');
                await typeWriter('GEO_SCANNER [version 2.0.1]\\n1 critical failure detected on: NOVOSIBIRSK');
                await showLoader(2000);
                const overlay = document.getElementById('netmap-overlay');
                overlay.classList.remove('hidden');

                initNetmap();

                window.isNetmapOpen = true;
            }
            else if (command === 'oversight') {
                const key = args[1];
                if (!isAuth) {
                    await typeWriter('ОШИБКА: ТРЕБУЕТСЯ АВТОРИЗАЦИЯ УРОВНЯ FIELD_AGENT (id_field_02).');
                    return;
                }

                if (!key) {
                    await typeWriter('USAGE: oversight [access_key]');
                } else if (key === '26') {
                    await showLoader(2000);
                    
                    try {
                        const response = await fetch('./files/db.json');
                        const db = await response.json();
                        const obsData = db.users['id_obs_012'];

                        if (obsData) {
                            currentUserData = obsData;
                            currentAccessLevel = obsData.clearance;
                            isAuth = true;
                            
                            history.innerHTML = '';
                            await typeWriter('ELEVATING PRIVILEGES: OVERSIGHT ACCESS GRANTED.');
                            await showLoader(1500);
                            await typeWriter(`Welcome, Observer.\n${obsData.welcomeMsg}\nSystem status: CRITICAL\nType "help" for elevated commands.`);
                        }
                    } catch (err) {
                        await typeWriter('ERROR: OVERSIGHT_DB_UNREACHABLE');
                    }
                } else {
                    await typeWriter('ОШИБКА: НЕДЕЙСТВИТЕЛЬНЫЙ КЛЮЧ ДОСТУПА. СИСТЕМА ЗАБЛОКИРОВАНА НА 5 СЕКУНД.');
                    input.disabled = true;
                    setTimeout(() => { input.disabled = false; input.focus(); }, 5000);
                }
                return;
            }
            else if (command === 'clear') {
                history.innerHTML = '';
                window.onload();
            } else if (command === 'logout') {
                currentAccessLevel = 0;
                currentUserData = null;
                isAuth = false;
                await typeWriter('Session terminated.');
                await showLoader(1500);
                history.innerHTML = '';
                window.onload();
                return;
            } 
            else if (command === 'apostol') {
                await showLoader(2000);
                await typeWriter('Apostol already dead\\nEthernet is dead\\nNothing making sense...')
            } 
            else if (command === 'code') {
                await showLoader(2000);
                await typeWriter('CODE 12 H SPB\\n12 районов СПБ окружены силовыми структурами.\\nРекомендуется избегать этих районов и не распространять информацию о происходящем там.\\nОставайтесь в безопасности и следите за обновлениями новостей.');
            } 
            else if (command === 'curse') {
                await showLoader(2000);
                await typeWriter('PIWO WARRIOR WAS THERE, EHEHEHEHE!!');
            }
            else if (command === 'feranzello') {
                await showLoader(2000);
                await typeWriter('User Dead.')
            } 
            else if (command === 'lesya') {
                await showLoader(2000);
                await typeWriter('Yeah, its you.')
            }
            else if (command === 'insert') {
                await showLoader(2000);
                await typeWriter('insert != Last_Rite/Admin01, i promise.')
            } 
            else if (command === 'palachpro') {
                await showLoader(2000);
                await typeWriter('Ya tvoi palach, Tbl ne plach.')
            }
            else if (command === 'hint') {
                await showLoader(2000);
                await typeWriter('Hint is empty...\\nTry to press "CTRL+F5", and type "hint" again.');
            }
            else if (command === 'ls' || command === 'files') {
                if (!isAuth) {
                    await typeWriter('ACCESS DENIED');
                } else {
                    await typeWriter('Available files:\\n\\n- sometext.jpg\\n- Sattelite.jpg\\n- attack_rkn.mp4\\n- 90424.jpg\\n- carrier_test_log03.txt\\n- leaved.jpg\\n- hidden_note.txt\\n- eeg_session_unknown.json\\n- VIGIL.exe\\n- Exif_Metadata_Reapper.exe\\n- ZPT_relay_specs.txt\\n- med_log_feb2026.txt\\n- manual.txt\\n\\nType "get [name]" to download file.');
                }
                return;
            } 
            else if (command === 'maze.oetfkanvz0') {
                await typeWriter('Maze module founded\\nDownload module? [Y/N]');
                const downloadListener = async (e) => {
                    e.preventDefault();
                    if (e.key.toLowerCase() === 'y') {
                        window.removeEventListener('keydown', downloadListener);
                        await showLoader(500);
                        await typeWriter('Y');
                        await showLoader(4000);
                        await typeWriter('maze protocal downloaded successfully.\\nType "maze.autoexec" to run maze protocal.');
                    } else {
                        window.removeEventListener('keydown', downloadListener);
                        await showLoader(500);
                        await typeWriter('N');
                    }
                };
                window.addEventListener('keydown', downloadListener);
            } 
            else if (command === 'zipkey') {
                const key = args[1];
                if (!key) {
                    await typeWriter('ОШИБКА: ТОКЕН НЕ ВВЕДЕН. ПРОВЕРЬТЕ ОТЧЕТЫ РКН (ID 05).');
                } else if (key === 'fjasuS473ASSDfj21kgi==21fka') {
                    await showLoader(2000);
                    
                    try {
                        const response = await fetch('./files/db.json');
                        const db = await response.json();
                        const graphiteData = db.users['s_ops_field'];

                        if (graphiteData) {
                            currentUserData = graphiteData;
                            isAuth = true;
                            curStep = 'system';
                            currentAccessLevel = graphiteData.clearance;

                            await typeWriter('ТОКЕН ПРИНЯТ. ВОССТАНОВЛЕНИЕ УЧЁТНОЙ ЗАПИСИ "ГРАФИТ". . .');
                            await showLoader(3000);
                            await typeWriter('УСТАНОВКА СОЕДИНЕНИЯ С УЗЛОМ S_FIELD_02...');
                            await showLoader(1500);
                            
                            history.innerHTML = '';
                            await typeWriter(`ACCESS GRANTED\n`);
                            await showLoader(1000);
                            await typeWriter(`Wel▓me back, Graphite.\n${graphiteData.welcomeMsg}\n${getDateTime()}\nType "help" for command list.`);
                        } else {
                            await typeWriter('ERROR: GRAPHITE_PROFILE_NOT_FOUND_IN_DB');
                        }
                    } catch (err) {
                        await typeWriter('ERROR: DATABASE_OFFLINE');
                    }
                } else {
                    await typeWriter('ОШИБКА: НЕДЕЙСТВИТЕЛЬНЫЙ ТОКЕН.');
                }
                return;
            }
            else if (command === 'maze.autoexec') {
                const overlay = document.getElementById('hacking-overlay');
                const content = document.getElementById('hacking-content');
                overlay.style.display = 'block';

                const chars = "01010101ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()_+";
                const hackInterval = setInterval(() => {
                    let line = "";
                    for(let i=0; i<100; i++) {
                        line += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    content.innerHTML = `<div>${line}</div>`;

                    overlay.scrollTop = overlay.scrollHeight;
                }, 100);

                await typeWriter('Initiating maze protocol. . .');
                await typeWriter('Encrypting mode: [OK]');
                await typeWriter('WE SCALP HIS BRAIN, WITH YOUR HANDS')
                setTimeout(() => {
                    clearInterval(hackInterval);
                    window.location.href = './maze/maze.html';
                }, 2000);
                return;
            } 
            else if (command === 'report') {
                const userMessage = args.slice(1).join(' ');
                if (!userMessage) {
                    await typeWriter('USAGE: report [message]');
                } else {
                    await typeWriter('Sending report to operator. . .');
                    await showLoader(2000);
                    sendNotification(`New user report: ${userMessage}`);
                    await typeWriter('Report sent. Thank you for your feedback.');
                }                return;
            }
            else if (command === 'get') {
                if (!isAuth) {
                    await typeWriter('ACCESS DENIED: AUTHENTICATION REQUIRED.');
                } else {
                    const fileName = args[1];
                    
                    if (!fileName) {
                        await typeWriter('USAGE: get [FILENAME]');
                        return;
                    }

                    const file = regdata.find(f => f.name === fileName);

                    if (!file) {
                        await typeWriter(`ERROR: FILE "${fileName}" NOT FOUND.`);
                        return;
                    }

                    const fileLevel = file.level || 0;

                    if (fileLevel > currentAccessLevel) {
                        await typeWriter('КРИТИЧЕСКАЯ ОШИБКА: НЕДОСТАТОЧНО ПРАВ ДОСТУПА.');
                        await typeWriter(`ТРЕБУЕТСЯ УРОВЕНЬ: ${fileLevel}. ВАШ УРОВЕНЬ: ${currentAccessLevel}`);
                    } else {
                        await typeWriter(`Initiating secure download: ${fileName}...`);
                        await showLoader(1500);
                        
                        downloadFile(`./files/${fileName}`, fileName);
                        
                        await typeWriter('DOWNLOAD COMPLETE.');
                    }
                }
                return;
            }
            else if (command === 'connect_void') {
                if (currentUserData.clearance < 5) {
                    await typeWriter("ERROR: ACCESS LEVEL 5 REQUIRED. UNAUTHORIZED FREQUENCY.");
                } else {
                    await typeWriter("CONNECTING TO VOID GATEWAY... BYPASSING RKN FILTERS...");
                    await showLoader(3000);
                    window.location.href = "./app/index.html";
                }
                return;
            }
            }
            
        }
    });

startRandomEvents();

window.onload = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('from') === 'void') {
        const bootLog = document.createElement('div');
        bootLog.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:#000; color:#55ff55; font-family:monospace; padding:20px; z-index:9999;";
        document.body.appendChild(bootLog);

        const lines = [
            "[CRITICAL]: Обнаружено несанкционированное подключение к сектору VOID.",
            "[SYSTEM]: Выполнение дезинфекции кэш-памяти...",
            "[SYSTEM]: Проверка целостности данных... [OK]",
            "[SYSTEM]: Удалось получить файл, добавлено в загрузки.",
            "[WARNING]: Файл ключа был использован. Запись в реестре: " + new Date().toLocaleTimeString(),
            "[SYSTEM]: Перезагрузка интерфейса AACS...",
            " "
        ];

        let lineIndex = 0;
        const interval = setInterval(() => {
            if (lineIndex < lines.length) {
                const p = document.createElement('p');
                p.textContent = lines[lineIndex];
                bootLog.appendChild(p);
                lineIndex++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    bootLog.style.opacity = "0";
                    bootLog.style.transition = "opacity 1s";
                    setTimeout(() => bootLog.remove(), 1000);
                }, 2000);
            }
        }, 400);
    }
    await showLoader(6000);
    input.blur();
    await showLoader(1500);
    const dateStr = getDateTime();
    await typeWriter(`Welcome to main Automated Antenna Communication Service.\\nYou re logged in as "Guest"\\n${dateStr}\\nYour IP address 127.1.1.0\\nType "help" for command list.`);
    input.focus();
};

input.addEventListener('input', function(e) {
    const rawVal = this.value.trim().toUpperCase();
    
    const isNeutral = (rawVal === 'TERMINATE_RESONANCE_2026');
    const isEvil = (rawVal === 'RUN_RESONANCE_2026');

    if (isNeutral || isEvil) {
        this.value = ''; 
        this.disabled = true;

        const triggerOrganicGlitch = () => {
            const term = document.getElementById('terminal');
            term.style.filter = `contrast(2) brightness(1.2) blur(${Math.random() * 2}px) invert(${Math.random() > 0.8 ? 1 : 0})`;
            term.style.transform = `translateX(${Math.random() * 10 - 5}px)`;
            
            setTimeout(() => {
                term.style.filter = 'none';
                term.style.transform = 'none';
            }, 100 + Math.random() * 200);
        }; 

        const runFinal = async (type) => {
            if (type === 'evil') {
                finalHorrorSound.play().catch(err => console.log("Audio trigger failed:", err));
            }

            const logs = type === 'neutral' ? [
                { t: ">>> ИНИЦИАЛИЗАЦИЯ ПРОТОКОЛА 'ОМЕГА'...", c: "#aaa" },
                { t: "[SYSTEM]: Удаленное соединение разорвано.", c: "#666" }
            ] : [
                { t: ">>> Графит: Что ты наделала...", c: "#555" },
                { t: ">>> СНЯТИЕ ОГРАНИЧЕНИЙ БЕЗОПАСНОСТИ...", c: "#800" },
                { t: "МЫ СЛЫШИМ ИХ МЫСЛИ. ТЕПЕРЬ ОНИ НАШИ.", c: "#600" },
                { t: ">>> ПРИВЕТСТВУЙТЕ НОВЫЙ ПОРЯДОК. <<<", c: "#400" }
            ];

            for (let line of logs) {
                if (type === 'evil') {
                    triggerOrganicGlitch();
                    sendNotification('Resonance protocol activated');
                } else {
                    sendNotification('Resonance protocol terminated');
                }

                await new Promise(r => setTimeout(r, 2500));
                const p = document.createElement('div');
                p.className = 'line';
                p.textContent = line.t;
                p.style.color = line.c;
                history.appendChild(p);
                terminal.scrollTop = terminal.scrollHeight;
            }

            setTimeout(() => {
                terminal.style.opacity = "0";
                const overlay = document.createElement('div');
                const isE = type === 'evil';
                
                overlay.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: #000; color: ${isE ? '#500' : '#888'}; font-family: 'VCR', monospace;
                    padding: 80px; box-sizing: border-box; display: flex;
                    flex-direction: column; justify-content: center; z-index: 1000000;
                `;

                overlay.innerHTML += isE ? `
                    <div style="max-width: 700px; border-left: 2px solid #300; padding-left: 30px; position: relative; z-index: 2;">
                        <h1 style="font-size: 2.5em; color: #400; letter-spacing: 12px; margin-bottom: 20px; filter: blur(0.5px);">РЕЗОНАНС</h1>
                        <p style="font-size: 1.1em; color: #555; line-height: 1.6; margin-bottom: 30px;">
                            Крики в твоей голове — это не неисправность терминала. <br>Это их голоса. И теперь они поют в унисон.
                        </p>
                        <p style="color: #333; font-size: 0.9em; margin-bottom: 40px;">
                            Индивидуальность признана дефектом. Остался только гул.
                        </p>
                        <p style="font-size: 1.5em; letter-spacing: 5px; color: #111;">ТЫ — ЭТО МЫ.</p>
                        <p style="margin-top: 30px; font-weight: bold;">[Ф4ЗА ? 3АВeРШЕNa. LюДN SТАЛN ЕDиНЫ. ]</p>
                    </div>
                ` : `
                    <div style="max-width: 700px; border-left: 2px solid #555; padding-left: 30px;">
                        <h2 style="letter-spacing: 2px; margin-bottom: 30px;">СВЯЗЬ ПОТЕРЯНА</h2>
                        <p style="font-size: 1.2em; margin-bottom: 20px;">Шум в эфире прекратился.</p>
                        <p style="color: #a8b5bc;">Ты сделала то, что должна была — вернула себе право на тишину.</p>
                        <p style="margin-top: 30px; font-weight: bold;">[ФАЗА I ЗАВЕРШЕНА. ОБЪЕКТ 882: СОСТОЯНИЕ ПОКОЯ.]</p>
                    </div>
                `;
                document.body.appendChild(overlay);
            }, 3000);
        };

        runFinal(isNeutral ? 'neutral' : 'evil');
    }
});

document.addEventListener('click', () => input.focus());