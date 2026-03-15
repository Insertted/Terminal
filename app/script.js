const history = document.getElementById('history');
const input = document.getElementById('cmd-input');
const terminal = document.getElementById('terminal');
const typerText = document.getElementById('typer-text');

const loaderFrames = ['/', '-', '\\', '|'];

let isAuth = false;
let curStep = 'system'; 

import { getDateTime } from "../modules/date.js";
import { readLogFile } from "../modules/Readlog.js";
import { downloadFile } from "../modules/Download.js";
import { triggerScreamer } from "../modules/screamer.js";
import { regdata } from "../modules/files.js";
import { getProgressBar } from "../modules/progress.js";
import { sendNotification } from "../modules/TGbot.js";

// Приветсвенное сообщение
window.onload = async () => {
    input.blur();
    await showLoader(1500);
    const dateStr = getDateTime();
    await typeWriter(`Welcome to main Automated Antenna Communication Service.\\nYou re logged in as "Guest"\\n${dateStr}\\nYour IP address 127.1.1.0\\nType "help" for command list.`);
    input.focus();
}

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

// Писаетль ответов для юзера
async function typeWriter(text, speed = 27) {
    const line = document.createElement('div');
    line.className = 'line';
    history.appendChild(line);

    for (let i = 0; i < text.length; i++) {
        if (text.substring(i, i + 2) === '\\n') {
            line.innerHTML += '<br>';
            i++;
        } else {
            line.innerHTML += text.charAt(i);
        }
        terminal.scrollTop = terminal.scrollHeight;
        await new Promise(res => setTimeout(res, speed));
    }
}

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
            if(val.toLowerCase() === regdata.user) {
                curStep = 'auth_password';
                await showLoader(1000);
                await typeWriter('waiting for password. . .');
            } else {
                terminal.classList.add('glitch-error');

                await typeWriter('ACCESS DENIED');

                setTimeout(() => {
                    terminal.classList.remove('glitch-error');
                }, 1000);
                
                curStep = 'system';
            }
            return;
        }
        else if (curStep === 'auth_password') {
            if (val === regdata.password) {
                curStep = 'system';
                const dateStr = getDateTime();
                isAuth = true;
                await showLoader(2500);
                input.blur();
                await typeWriter('ACCESS GRANTED\\n');
                await showLoader(2000);
                history.innerHTML = '';
                await typeWriter(`Welcome to main Auto▓͑̃▓̍ͥated Antenna Communication Se▓̡̋́▓̍ͥce.\\nYou're logged in as "Observer 012"\\n${dateStr}\\nYour IP address 127.1▓̡̋́0\\nType "help" for command list.`)
                input.focus();
            } else {
                terminal.classList.add('glitch-error');
        
                await typeWriter(history, terminal, 'ACCESS DENIED');
        
                setTimeout(() => {
                    terminal.classList.remove('glitch-error');
                }, 1000);

                curStep = 'system';
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
                    await typeWriter('Commands:\\n\\nLOGIN\\nSTATUS\\nREPORT\\nCLEAR');
                } else {
                    await typeWriter('Commands:\\n\\nLOGS\\nFILES\\nSTATUS\\nREPORT\\nLOGOUT\\nCLEAR');
                }
                return;
            } else if (command === '9js9891kdssz11s') {
                sendNotification('Person found a screamer');

                if (!isAuth) {
                    await triggerScreamer();
                    await showLoader(3000);
                    await typeWriter('observer012');
                    await showLoader(2000);
                    await typeWriter("password: ▓̡̋́▓̍ͥ");
                    await showLoader(500);
                    await typeWriter('CRITICAL ERROR:CODE 0x42221045\\nUnable to load password.');
                    await showLoader(3000);
                    await typeWriter("console.log(pass);");
                    console.log('AACS:\> password: pan');
                }
                else {
                    await showLoader(100);
                }
                return;
            }
            if (command === 'logs') {
                if (!isAuth) {
                    await typeWriter('ACCESS DENIED');
                } else {
                    await showLoader(2000);
                    await typeWriter('AVAILABLE LOGS:\\n\\n- log01\\n- log02\\n- log03\\n- log04\\n- agents\\n- big_deal\\n- cultic\\n- laws_ddos\\n- meet\\n- recruit\\n- ascii_art_queen\\n\\nType "log [name]" to read.');
                }
                return;
            } if (command === 'log') {
                if (!isAuth) {
                    await typeWriter('ACCESS DENIED');
                } else if (!args[1]) {
                    await typeWriter('USAGE: log [filename.txt]');
                } else {
                    await typeWriter(`READING ${args[1]}...`);
                    await showLoader(2000);
                    const content = await readLogFile(args[1] + '.txt');
                    await typeWriter(content);
                }
                return;
            }
            else if (command === 'status') {
                await typeWriter('Diagnostic. . .');
                await showLoader(3500);
                let statusMsg = '\\nTerminal [version 5.9.0.1]\\n\\nServer_connection................OK\\nAntenna_translators..............OK\\nSub_systems......................OK\\n\\nChecking power lines. . .\\n1/3...............................OK\\n2/3...............................OK\\n3/3............................ERROR';
                if (isAuth) {
                    statusMsg += '\\n\\nSERVERS LOAD: LOW [26312/165400]';
                }
                statusMsg += '\\nStatus: POWER OUTAGES';
                await typeWriter(statusMsg);
                return;
            } else if (command === 'clear') {
                history.innerHTML = '';
                window.onload();
            } else if (command === 'logout') {
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
            else if (command === 'code 12 h spb') {
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
            else if (command === 'ls' || command === 'files') {
                if (!isAuth) {
                    await typeWriter('ACCESS DENIED');
                } else {
                    await typeWriter('Available files:\\n\\n- BlackScreen.png\\n- rkn_f.jpg\\n- attack_rkn.mp4\\n- Chronology.txt\\n- house.jpg\\n\\nType "get [name]" to download file.');
                }
                return;
            } 
            else if (command === 'maze.oetfkanvz0') {
                await typeWriter('Hidden command found\\n\\nmaze.autoexec');
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
                await typeWriter('Bypassing firewall. . .');
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
                    await typeWriter('Sending report to administrator. . .');
                    await showLoader(2000);
                    sendNotification(`New user report: ${userMessage}`);
                    await typeWriter('Report sent. Thank you for your feedback.');
                }                return;
            }
            else if (command === '4la000ngjua1kkauwqbknl4902kgfmadlfgpo') {
                await showLoader(2000);
                await typeWriter('TOKEN FOUND\\nAttempting to use token. . .');
                await showLoader(2000);
                await typeWriter('Token is valid.\\nSenting message to administrator. . .');
                await showLoader(2000);
                sendNotification('She complete the quest');
                showLoader(8000);
                await typeWriter('Thank you for feedbac');
                history.innerHTML = '';
                await showLoader(4000);
                await typeWriter('Это админ, вижу тебе удалось найти ключ.');
                await showLoader(4000);
                await typeWriter("Теперь нам будет куда проще, думаю раз ты проделала такую работу,тебе можно рассказать это.");
                await showLoader(4000);
                await typeWriter("Zepta, подпольная фирма, изначально AACS был чисто 'свойским' внутренним терминалом.\\nОднако РКН начали блокировать весь рунет, тогда Zepta не могла остаться в стороне.\\nТерминал был переписан под секретный канал связи для всех причастных к zepte.\\nТы кстати тоже соучастница.\\nЭтот токен поможет нам внедриться на сервера и раскурочить там все.");
                await showLoader(4000);
                await typeWriter('Впрочем это все что я могу сказать да и дел стало выше крыши.\\nКогда они узнают что токен был украден, то сразу заблокируют его.\\nЗавтра сообщу что получилось, передавай от меня привет своему другу FZ.');
                await showLoader(12000);
                await typeWriter('CONNECTION CLOSED.\\nRETURNING TO MAIN INTERFACE. . .');
                await showLoader(500);
                history.innerHTML = '';
                window.onload();
                
            } 
            else if (command === 'connect_void') {
                await typeWriter('Requesting connection to void. . .');
                await showLoader(1000);
                await typeWriter("Recived 2 new messages from '▓̡̋́▓̍ͥOID DE▓̡̋́CRYP▓̍TER\\nReading messages. . .")
                await showLoader(1000)
                await typeWriter('Hmmm. . .');
                await showLoader(2000);
                await typeWriter('Лады, DESPECTUS, в этот раз позволю тебе взглянуть в бездну, смотри внимательно. . .');
                await showLoader(500);
                history.innerHTML = '';
                await typeWriter("The connection has been terminated for user safety reasons.")
                await showLoader(500)
                await typeWriter('IP: 666.6?6.???.666 BANNED.');
                await showLoader(2000);
                await typeWriter('Connection established.\\nEntering void. . .');
                await showLoader(5000);
                window.location.href = './void_os/index.html';
                return;
            } else if (command === 'zipkey') {
                await typeWriter('MISSING CRITICAL ARGUMENT: KEY NOT FOUND\\nCHECK DEVTOOLS [F12]');
                console.log('AACS:\> zipkey: fjasuS473ASSDfj21kgi==21fka');
            }
            else if (command.startsWith('get')) {
                if (!isAuth) {
                    await typeWriter('ACCESS DENIED');
                } else {
                    const fileName = val.split(' ')[1];
                    await typeWriter(`Downloading ${fileName} . . .`);
                    downloadFile(`./files/${fileName}`, fileName);
                    await showLoader(1000);
                    await typeWriter('Done.')
                }
                return;
            } else {
                await typeWriter(`ERROR: Command "${command}" not recognized.`);
            }
        }
    }
});

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

document.addEventListener('click', () => input.focus());