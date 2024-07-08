window.onload = () => {
    // content.ts
    const videoElements: NodeListOf<HTMLVideoElement> = document.querySelectorAll('video');

    videoElements.forEach((video: HTMLVideoElement) => {
        video.addEventListener('timeupdate', () => {
            const currentTime: number = video.currentTime;
            console.log(`Current playback position: ${currentTime} seconds`);
        });
    });
};