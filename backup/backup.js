const history = document.getElementById('history');
const input = document.getElementById('cmd-input');
const typerText = document.getElementById('typer-text');


// Зеркальное отображение ввода
input.addEventListener('input', () => {
    typerText.textContent = input.value;
});

async function typeWriter(text, speed = 30) {
  const line = document.createElement('div');
  line.className = 'line';
  history.appendChild(line);

  for (let i = 0; i < text.length; i++) {
    // Если встречаем \n, добавляем тег разрыва строки
    if (text.substring(i, i + 2) === '\\n') {
      line.innerHTML += '<br>';
      i++; // Пропускаем следующий символ 'n'
    } else {
      line.innerHTML += text.charAt(i);
    }
    
    // Скролл вниз
    terminal.scrollTop = terminal.scrollHeight;
    await new Promise(res => setTimeout(res, speed));
  }
}

input.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    const command = input.value.toLowerCase().trim();
    
    // Вывод лога команды
    const userLine = document.createElement('div');
    userLine.innerHTML = `<span style="opacity: 0.6;">AACS:\> ${command}</span>`;
    history.appendChild(userLine);
    
    // Сброс поля
    input.value = '';
    typerText.textContent = '';

    if (command === 'help') {
      await typeWriter('SYSTEM_AACS: ACCESS GRANTED. \\nCOMMANDS: \\nLOGS \\nSTATUS \\nBYPASS \\nCLEAR');
    } else if (command === 'clear') {
      history.innerHTML = '';
    } else if (command !== '') {
      await typeWriter(`ERROR: Command "${command}" unknown.`);
    }
  }
});

document.addEventListener('click', () => input.focus());