const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');

for (const contentPath of [['src', 'shared', 'content.js'], ['chrome', 'content.js'], ['firefox', 'content.js']]) {
    const source = read(...contentPath);
    assert.equal((source.match(/doc\.addPage\(\[sw, sh\], sw > sh \? 'landscape' : 'portrait'\);/g) || []).length, 2);
    assert.match(source, /Native extraction failed on page/);
    assert.doesNotMatch(source, /open_external_downloader|sdl-bridge-btn|errCanvas/);
}

for (const i18nPath of [['src', 'shared', 'libs', 'i18n.js'], ['chrome', 'libs', 'i18n.js'], ['firefox', 'libs', 'i18n.js']]) {
    const i18n = require(path.join(root, ...i18nPath));
    assert.ok(i18n.vi?.popup?.step3 && i18n.vi?.overlay?.hq_native_btn);
    assert.deepEqual(Object.keys(i18n).sort(), ['en', 'vi']);
}

for (const backgroundPath of [['src', 'chrome', 'background.js'], ['src', 'firefox', 'background.js'], ['chrome', 'background.js'], ['firefox', 'background.js']]) {
    assert.doesNotMatch(read(...backgroundPath), /open_external_downloader|vdownloaders|injectAutopilot/);
}

assert.match(read('README.md'), /Tiện ích trình duyệt/);
for (const popupPath of [['src', 'shared', 'popup.html'], ['chrome', 'popup.html'], ['firefox', 'popup.html']]) {
    assert.equal((read(...popupPath).match(/class="lang-btn/g) || []).length, 2);
}
