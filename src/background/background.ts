// background.ts
import { URL } from '../common/modal';

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
