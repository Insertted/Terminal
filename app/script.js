const history = document.getElementById('history');
const input = document.getElementById('cmd-input');
const terminal = document.getElementById('terminal');
const typerText = document.getElementById('typer-text');

const loaderFrames = ['/', '-', '\\', '|'];

let isAuth = false;
let curStep = 'system'; 
const regdata = { user: 'observer012', password: 'pan'}

import { getDateTime } from "../modules/date.js";
import { readLogFile } from "../modules/Readlog.js";
import { downloadFile } from "../modules/Download.js";

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
async function typeWriter(text, speed = 24) {
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
        userLine.innerHTML = `<span style="color: #888;">AACS:\\> ${curStep === 'auth_password' ? '********' : raw}</span>`;
        history.appendChild(userLine);
        
        await showLoader(1000); 

        // Начало авторизации
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
                await typeWriter(`Welcome to main Auto▓̡̋́▓͑̃▓̍ͥated Antenna Communication Se▓̡̋́▓͑̃▓̍ͥce.\\nYou're logged in as "Observer 012"\\n${dateStr}\\nYour IP address 127.1▓̡̋́▓͑̃▓̍ͥ0\\nType "help" for command list.`)
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
                    await typeWriter('Commands:\\nLOGIN\\nSTATUS\\nCLEAR');
                } else {
                    await typeWriter('Commands:\\nLOGS\\nFILES\\nSTATUS\\nLOGOUT\\nCLEAR');
                }
                return;
            } else if (command === '9js9891kdssz11s') {
                if (!isAuth) {
                    await showLoader(3000);
                    await typeWriter('observer012');
                    await showLoader(2000);
                    await typeWriter("password: ▓̡̋́▓͑̃▓̍ͥ");
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
                    await typeWriter('AVAILABLE LOGS:\\n- log01.txt\\n- ascii_art_queen.txt\\n- log02.txt\\n\\nType "log [name]" to read.');
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
                    const content = await readLogFile(args[1]);
                    await typeWriter(content);
                }
                return;
            }
            else if (command === 'status') {
                await typeWriter('Diagnostic. . .');
                await showLoader(3500);
                let statusMsg = 'Server_connection................OK\\nAntenna_translators..............OK\\nMain_transformer.................OFF\\nNorth_Line.......................ERROR\\nWest_Line........................ERROR';
                if (isAuth) {
                    statusMsg += '\\nAgents_online....................53/152';
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
            else if (command === 'ls' || command === 'files') {
                if (!isAuth) {
                    await typeWriter('ACCESS DENIED');
                } else {
                    await typeWriter('Available files:\\n- test.txt\\n- rkn_f.jpg\\n- attack_rkn.mp4\\n\\nType "get [name]" to download file.');
                }
                return;
            } 
            else if (command.startsWith('get')) {
                if (!isAuth) {
                    await typeWriter('ACCESS DENIED');
                } else {
                    const fileName = val.split(' ')[1];
                    await typeWriter(`Downloading ${fileName} . . .`);
                    downloadFile(`../files/${fileName}`, fileName);
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

document.addEventListener('click', () => input.focus());