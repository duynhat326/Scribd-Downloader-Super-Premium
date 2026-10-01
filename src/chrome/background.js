/**
 * Scribd Premium Downloader
 * Background - Chrome / Chromium / Edge / Brave
 *
 * Uses a Manifest V3 service worker for page captures, source-image fetches,
 * and PDF downloads.
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'capture_tab') {
        chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
            if (chrome.runtime.lastError) {
                sendResponse({ success: false, error: chrome.runtime.lastError.message });
            } else {
                sendResponse({ success: true, image: dataUrl });
            }
        });
        return true;
    }

    if (request.action === 'fetch_image') {
        fetch(request.url, { credentials: 'include' })
            .then(response => {
                if (!response.ok) throw new Error(`Image request failed (${response.status})`);
                if (!response.headers.get('content-type')?.startsWith('image/')) {
                    throw new Error('Server did not return an image');
                }
                return response.blob();
            })
            .then(blob => {
                if (!blob.size) throw new Error('Server returned an empty image');
                const reader = new FileReader();
                reader.onloadend = () => sendResponse({ success: true, data: reader.result });
                reader.onerror = () => sendResponse({ success: false, error: 'Could not read the image' });
                reader.readAsDataURL(blob);
            })
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (request.action === 'download_pdf') {
        try {
            const safeFilename = request.filename.replace(/[^a-z0-9\s\-_\u00C0-\u00FF\.]/gi, '').trim().replace(/\s+/g, '_');
            chrome.downloads.download({
                url: request.url,
                filename: safeFilename,
                saveAs: false
            }, (downloadId) => {
                if (chrome.runtime.lastError) sendResponse({ success: false, error: chrome.runtime.lastError.message });
                else sendResponse({ success: true, id: downloadId });
            });
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
        return true;
    }
});

// Keep the Manifest V3 worker alive while a long scan is active.
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'spd-keepalive') port.onDisconnect.addListener(() => {});
});
