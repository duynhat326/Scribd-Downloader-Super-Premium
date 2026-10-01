<div align="center">

# Scribd Premium Downloader

**Save and back up Scribd documents directly from your browser.**<br/>
No external accounts. No third-party servers. Everything runs 100% locally on your machine.

[![Version](https://img.shields.io/badge/version-3.0.0-0f766e?style=flat-square)](https://github.com/duynhat326/Scribd-Downloader-Super-Premium/releases/latest)
[![Chrome](https://img.shields.io/badge/Chrome-✓-4285F4?style=flat-square&logo=googlechrome&logoColor=white)](https://github.com/duynhat326/Scribd-Downloader-Super-Premium/releases/latest)
[![Firefox](https://img.shields.io/badge/Firefox-✓-FF7139?style=flat-square&logo=firefox&logoColor=white)](https://github.com/duynhat326/Scribd-Downloader-Super-Premium/releases/latest)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE.md)

<br/>

[![Download](https://img.shields.io/badge/⬇️_Download_v3.0.0-0f766e?style=for-the-badge)](https://github.com/duynhat326/Scribd-Downloader-Super-Premium/releases/latest)

[Đọc bằng tiếng Việt](README-vi.md)

</div>

---

## What does it do?

Once installed, this extension adds a **floating panel** to every Scribd document page. From that panel, you can download the document using one of two methods:

| Mode | How it works | Output |
|------|-------------|--------|
| ⚡ **Extract from Server** | Reconstructs the original document images directly from the server, with Smart Stitching for split pages. | Highest-quality image-based PDF |
| 📷 **Secondary Scan** | Takes full-page screenshots for documents where server extraction is unavailable, preserving portrait or landscape pages. | Standard-quality image PDF |

> ⚠️ This extension only works on **publicly accessible** documents on Scribd.

---

## ⚡ Installation

Don't worry — it's easier than it looks! Just follow these three steps.

---

### Step 1 — Download the extension

Click the button below to download the latest release as a ZIP file:

[![Download](https://img.shields.io/badge/⬇️_Download_v3.0.0-0f766e?style=for-the-badge)](https://github.com/duynhat326/Scribd-Downloader-Super-Premium/releases/latest)

Once downloaded, **extract (unzip) the folder** to a permanent location on your computer. For example:

```
C:\Extensions\scribd-downloader\
```

> **Important:** Don't move or delete this folder after installing. Your browser needs the files to stay in the same place — if you move them, the extension will stop working.

---

### Step 2 — Build the extension

Open the folder you just extracted and **double-click `build.bat`**.

This script will automatically generate two ready-to-install folders:

```
scribd-downloader/
├── chrome/       ← For Chrome, Edge, and Brave
├── firefox/      ← For Firefox
└── ...
```

> ℹ️ If nothing happens when you double-click, right-click `build.bat` and select **"Run as administrator"**.

---

### Step 3 — Load the extension into your browser

Pick your browser below and follow the steps:

#### Chrome / Edge / Brave

1. Open a new tab and go to `chrome://extensions/` (or `edge://extensions/` for Edge).
2. Toggle on **"Developer mode"** — it's a switch in the **top-right corner**.
3. Click **"Load unpacked"**.
4. Browse to the folder from Step 2 and select the **`chrome/`** subfolder.

Your extension is now installed! You should see its icon in your browser toolbar.

#### Firefox

1. Open a new tab and go to `about:debugging#/runtime/this-firefox`.
2. Click **"Load Temporary Add-on..."**.
3. Navigate to the folder from Step 2, open the **`firefox/`** subfolder, and select the **`manifest.json`** file.

> ⚠️ **Firefox note:** Because the extension isn't signed through the Firefox Add-ons store, it gets removed every time you close the browser. You'll need to repeat Step 3 each time you open Firefox. This is a Firefox security limitation, not a bug.

---

## How to use it

### ⚡ Extract from Server (Recommended)

This mode extracts the original images directly from Scribd's servers to reconstruct a high-quality PDF, using Smart Stitching for split pages.

```
1. Open any public document on scribd.com.
2. The extension panel will appear on the screen.
3. Click "Premium Extraction" or expand "Alternative option" → "Extract from Server".
4. Wait — the extension will automatically trace and reconstruct each page.
5. When it's done, your PDF will download automatically.
```

### 📷 Secondary Scan

Use this mode when server extraction is unavailable for a document. It captures each visible page and creates an image-based PDF while keeping each page's portrait or landscape orientation.

```
1. Inside the viewer, expand "Alternative option" → "Secondary Scan".
2. Keep the Scribd tab open while the extension captures the document.
3. Wait for the final PDF to download automatically.
```

---

## Troubleshooting

**The floating panel doesn't appear**<br/>
→ Reload the page with `F5`. If the problem persists and you recently updated the extension, try re-running `build.bat` and reinstalling it from the extensions settings.

**Firefox shows "empty add-on" error**<br/>
→ Make sure you're selecting the `manifest.json` file inside the `firefox/` folder that was generated in Step 2 — not from any other location.

**Extract from Server stops or finds no pages**<br/>
→ Confirm that the document is publicly accessible, reload the page, and try again. If it still fails, use **Secondary Scan** instead.

---

## For developers

Interested in contributing or modifying the extension? Here's how the project is structured:

```
scribd-downloader/
│
├── src/                   ← Edit your source files here
│   ├── shared/            ← Code shared by both browsers
│   │   ├── content.js     ← Floating panel UI + extraction logic
│   │   ├── popup.html/js  ← Extension popup
│   │   ├── overlay.css    ← Panel styles
│   │   └── libs/          ← jsPDF, i18n helpers, shims
│   ├── chrome/
│   │   ├── manifest.json  ← Manifest v3 (service worker)
│   │   └── background.js  ← Chrome capture handler
│   └── firefox/
│       ├── manifest.json  ← Manifest v3 (service worker)
│       └── background.js  ← Firefox capture handler
│
├── chrome/                ← Auto-generated by build.bat — do not edit
├── firefox/               ← Auto-generated by build.bat — do not edit
│
└── build.bat              ← Build script: compiles src/ → chrome/ and firefox/
```

**Workflow:** Make your changes inside `src/`, then run `build.bat` to rebuild the installable folders. You can also run the build script from the terminal:

```bat
build.bat
```

---

## ⚠️ Legal disclaimer

This tool was built for **educational and research purposes only**. The author does not encourage or support the illegal distribution of copyrighted content.

You are **solely responsible** for how you use this extension. Only use it for documents you own, documents in the public domain, or in accordance with the copyright laws of your country.

---

<div align="center">

Made with ❤️ by **[HugoAleOlguin](https://github.com/HugoAleOlguin)**

[⭐ Star on GitHub](https://github.com/duynhat326/Scribd-Downloader-Super-Premium) · [🐛 Report a bug](https://github.com/duynhat326/Scribd-Downloader-Super-Premium/issues)

</div>
