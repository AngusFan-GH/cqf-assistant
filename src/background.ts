// background.ts
const HOST = 'https://learn.cqf.com';
(chrome as any).action.onClicked.addListener((tab: any) => {
    if (tab.url && tab.url.startsWith(HOST)) {
        (chrome as any).scripting.executeScript({
            target: { tabId: tab.id },
            files: ['inject.js']
        });
    }
});
