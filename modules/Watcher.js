const watchPhrases = ["TRACING_DATA...", "WE ARE WATCHING...", "BEHIND YOU", "CAPTURING_USER_DATA...", "REGISTERING_KEYSTROKES...", "WRITING_LOGS..."];

export async function spawnWatcher() {
    if (Math.random() > 0.98) {
        const ghost = document.createElement('div');
        ghost.textContent = `[!] ${watchPhrases[Math.floor(Math.random() * watchPhrases.length)]}`;
        
        Object.assign(ghost.style, {
            position: 'fixed',
            top: Math.random() * 90 + 'vh',
            left: Math.random() * 90 + 'vw',
            color: 'rgb(255, 0, 0)',
            fontSize: '15px',
            fontFamily: 'monospace',
            pointerEvents: 'none',
            zIndex: '9999',
            letterSpacing: '2px'
        });

        document.body.appendChild(ghost);

        setTimeout(() => {
            ghost.style.opacity = '0';
            setTimeout(() => ghost.remove(), 500);
        }, 800);
    }
}