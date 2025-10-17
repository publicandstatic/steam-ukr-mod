chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'checkGuides') {
        const appId = message.appId;

        const terms = ['українізатор', 'українська локалізація', 'українська текстова локалізація'];

        const buildUrl = (t) =>
            `https://steamcommunity.com/app/${appId}/guides/?searchText=${encodeURIComponent(
                t
            )}&browsefilter=trend&requiredtags%5B%5D=-1`;

        const fetchWithTimeout = (url, ms = 10000) => {
            const ctrl = new AbortController();
            const id = setTimeout(() => ctrl.abort(), ms);
            return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(id));
        };

        Promise.allSettled(
            terms.map((t) =>
                fetchWithTimeout(buildUrl(t))
                    .then((res) => res.text())
                    .then((html) => ({
                        term: t,
                        hasGuide: html.includes('workshopItemTitle'),
                    }))
            )
        )
            .then((results) => {
                const anyHit = results.some((r) => r.status === 'fulfilled' && r.value.hasGuide);

                const details = results.filter((r) => r.status === 'fulfilled').map((r) => r.value);

                sendResponse({ hasGuide: anyHit, details });
            })
            .catch((err) => {
                console.error('Steam fetch error:', err);
                sendResponse({ hasGuide: false });
            });

        return true;
    }
});
