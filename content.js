(function () {
    const match = window.location.pathname.match(/\/app\/(\d+)/);
    if (!match) return;

    const appId = match[1];

    chrome.runtime.sendMessage({ type: 'checkGuides', appId }, (response) => {
        if (hasUkrainianLocalization()) {
            const tag = document.createElement('div');
            tag.id = 'ukrainian-localization-tag';
            tag.textContent = 'єЛокалізація';

            const imageContainer = document.querySelector('.game_header_image_ctn');
            if (imageContainer) {
                imageContainer.appendChild(tag);
            }
        }
        if (!response || !response.hasGuide) return;

        const guideUrl = `https://steamcommunity.com/app/${appId}/guides/?searchText=українізатор&browsefilter=trend&requiredtags%5B%5D=-1`;

        const imageContainer = document.querySelector('.game_header_image_ctn');
        if (imageContainer) {
            const button = document.createElement('a');
            button.id = 'ukrainizer-button';
            button.href = guideUrl;
            button.textContent = 'єУкраїнізатор';
            button.target = '_blank';
            imageContainer.appendChild(button);
        }
    });

    function hasUkrainianLocalization() {
        const rows = document.querySelectorAll('.game_language_options tr');
        for (const row of rows) {
            const firstCell = row.querySelector('td');
            if (!firstCell) continue;
            const langName = firstCell.textContent.trim().toLowerCase();
            if (langName !== 'українська') continue;

            return row.innerHTML.includes('✔');
        }
        return false;
    }

})();
