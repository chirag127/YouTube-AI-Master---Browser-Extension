import { readFileSync, writeFileSync } from 'fs';

const sectionFiles = [
    'extension/options/sections/ai-config.html',
    'extension/options/sections/external-apis.html',
    'extension/options/sections/notifications.html',
    'extension/options/sections/performance.html',
    'extension/options/sections/scroll.html',
    'extension/options/sections/transcript.html',
];

const idMap = {
    apiKey: 'section-apiKey',
    customPrompt: 'section-customPrompt',
    tmdbApiKey: 'section-tmdbApiKey',
    googleFactCheckApiKey: 'section-googleFactCheckApiKey',
    newsDataApiKey: 'section-newsDataApiKey',
    igdbClientId: 'section-igdbClientId',
    igdbAccessToken: 'section-igdbAccessToken',
    sponsorBlockTimeout: 'section-sponsorBlockTimeout',
    deArrowTimeout: 'section-deArrowTimeout',
    maxConcurrentRequests: 'section-maxConcurrentRequests',
    rateLimitDelay: 'section-rateLimitDelay',
    retryAttempts: 'section-retryAttempts',
    retryDelay: 'section-retryDelay',
    notificationsEnabled: 'section-notificationsEnabled',
    notificationPosition: 'section-notificationPosition',
    notificationDuration: 'section-notificationDuration',
    notificationSound: 'section-notificationSound',
    transcriptAutoCloseDelay: 'section-transcriptAutoCloseDelay',
    autoScrollDelay: 'section-autoScrollDelay',
};

sectionFiles.forEach(file => {
    let content = readFileSync(file, 'utf8');
    let modified = false;

    Object.entries(idMap).forEach(([oldId, newId]) => {
        const idRegex = new RegExp(`id="${oldId}"`, 'g');
        const nameRegex = new RegExp(`name="${oldId}"`, 'g');
        const forRegex = new RegExp(`for="${oldId}"`, 'g');

        if (content.match(idRegex)) {
            content = content.replace(idRegex, `id="${newId}"`);
            content = content.replace(nameRegex, `name="${newId}"`);
            content = content.replace(forRegex, `for="${newId}"`);
            modified = true;
        }
    });

    if (modified) {
        writeFileSync(file, content, 'utf8');
        console.log(`Fixed: ${file}`);
    }
});

console.log('Duplicate ID fixes complete');
