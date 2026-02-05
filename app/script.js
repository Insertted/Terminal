const history = document.getElementById('history');
const input = document.getElementById('cmd-input');
const terminal = document.getElementById('terminal');
const typerText = document.getElementById('typer-text');

const loaderFrames = ['/', '-', '\\', '|'];

function getDateTime() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return now.toLocaleDateString('en-US', options);
}

window.onload = async () => {
    input.blur();
    await showLoader(1500);
    const dateStr = getDateTime();
    await typeWriter(`Welcome to main Automated Antenna Communication Service.\\nYou re logged in as "Guest"\\n${dateStr}\\nYour IP address 127.1.1.0\\nType "help" for command list.`);
    input.focus();
}

input.addEventListener('input', () => {
    typerText.textContent = input.value;
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

input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const command = input.value.toLowerCase().trim();
        const rawCommand = input.value;
        
        input.value = '';
        typerText.textContent = '';

        if (command === '') return;

        const userLine = document.createElement('div');
        userLine.innerHTML = `<span style="color: #888;">AACS:\\> ${rawCommand}</span>`;
        history.appendChild(userLine);
        
        await showLoader(2900); 

        if (command === 'help') {
            await typeWriter('Wel▓̡̋́▓͑̃▓̍ͥme to Autom▓̡̋́te# An##nna Co▓͑̃▓̍ͥnicating Se#▓̍ͥice.\\nTerm▓̡̋́▓͑̃▓̍ͥl response to co##ands:\\nLOGS\\nSTATUS\\nCLEAR');
        } else if (command === 'clear') {
            history.innerHTML = '';
        } else if (command === 'status') {
            await typeWriter('Diagnostic. . .')
            await showLoader(4000)
            await typeWriter('Server_connection................OK\\nAntenna_translators..............OK\\nTransformer_substation3102.......OK\\nTransformer_substation1429.......OK\\nMain_transofrmer.................ERROR\\nPower_plant_connection...........ERROR\\nRelay_triangulation..............ERROR')
            await showLoader(3000)
            await typeWriter('Cur▓̡̋́▓͑̃ent status: POWER OUTAGES')
        }
         else {
            await typeWriter(`ERROR: Command "${command}" not recognized.`);
        }
    }
});

document.addEventListener('click', () => input.focus());