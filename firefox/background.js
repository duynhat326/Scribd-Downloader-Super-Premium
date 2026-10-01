/**
 * Scribd Premium Downloader
 * Background - Mozilla Firefox
 */

browser.runtime.onMessage.addListener(async (request) => {
    if (request.action === 'capture_tab') {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (!tab?.windowId) return { success: false, error: 'No active window found' };
        try {
            return { success: true, image: await browser.tabs.captureVisibleTab(tab.windowId, { format: 'png' }) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    if (request.action === 'fetch_image') {
        try {
            const response = await fetch(request.url, { credentials: 'include' });
            if (!response.ok) throw new Error(`Image request failed (${response.status})`);
            if (!response.headers.get('content-type')?.startsWith('image/')) {
                throw new Error('Server did not return an image');
            }
            const blob = await response.blob();
            if (!blob.size) throw new Error('Server returned an empty image');
            const data = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = () => reject(new Error('Could not read the image'));
                reader.readAsDataURL(blob);
            });
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    if (request.action === 'download_pdf') {
        try {
            const safeFilename = request.filename.replace(/[^a-z0-9\s\-_\u00C0-\u00FF\.]/gi, '').trim().replace(/\s+/g, '_');
            return {
                success: true,
                id: await browser.downloads.download({ url: request.url, filename: safeFilename, saveAs: false })
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
});
