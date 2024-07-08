class VideoCancelFullScreenFix {
    private video: HTMLVideoElement | null;

    constructor() {
        console.log('VideoCancelFullScreenFix initialized');
        this.video = null;
        this.listenVideoLoaded();
    }

    private listenVideoLoaded(): void {
        const observer: MutationObserver = new MutationObserver((mutations: MutationRecord[]) => {
            mutations.forEach((mutation: MutationRecord) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node: Node) => {
                        if (node.nodeType === Node.ELEMENT_NODE && (node as Element).matches('.video-js')) {
                            console.log('Video element found');
                            this.video = node as HTMLVideoElement;
                            this.listenVideoFullScreen();
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    private listenVideoFullScreen(): void {
        if (!this.video) {
            console.error('Video element not found');
            return;
        }
        this.video.addEventListener('fullscreenchange', this.handleFullScreenChange.bind(this));
    }

    private handleFullScreenChange(): void {
        if (!document.fullscreenElement && this.video) {
            this.video.style.position = "absolute";
        }
    }
}

export default VideoCancelFullScreenFix;