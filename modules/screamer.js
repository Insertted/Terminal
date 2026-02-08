export async function triggerScreamer() {
    const container = document.getElementById('screamer-container');
    const video = document.getElementById('screamer-video');

    container.style.display = 'block';
    video.play();

    video.onended = () => {
        container.style.display = 'none';
        video.pause();
        video.currentTime = 0;
    };
}