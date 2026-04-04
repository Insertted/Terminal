const connectionNodes = ["74.255.356.1", "82.156.325.123", "801.155.200.1", "356.255.255.255", "123.456.789.0", "98.765.432.1"];
const secondNodes = ["98.55.123.2", "901.255.132.4", "251.255.255.255", "901.255.132.4", "72.156.325.123", "82.23.980.1"];

export async function triggerRandomConnection() {
    const logContainer = document.getElementById('connection-log');
    if (!logContainer) return;

    logContainer.innerHTML = '';
    logContainer.classList.add('visible');

    const randomNode = connectionNodes[Math.floor(Math.random() * connectionNodes.length)];
    const randomRec = secondNodes[Math.floor(Math.random() * secondNodes.length)];

    const eventChain = [
        { text: `[OK] Connecting to ${randomNode}. . .`, color: "#ffffff" },
        { text: "[OK] Checking ssh key. . .", color: "#ffffff" },
        { text: "[OK] Veryfing ssh key. . .", color: "#ffffff" },
        { text: "[ERROR] Failure connect to chain.", color: "#e90000" },
        { text: `[OK] Checking connection to ${randomRec}. . .`, color: "#ffffff" },
        { text: "[OK] Veryfing ssh key. . .", color: "#ffffff" },
        { text: "[OK] Checking user activity. . .", color: "#ffffff" },
        { text: "[OK] Redirecting current session to new. . .", color: "#ffffff" },
        { text: "[OK] Connection established.", color: "#55ff55" }
    ];

    for (const step of eventChain) {
        const line = document.createElement('div');
        line.className = 'log-line';
        line.style.color = step.color;
        line.textContent = step.text;
        logContainer.appendChild(line);
        
        await new Promise(res => setTimeout(res, 500 + Math.random() * 1000));
    }

    setTimeout(() => {
        logContainer.classList.remove('visible');
    }, 3000);
}

export function startRandomEvents() {
    const nextEvent = Math.random() * (120000 - 60000) + 60000;
    setTimeout(() => {
        triggerRandomConnection();
        startRandomEvents();
    }, nextEvent);
}