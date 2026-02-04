const history = document.getElementById('history');
const input = document.getElementById('cmd-input');
const terminal = document.getElementById('terminal');
const typerText = document.getElementById('typer-text'); // Новый элемент

const loaderFrames = ['/', '-', '\\', '|'];

// 1. Зеркалим ввод пользователя на экран
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
    }, 100);

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
        const rawCommand = input.value; // Сохраняем текст для истории
        
        // Очищаем поле и зеркало сразу после нажатия Enter
        input.value = '';
        typerText.textContent = '';

        if (command === '') return;

        // Выводим команду в историю
        const userLine = document.createElement('div');
        userLine.innerHTML = `<span style="color: #888;">AACS:\\> ${rawCommand}</span>`;
        history.appendChild(userLine);
        
        await showLoader(2300); 

        if (command === 'help') {
            await typeWriter('Wel▓̡̋́▓͑̃▓̍ͥme to Autom▓̡̋́te# An##nna Co▓͑̃▓̍ͥnicating Se#▓̍ͥice.\\nTerm▓̡̋́▓͑̃▓̍ͥl response to co##ands:\\nLOGS\\nSTATUS\\nCLEAR');
        } else if (command === 'clear') {
            history.innerHTML = '';
        } else {
            await typeWriter(`ERROR: Command "${command}" not recognized.`);
        }
    }
});

document.addEventListener('click', () => input.focus());