import log from "../common/utils/pretty-log";

function getVideoId() {
    const videoElement = document.querySelector('video-js video');
    return videoElement ? videoElement.getAttribute('data-playlist-id') : null;
}

function createJumpButton(savedTime: number, player: any) {
    const jumpButton = document.createElement('div');
    jumpButton.style.position = 'fixed';
    jumpButton.style.bottom = '10px';
    jumpButton.style.left = '10px';
    jumpButton.style.padding = '10px';
    jumpButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    jumpButton.style.color = 'white';
    jumpButton.style.cursor = 'pointer';
    jumpButton.innerText = `Jump to last watched position (${Math.floor(savedTime / 60)}:${Math.floor(savedTime % 60)})`;

    jumpButton.addEventListener('click', () => {
        player.currentTime(savedTime);
        document.body.removeChild(jumpButton);
    });

    document.body.appendChild(jumpButton);
}

function onPlayerReady(player: any) {
    const videoId = getVideoId();

    if (videoId) {
        // Check if there is a saved progress for this video
        window.postMessage({ type: 'getProgress', videoId }, '*');
        log.info(`Checking saved progress for video ${videoId}`);
        window.addEventListener('message', (event) => {
            if (event.data.type === 'progressResponse' && event.data.videoId === videoId) {
                const savedTime = event.data.currentTime || 0;
                if (savedTime > 0) {
                    createJumpButton(savedTime, player);
                }
            }
        });

        // Listen for time updates
        player.on('timeupdate', () => {
            const currentTime = player.currentTime();
            window.postMessage({ type: 'saveProgress', videoId, currentTime }, '*');
            log.info(`Saving progress for video ${videoId}: ${currentTime}`);
        });
    }
}
window.onload = () => {
    const videoElement = document.querySelector('video-js video');

    if (videoElement) {
        const player = (window as any).videojs(videoElement);

        player.ready(() => {
            log.info('Player ready');
            onPlayerReady(player);
        });
    }
};
