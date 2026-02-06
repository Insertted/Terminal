const history = document.getElementById('history');
const input = document.getElementById('cmd-input');
const terminal = document.getElementById('terminal');
const typerText = document.getElementById('typer-text');

const loaderFrames = ['/', '-', '\\', '|'];

let isAuth = false;
let curStep = 'system'; 
const regdata = { user: 'observer012', password: 'pan'}

import { getDateTime } from "../modules/date.js";

window.onload = async () => {
    input.blur();
    await showLoader(1500);
    const dateStr = getDateTime();
    await typeWriter(`Welcome to main Automated Antenna Communication Service.\\nYou re logged in as "Guest"\\n${dateStr}\\nYour IP address 127.1.1.0\\nType "help" for command list.`);
    input.focus();
}

input.addEventListener('input', () => {
    if (curStep === 'auth_password') {
        typerText.textContent = "*".repeat(input.value.length);
    } else {
        typerText.textContent = input.value;
    }
});

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

async function typeWriter(text, speed = 30) {
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

function downloadFile(filePath, fileName) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

        if (curStep === 'auth_login') {
            if(val.toLowerCase() === regdata.user) {
                curStep = 'auth_password';
                await showLoader(1000);
                await typeWriter('waiting for password. . .');
            } else {
                await typeWriter('Unknown user ID. Connection reset.');
                curStep = 'system';
            }
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
                await typeWriter(`Welcome to main Automated Antenna Communication Service.\\nYou're logged in as "Observer 012"\\n${dateStr}\\nYour IP address 127.1.1.0\\nType "help" for command list.`)
                input.focus();
            } else {
                await typeWriter('Invalid password. Access denied.');
                curStep = 'system';
            }
        }
        else if (curStep === 'system') {
            const command = val.toLowerCase();

            if (command === 'login') {
                if (isAuth) {
                    await typeWriter('You are already logged in.');
                } else {
                    curStep = 'auth_login';
                    await typeWriter('Enter user ID: ');
                }
            } 
            else if (command === 'help') {
                if (!isAuth) {
                    await typeWriter('Commands:\\nLOGIN\\nLOGS\\nSTATUS\\nCLEAR');
                } else {
                    await typeWriter('Commands:\\nLOGS\\nFILES\\nSTATUS\\nLOGOUT\\nCLEAR');
                }
            } else if (command === 'status') {
                await typeWriter('Diagnostic. . .');
                await showLoader(3500);
                let statusMsg = 'Server_connection................OK\\nAntenna_translators..............OK\\nMain_transformer.................OFF\\nNorth_Line.......................ERROR\\nWest_Line........................ERROR';
                if (isAuth) {
                    statusMsg += '\\nAgents_online....................16/152';
                }
                statusMsg += '\\nStatus: POWER OUTAGES';
                await typeWriter(statusMsg);
            } else if (command === 'clear') {
                history.innerHTML = '';
            } else if (command === 'logout') {
                isAuth = false;
                await typeWriter('Session terminated.');
                await showLoader(1500);
                history.innerHTML = '';
                window.onload();
            } 
            // ИСПРАВЛЕНО: Теперь используем переменную 'command' вместо несуществующей 'cmd'
            else if (command === 'ls' || command === 'files') {
                if (!isAuth) {
                    await typeWriter('ACCESS DENIED');
                } else {
                    await typeWriter('To download file type "get [FILENAME]"\\nAvailable files:\\nTEST.TXT');
                }
            } else if (command.startsWith('get ')) {
                if (!isAuth) {
                    await typeWriter('ERROR: Unauthorized download attempt.');
                } else {
                    const fileName = val.split(' ')[1];
                    await typeWriter(`Downloading ${fileName} . . .`);
                    // ИСПРАВЛЕНО: добавлена косая черта между папкой и именем файла
                    downloadFile(`../files/${fileName}`, fileName);
                    await showLoader(1000);
                    await typeWriter('Done.')
                }
            } else {
                await typeWriter(`ERROR: Command "${command}" not recognized.`);
            }
        }
    }
});

document.addEventListener('click', () => input.focus());