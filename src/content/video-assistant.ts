import log from "../common/utils/pretty-log";

class VideoAssistant {
    private player: HTMLVideoElement | null;
    private playListId: string | null;
    private video: HTMLVideoElement | null;
    private videoId: string | null;
    private lastSavedTime: number = Date.now();

    constructor() {
        log.info('Video assistant initialized.');
        this.player = null;
        this.playListId = null;
        this.video = null;
        this.videoId = null;
        this.listenPlayerLoaded();
    }

    private listenNodeChange(parentNode: Node, callback: (element: Element, observer: MutationObserver) => void, options = { childList: true, subtree: true }): void {
        const observer: MutationObserver = new MutationObserver((mutations: MutationRecord[]) => {
            mutations.forEach((mutation: MutationRecord) => {
                mutation.addedNodes.forEach((node: Node) => {
                    if (node.nodeType !== Node.ELEMENT_NODE) return;
                    const element = node as Element;
                    callback(element, observer);
                });
            });
        });

        observer.observe(parentNode, options);
    }
    private listenPlayerLoaded(): void {
        this.listenNodeChange(document.body, (player: Element, observer: MutationObserver) => {
            if (player.matches('.video-js')) {
                this.player = player as HTMLVideoElement;
                this.playListId = this.player.getAttribute('data-playlist-id');
                if (!this.playListId) {
                    log.error('Player element not found!');
                    return;
                }
                log.info(`Player element found: ${this.playListId}`);
                this.listenVideoFullScreen();
                this.listenVideoLoaded(this.player);
                observer.disconnect();
            }
        });
    }

    private listenVideoFullScreen(): void {
        log.info('Start listening for full screen change.');
        (this.player as HTMLVideoElement).addEventListener('fullscreenchange', this.handleFullScreenChange.bind(this));
    }

    private handleFullScreenChange(): void {
        if (!document.fullscreenElement && this.player) {
            this.player.style.position = "absolute";
        }
    }

    private listenVideoLoaded(player: HTMLVideoElement): void {
        this.listenNodeChange(player, (video: Element, observer: MutationObserver) => {
            if (!this.video && video.matches('video')) {
                this.video = video as HTMLVideoElement;
                if (!this.video) {
                    log.error('Video element not found!');
                    return;
                }
                this.listenVideoProgress();
                observer.disconnect();
            }
        });
    }

    private listenVideoProgress(): void {
        log.info('Start listening for video progress.');
        (this.video as HTMLVideoElement).addEventListener('timeupdate', this.handleVideoProgress.bind(this));
    }

    private handleVideoProgress(): void {
        const videoId = this.getVideoId();
        if (!videoId) {
            log.error('Video ID not found!');
            return;
        }
        if (this.videoId !== videoId) {
            this.videoId = videoId;
            log.info(`Video element found: ${videoId}`);
            this.getVideoProgress(this.videoId as string);
            return;
        }
        const currentTime = (this.video as HTMLVideoElement).currentTime;
        this.saveVideoProgress(this.videoId as string, currentTime);
    }

    private getVideoId(): string {
        const poster = (this.video as HTMLVideoElement).getAttribute('poster') || '';
        const regex = /static\/([^/]+)\/([^/]+)\/([^/]+)/;
        const match = poster.match(regex);
        if (match) {
            const extractedString = `${match[1]}/${match[2]}/${match[3]}`;
            return extractedString;
        }
        return '';
    }

    private getVideoProgress(videoId: string): void {
        chrome.runtime.sendMessage({ type: 'getProgress', videoId }, {}, (response) => {
            if (response.currentTime) {
                (this.video as HTMLVideoElement).currentTime = response.currentTime;
                log.info(`Video progress restored: ${response.currentTime}`);
            }
        });
    }

    private saveVideoProgress(videoId: string, currentTime: number): void {
        // 增加节流操作，每 5 秒保存一次
        const saveInterval = 5000;
        if (Date.now() - this.lastSavedTime >= saveInterval) {
            chrome.runtime.sendMessage({ type: 'saveProgress', videoId, currentTime }, {}, (response) => {
                if (response.status === 'success') {
                    log.info(`Video progress saved: ${currentTime}`);
                    this.lastSavedTime = Date.now();
                } else {
                    log.error('Failed to save progress');
                }
            });
        }
    }
}

export default VideoAssistant;