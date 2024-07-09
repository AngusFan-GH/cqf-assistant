
import VideoAssistant from "./video-assistant";

new VideoAssistant();

// injectScript({ file: 'content/record-video.js' });

// window.addEventListener('message', (event) => {
//     if (event.source !== window) return;

//     if (event.data.type === 'saveProgress') {
//         chrome.runtime.sendMessage(
//             { type: 'saveProgress', videoId: event.data.videoId, currentTime: event.data.currentTime },
//             {},
//             (response) => {
//                 if (response.status !== 'success') {
//                     console.error('Failed to save progress');
//                 }
//             }
//         );
//     }

//     if (event.data.type === 'getProgress') {
//         chrome.runtime.sendMessage({ type: 'getProgress', videoId: event.data.videoId }, {}, (response) => {
//             window.postMessage({ type: 'progressResponse', videoId: event.data.videoId, currentTime: response.currentTime }, '*');
//         });
//     }
// });