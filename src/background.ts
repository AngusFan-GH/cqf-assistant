// background.ts
(chrome as any).action.onClicked.addListener((tab: any) => {
    if (tab.id) {
        (chrome as any).scripting.executeScript({
            target: { tabId: tab.id },
            files: ['inject.js']
        });
    }
});
