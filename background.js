chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'checkGuides') {
        const appId = message.appId;
        const guideUrl = `https://steamcommunity.com/app/${appId}/guides/?searchText=українізатор&browsefilter=trend&requiredtags%5B%5D=-1`;

        fetch(guideUrl)
            .then((res) => res.text())
            .then((html) => {
                const hasGuide = html.includes('workshopItemTitle');
                sendResponse({ hasGuide });
            })
            .catch((error) => {
                console.error('Steam fetch error:', error);
                sendResponse({ hasGuide: false });
            });

        return true;
    }
});
