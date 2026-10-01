/**
 * Scribd Premium Downloader
 * Popup Logic with i18n
 * @version 2.7.0
 */

// I18n is loaded from libs/i18n.js

function updateUI(lang) {
    if (!window.I18n || !window.I18n[lang]) return;

    const t = window.I18n[lang].popup;

    document.getElementById('txt-title').innerText = t.title;
    document.getElementById('txt-subtitle').innerText = t.subtitle;
    document.getElementById('txt-status').innerText = t.status;

    // Use innerHTML because translations may contain <strong> tags.
    document.getElementById('txt-step1').innerHTML = t.step1;
    document.getElementById('txt-step2').innerHTML = t.step2;
    document.getElementById('txt-step3').innerHTML = t.step3;
    document.getElementById('txt-footer').innerText = t.footer;

    document.querySelectorAll('.lang-btn').forEach(button => {
        button.classList.toggle('active', button.id === `btn-${lang}`);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Load saved preference
    chrome.storage.local.get(['language'], (result) => {
        const lang = ['en', 'vi'].includes(result.language) ? result.language : 'vi';
        updateUI(lang);
    });

    ['en', 'vi'].forEach(lang => {
        document.getElementById(`btn-${lang}`).addEventListener('click', () => {
            chrome.storage.local.set({ language: lang }, () => updateUI(lang));
        });
    });
});
