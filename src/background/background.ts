// background.ts
import { URL } from '../common/modal';

// set the default value of videoProgress
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ videoProgress: {} });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse: any) => {
    if (message.type === 'saveProgress') {
        chrome.storage.sync.get('videoProgress', (data) => {
            const videoProgress = data.videoProgress || {};
            videoProgress[message.videoId] = message.currentTime;
            chrome.storage.sync.set({ videoProgress }, () => {
                sendResponse({ status: 'success' });
            });
        });
        return true; // Keep the message channel open for sendResponse
    }

    if (message.type === 'getProgress') {
        chrome.storage.sync.get('videoProgress', (data) => {
            sendResponse({ currentTime: data.videoProgress[message.videoId] || 0 });
        });
        return true; // Keep the message channel open for sendResponse
    }

    return false; // Close the message channel
});

// open the web when the icon is clicked
chrome.action.onClicked.addListener(() => {
    chrome.windows.create({
        url: URL,
        type: 'panel'
    });
});

// inject the script
chrome.action.onClicked.addListener((tab: any) => {
    if (tab.url && tab.url.startsWith(URL)) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content/content.js']
        });
    }
});
