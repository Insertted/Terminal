const watchPhrases = ["YOU IN SAFE??", "WE ARE WATCHING...", "BEHIND YOU", "GO BACK...", "YOUR SOUL IS MINE", "RUN", "LEAVE THIS PLACE", "YOU CAN'T HIDE", "I SEE YOU", "DON'T LOOK BACK", "SOMETHING'S WRONG", "CAN'T ESCAPE", "TRAPPED FOREVER", "NO WAY OUT", "FEEL THE DARKNESS", "LOST IN THE VOID"];

export async function spawnWatcher() {
    if (Math.random() > 0.66) {
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