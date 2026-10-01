/**
 * Scribd Premium Downloader
 * Content Script with i18n
 * @version 3.0.0
 */

// I18n loaded from libs/i18n.js




const AppState = {
  currentDocId: null,
  isProcessing: false,
  cachedName: null,
  language: 'vi' // Default
};

// ... Utils and PDFHandler (unchanged) ...
const Utils = {
  getDocumentId: () => {
    try {
      const url = window.location.href;
      let match = url.match(/(?:doc|document|embeds|read|book|audiobook)\/(\d+)/);
      if (match) return match[1];
      const iosUrl = document.querySelector('meta[property="al:ios:url"]');
      if (iosUrl) {
        match = iosUrl.content.match(/scribd:\/\/doc\/(\d+)/);
        if (match) return match[1];
      }
      return null;
    } catch (e) { return null; }
  },
  isEmbedView: () => window.location.href.includes('/embeds/'),
  countPages: () => document.querySelectorAll("div.outer_page_container div[id^='outer_page_']").length,
  sendMessageAsync: (msg) => new Promise(resolve => {
    try {
      chrome.runtime.sendMessage(msg, response => resolve(response || {}));
    } catch (e) {
      resolve({ success: false, error: e.message });
    }
  }),
  getJsPDF: () => {
    // In a Chrome MV3 content script, the jsPDF UMD bundle uses the GLOBAL
    // branch because module and exports are unavailable inside this IIFE.
    if (window.jspdf?.jsPDF) return window.jspdf.jsPDF;
    if (globalThis.jspdf?.jsPDF) return globalThis.jspdf.jsPDF;

    // Compatibility fallback for bundles that use a different export.
    if (window.jspdf?.default) return window.jspdf.default;

    // Older builds exposed the class directly as window.jsPDF.
    if (typeof window.jsPDF === 'function') return window.jsPDF;

    return null;
  },
  getCleanFilename: () => {
    try {
      let result = "Scribd_Document";
      if (AppState.cachedName) result = AppState.cachedName;
      else {
        const specificTitle = document.querySelector('[data-e2e="doc_page_title"]');
        if (specificTitle && specificTitle.innerText.trim()) result = specificTitle.innerText;
        else {
          const embedTitle = document.querySelector('.title');
          if (embedTitle && embedTitle.innerText.trim()) result = embedTitle.innerText;
          else {
            let docTitle = document.title || "";
            result = docTitle.replace(/\| Scribd/gi, '').replace(/Scribd/gi, '');
          }
        }
      }
      result = sanitizeFilename(result);
      if (!result) return `Scribd_Document_${Date.now()}`;
      return result.substring(0, 120); // Keep Windows filenames within their limit.
    } catch (e) { return `Scribd_Document_${Date.now()}`; }
  },
  saveDocName: (id, name) => {
    if (!id) return;
    const data = {};
    if (name) data[`doc_${id}`] = name;
    chrome.storage.local.set(data);
  },
  loadDocData: (id) => {
    return new Promise(resolve => {
      chrome.storage.local.get(`doc_${id}`, (result) => {
        resolve({ name: result[`doc_${id}`] || null });
      });
    });
  }
};

const PDFHandler = {
  init: () => {
    const JsPDF = Utils.getJsPDF();
    if (!JsPDF) throw new Error('PDF library did not load. Reload the page or reinstall the extension.');
    const doc = new JsPDF({ orientation: 'p', unit: 'pt', format: 'a4', compress: true });
    doc.deletePage(1);
    return doc;
  },
  // Legacy compatibility path.
  addPage: (doc, imgData, rect) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const dpr = window.devicePixelRatio || 1;
          let sx = rect.x * dpr, sy = rect.y * dpr, sw = rect.width * dpr, sh = rect.height * dpr;
          canvas.width = sw; canvas.height = sh;
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

          doc.addPage([sw, sh], sw > sh ? 'landscape' : 'portrait');
          doc.addImage(canvas.toDataURL('image/jpeg', 0.85), 'JPEG', 0, 0, sw, sh, undefined, 'FAST');
          resolve();
        } catch (err) { reject(err); }
      };
      img.onerror = () => reject(new Error("Image Load Error"));
      img.src = imgData;
    });
  },
  // The html2canvas data URL is already rendered and cropped to the element.
  addPageFromCanvas: (doc, dataUrl, rect) => {
    return new Promise((resolve, reject) => {
      try {
        const sw = rect.width; const sh = rect.height;
        doc.addPage([sw, sh], sw > sh ? 'landscape' : 'portrait');

        let format = undefined;
        if (dataUrl.startsWith('data:image/jpeg')) format = 'JPEG';
        else if (dataUrl.startsWith('data:image/png')) format = 'PNG';
        else if (dataUrl.startsWith('data:image/webp')) format = 'WEBP';

        doc.addImage(dataUrl, format, 0, 0, sw, sh, undefined, 'FAST');
        resolve();
      } catch (err) { reject(err); }
    });
  }
};

// Capture an element as a data URL without relying on the service worker.
async function captureElementWithHtml2Canvas(element) {
  if (typeof html2canvas !== 'function') {
    throw new Error('html2canvas is unavailable. Reload the extension.');
  }
  const canvas = await html2canvas(element, {
    useCORS: true,
    allowTaint: true,
    scale: window.devicePixelRatio || 1,
    backgroundColor: '#ffffff',
    logging: false,
    // Keep the extension overlay out of the capture.
    ignoreElements: (el) => el.id === 'sdl-overlay' || el.id === 'spd-clean-style'
  });
  return canvas.toDataURL('image/png');
}

async function executeHQScan(mode = 'quality') {
  if (AppState.isProcessing) return;
  AppState.isProcessing = true;

  // Robust Fallback for HQ Scan states
  const FallbackStates = { loading: 'Đang tải...', saving: 'Đang lưu...', success: 'Hoàn tất!', error: 'Lỗi: ' };
  const I18nSafe = window.I18n || { vi: { overlay: { states: FallbackStates } } };
  const T = I18nSafe[AppState.language]?.overlay?.states || I18nSafe.vi?.overlay?.states || I18nSafe.en?.overlay?.states || FallbackStates;

  // Chrome and Firefox 126+ support CSS zoom; transform:scale does not reflow.
  const applyZoom = (level) => {
    document.documentElement.style.zoom = level;
  };
  const resetZoom = () => {
    document.documentElement.style.zoom = '';
  };

  // Keep a Chrome MV3 service worker alive during long scans.
  function openSWKeepalive() {
    try {
      const port = chrome.runtime.connect({ name: 'spd-keepalive' });
      // Firefox can disconnect before this interval is cleared.
      const interval = setInterval(() => {
        try { port.postMessage('ping'); }
        catch (_) { clearInterval(interval); }
      }, 20000);
      port.onDisconnect.addListener(() => clearInterval(interval));
      return port;
    } catch (e) {
      // Firefox uses a persistent background page.
      return null;
    }
  }

  Interface.updateState('loading', T.loading);
  const originalOverflow = document.body.style.overflow;
  // Open the keepalive port before starting the scan.
  const keepalivePort = openSWKeepalive();

  try {
    const styleEl = document.createElement('style');
    styleEl.id = 'spd-clean-style';
    styleEl.innerHTML = `.toolbar_drop, .global_header, .mobile_overlay, #scribd_c_wrapper, .promo_banner { display: none !important; } .document_scroller { overflow: hidden !important; padding: 0 !important; margin: 0 !important; } .outer_page_container { margin: 0 auto !important; padding: 0 !important; border: none !important; box-shadow: none !important; } body { background: #fff !important; overflow: hidden !important; }`;
    document.head.appendChild(styleEl);

    const pages = document.querySelectorAll("div.outer_page_container div[id^='outer_page_']");
    const total = pages.length;
    if (total === 0) throw new Error("No pages found.");

    const fname = Utils.getCleanFilename();

    // Find the scrolling container once; programmatic scrolling still works with overflow:hidden.
    const scrollContainer = (() => {
      let node = pages[0]?.parentElement;
      while (node && node !== document.documentElement) {
        const ov = getComputedStyle(node).overflow + getComputedStyle(node).overflowY;
        if (/(hidden|scroll|auto)/.test(ov)) return node;
        node = node.parentElement;
      }
      return document.scrollingElement || document.documentElement;
    })();

    const pdf = PDFHandler.init();

    // Pause when the tab is hidden to avoid capturing the wrong tab.
    const ensureVisible = async () => {
      if (!document.hidden) return;
      const prevBtn = document.querySelector('#sdl-overlay .sdl-scanning');
      const titleEl = prevBtn ? (prevBtn.querySelector('.sdl-btn-title') || prevBtn.querySelector('span:first-child')) : null;
      const prevText = titleEl ? titleEl.innerText : T.loading;

      Interface.updateState('loading', '⚠️ TẠM DỪNG - Hãy quay lại tab này!');
      document.title = '⚠️ TẠM DỪNG - Hãy quay lại tab này';

      await new Promise(resolve => {
        const handler = () => {
          if (!document.hidden) {
            document.removeEventListener('visibilitychange', handler);
            resolve();
          }
        };
        document.addEventListener('visibilitychange', handler);
      });

      document.title = fname ? fname.substring(0, 20) : "Scribd Premium";
      Interface.updateState('loading', prevText);
      await new Promise(r => setTimeout(r, 600));
    };

    for (let i = 0; i < total; i++) {
      const page = pages[i];

      // Measure at 100% zoom so PDF dimensions retain the original aspect ratio.
      resetZoom();
      page.scrollIntoView({ behavior: 'instant', block: 'start' });
      await new Promise(r => setTimeout(r, 900));

      const dpr = window.devicePixelRatio || 1;
      const vh = window.innerHeight;

      const firstRect = page.getBoundingClientRect();
      let pageW = firstRect.width;
      let pageH = firstRect.height;

      const overlay = document.getElementById('sdl-overlay');
      // Keep the interface visible during native extraction.
      if (overlay && mode !== 'native') overlay.style.display = 'none';
      if (mode !== 'native') await new Promise(r => setTimeout(r, 100));

      await ensureVisible();
      console.log(`[Native-Debug] ------- PAGE ${i + 1} START -------`);

      // Wait for visible lazy-loaded images before capturing.
      const waitImagesLoaded = () => new Promise(resolve => {
        const imgs = Array.from(page.querySelectorAll('img'))
          .filter(img => {
            const r = img.getBoundingClientRect();
            return r.top < window.innerHeight && r.bottom > 0 && r.width > 4;
          });
        const pending = imgs.filter(img => !img.complete);
        if (!pending.length) { requestAnimationFrame(resolve); return; }
        let done = 0;
        const onDone = () => { if (++done >= pending.length) resolve(); };
        pending.forEach(img => {
          img.addEventListener('load', onDone, { once: true });
          img.addEventListener('error', onDone, { once: true });
        });
        setTimeout(resolve, 2000);
      });

      let dataUrl;
      let currentMode = mode;

      // Multiple image fragments require the screen-capture fallback.
      if (currentMode === 'native') {
        const imgEls = Array.from(page.querySelectorAll('img.absimg, img[src*="html.scribdassets"], img.orig_image'));

        if (imgEls.length > 1) {
          console.log(`[Native-Debug] Page ${i + 1}: ${imgEls.length} fragments detected; using screen capture.`);
          currentMode = 'fit';
        }
      }

      if (currentMode === 'native') {
        console.log(`[Native-Debug] Starting native image extraction for page ${i + 1}.`);

        await waitImagesLoaded();
        const imgEls = Array.from(page.querySelectorAll('img.absimg, img[src*="html.scribdassets"], img.orig_image'))
          .filter(img => img.getBoundingClientRect().width > 50 && img.getBoundingClientRect().height > 50);

        if (imgEls.length > 0) {
          const imgEl = imgEls[0];
          const imageUrl = imgEl.currentSrc || imgEl.src;
          if (imageUrl.startsWith('data:image/')) {
            dataUrl = imageUrl;
            pageW = imgEl.naturalWidth || pageW;
            pageH = imgEl.naturalHeight || pageH;
          } else if (imageUrl.startsWith('http')) {
            console.log(`[Native-Debug] Page ${i + 1}: Fetching URL = ${imageUrl}`);
            await ensureVisible();

            const reqPromise = Utils.sendMessageAsync({ action: 'fetch_image', url: imageUrl });
            const timeoutFetch = new Promise(resolve => setTimeout(() => resolve({ success: false, error: 'TIMEOUT_EN_BACKGROUND_FETCH' }), 10000));

            let req;
            try { req = await Promise.race([reqPromise, timeoutFetch]); }
            catch (e) { req = { success: false, error: e.message }; }

            if (req && req.success && req.data) {
              const imgLoadPromise = new Promise(r => {
                const tmpImg = new Image();
                let finished = false;
                const end = () => { if (!finished) { finished = true; r(tmpImg); } };
                tmpImg.onload = end;
                tmpImg.onerror = end;
                tmpImg.src = req.data;
                setTimeout(end, 5000);
              });

              const tmpImg = await imgLoadPromise;
              if (tmpImg && tmpImg.width > 0) {
                dataUrl = req.data;
                pageW = tmpImg.width;
                pageH = tmpImg.height;
                console.log(`[Native-Debug] Page ${i + 1}: Native image applied (${pageW}x${pageH}).`);
              }
            } else {
              console.error(`[Native-Debug] Page ${i + 1}: Background image fetch failed.`);
            }
          }
        }

        if (!dataUrl) {
          console.warn(`[SPD] Native extraction failed on page ${i + 1}; using the page capture instead.`);
          currentMode = 'fit';
        }
      }

      if (currentMode === 'fit') {
        // Fit the whole page in the viewport before taking one uninterrupted capture.

        const zoomRatio = Math.min(1.0, (vh * 0.95) / pageH);
        const needsZoom = zoomRatio < 1.0;

        if (needsZoom) {
          applyZoom(zoomRatio);
          await new Promise(r => setTimeout(r, 400));
          page.scrollIntoView({ behavior: 'instant', block: 'start' });
          await new Promise(r => setTimeout(r, 200));
        }

        await waitImagesLoaded();

        const fitRect = page.getBoundingClientRect();
        const fitCanvas = document.createElement('canvas');
        fitCanvas.width = Math.round(fitRect.width * dpr);
        fitCanvas.height = Math.round(fitRect.height * dpr);
        const fitCtx = fitCanvas.getContext('2d');

        await ensureVisible();
        const res = await Utils.sendMessageAsync({ action: 'capture_tab' });
        if (res.success && res.image) {
          await new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
              fitCtx.drawImage(
                img,
                Math.round(fitRect.left * dpr),
                Math.round(Math.max(0, fitRect.top) * dpr),
                Math.round(fitRect.width * dpr),
                Math.round(fitRect.height * dpr),
                0, 0, fitCanvas.width, fitCanvas.height
              );
              resolve();
            };
            img.onerror = resolve;
            img.src = res.image;
          });
        } else {
          console.warn('[SPD] capture_tab failed for page', i + 1, res.error);
        }

        if (needsZoom) resetZoom();

        // Preserve unscaled dimensions for the PDF page.
        dataUrl = fitCanvas.toDataURL('image/png');
      }

      // Restore the overlay and add the page to the PDF.
      if (overlay) overlay.style.display = 'flex';
      console.log(`[Native-Debug] Page ${i + 1}: Adding ${pageW}x${pageH} to the PDF.`);

      try {
        await PDFHandler.addPageFromCanvas(pdf, dataUrl, { width: pageW, height: pageH });
        console.log(`[Native-Debug] Page ${i + 1}: Image inserted.`);
      } catch (errPDF) {
        console.error(`[Native-Debug] Page ${i + 1}: Could not add image to PDF:`, errPDF);
      }

      const pct = Math.round(((i + 1) / total) * 100);
      Interface.updateProgress(pct, `${i + 1}/${total}`);
      console.log(`[Native-Debug] ------- PAGE ${i + 1} END -------`);
    }

    Interface.updateState('saving', T.saving);

    try {
      const b64 = pdf.output('datauristring');
      console.log('[Native-Debug] Sending the PDF to the downloads API.');
      const downloadCmd = await Utils.sendMessageAsync({ action: 'download_pdf', url: b64, filename: `${fname}.pdf` });

      if (!downloadCmd || !downloadCmd.success) {
        console.warn('[Native-Debug] Background download failed; using jsPDF fallback.', downloadCmd?.error);
        pdf.save(`${fname}.pdf`);
      } else {
        console.log('[Native-Debug] Background download started:', downloadCmd.id);
      }
    } catch (saveErr) {
      console.error('[Native-Debug] Falling back to pdf.save():', saveErr);
      pdf.save(`${fname}.pdf`);
    }

    await new Promise(r => setTimeout(r, 800));

    Interface.updateState('success', T.success);

    // Restore page state and close the keepalive connection.
    keepalivePort?.disconnect();
    resetZoom();
    document.body.style.overflow = originalOverflow || '';
    document.getElementById('spd-clean-style')?.remove();
    setTimeout(() => { AppState.isProcessing = false; document.getElementById('sdl-overlay')?.remove(); }, 5000);

  } catch (e) {
    console.error('[Native-Debug] Scan failed:', e);
    keepalivePort?.disconnect();
    resetZoom();
    document.body.style.overflow = originalOverflow || '';
    document.getElementById('spd-clean-style')?.remove();
    Interface.updateState('error', T.error + e.message);
    AppState.isProcessing = false;
    if (document.getElementById('sdl-overlay')) document.getElementById('sdl-overlay').style.display = 'flex';
  }
}

function sanitizeFilename(name) {
  return name.replace(/[\r\n]+/g, ' ')
    .replace(/[^a-zA-Z0-9\s-_\u00C0-\u00FF]/g, '')
    .trim()
    .replace(/\s+/g, '_');
}

// --- UI Interface ---

const Interface = {
  render: async () => {
    if (document.getElementById('sdl-overlay')) return;
    const docId = Utils.getDocumentId();
    if (!docId) return;
    const isEmbed = Utils.isEmbedView();

    // Load the saved language; an extension reload can invalidate this context.
    try {
      chrome.storage.local.get(['language'], (res) => {
        if (chrome.runtime.lastError) {
          AppState.language = 'vi';
        } else {
          AppState.language = ['en', 'vi'].includes(res?.language) ? res.language : 'vi';
        }
        Interface.draw(docId, isEmbed);
      });
    } catch (e) {
      AppState.language = 'vi';
      Interface.draw(docId, isEmbed);
    }
  },

  draw: async (docId, isEmbed) => {
    let storedData = { name: null };
    try { storedData = await Utils.loadDocData(docId); } catch (e) { }

    if (!isEmbed) {
      const rawName = Utils.getCleanFilename();
      if (rawName && rawName !== 'Scribd_Document') {
        Utils.saveDocName(docId, rawName);
        AppState.cachedName = rawName;
      }
    } else {
      if (storedData.name) AppState.cachedName = storedData.name;
    }

    const docName = AppState.cachedName || Utils.getCleanFilename();

    // Fallback used only when the translation library has not loaded.
    const FallbackI18n = {
      vi: {
        overlay: {
          title: '⚡ Scribd Premium', id: 'ID:', file: 'Tệp:', pages: 'Trang:', analyzing: 'Đang đếm trang...',
          activate: 'Mở chế độ tải xuống',
          hq_native_btn: 'Trích xuất từ máy chủ', hq_native_sub: 'Chất lượng ảnh gốc', hq_native_badge: 'TỐI ƯU',
          hq_native_tooltip: 'Tải ảnh gốc trực tiếp từ máy chủ để giữ chất lượng cao nhất.',
          hq_fit_btn: 'Chụp dự phòng', hq_fit_sub: 'Chụp toàn màn hình', hq_fit_badge: 'TIÊU CHUẨN',
          hq_fit_tooltip: 'Chụp tài liệu trên màn hình nếu không thể trích xuất từ máy chủ.',
          hq_btn: 'Trích xuất Premium', hq_badge: 'ĐỀ XUẤT', hq_tooltip: 'Tạo PDF từ từng trang.',
          states: { loading: 'Đang chuẩn bị trích xuất...', saving: 'Đang tạo PDF...', success: 'Đã lưu PDF thành công!', error: 'Đã xảy ra lỗi: ' }
        }
      }
    };
    const I18nSafe = window.I18n || FallbackI18n;
    const T = I18nSafe[AppState.language]?.overlay || I18nSafe.vi?.overlay || I18nSafe.en?.overlay || FallbackI18n.vi.overlay;

    const overlay = document.createElement('div');
    overlay.id = 'sdl-overlay';

    let contentHtml = `
            <div class="sdl-card sdl-glass">
                <div class="sdl-header">
                    <span class="sdl-brand">${T.title}</span>
                    <button class="sdl-close">×</button>
                </div>
                <div class="sdl-info-grid">
                    <div class="sdl-row"><span class="sdl-label">${T.id}</span><span class="sdl-value">${docId}</span></div>
                    <div class="sdl-row"><span class="sdl-label">${T.file}</span><span class="sdl-value sdl-truncate" title="${docName}">${docName}</span></div>
        `;

    if (!isEmbed) {
      contentHtml += `
                </div>
                <div class="sdl-actions">
                    <div class="sdl-btn-container">
                        <button id="sdl-action-btn" class="sdl-btn sdl-btn-glow">
                            <span>${T.activate}</span>
                            <span class="sdl-badge">GO</span>
                        </button>
                    </div>
                </div>
            `;
    } else {
      const pageCount = Utils.countPages();

      contentHtml += `
                    <div class="sdl-row"><span class="sdl-label">${T.pages}</span><span class="sdl-value">${pageCount > 0 ? pageCount : T.analyzing}</span></div>
                </div>
                <div class="sdl-progress-track"><div id="sdl-progress-fill"></div></div>

                 <div class="sdl-actions">

                    <!-- Scan modes -->
                    <div class="sdl-btn-container" style="margin-bottom: 8px;">
                        <button id="sdl-hq-native-btn" class="sdl-btn sdl-btn-primary sdl-btn-twoline" style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); border-color: #7c3aed;">
                            <div class="sdl-btn-body">
                                <span class="sdl-btn-title">${T.hq_native_btn || 'Trích xuất từ máy chủ'}</span>
                                <span class="sdl-btn-sub">${T.hq_native_sub || 'Chất lượng ảnh gốc'}</span>
                            </div>
                            <span class="sdl-badge safe" style="background: #a855f7;">${T.hq_native_badge || 'ĐỀ XUẤT'}</span>
                        </button>
                        <span class="sdl-tooltip">${T.hq_native_tooltip || T.hq_tooltip}</span>
                    </div>

                    <div class="sdl-btn-container">
                        <button id="sdl-hq-fit-btn" class="sdl-btn sdl-btn-fit sdl-btn-twoline">
                            <div class="sdl-btn-body">
                                <span class="sdl-btn-title">${T.hq_fit_btn || 'Chụp dự phòng'}</span>
                                <span class="sdl-btn-sub">${T.hq_fit_sub || 'Chụp toàn màn hình'}</span>
                            </div>
                            <span class="sdl-badge">${T.hq_fit_badge || 'COMPATIBLE'}</span>
                        </button>
                        <span class="sdl-tooltip">${T.hq_fit_tooltip || ''}</span>
                    </div>

                </div>
                
                <div id="sdl-feedback-container" style="display:none; text-align:center; margin-top:12px; font-size: 13px; color: #d1d5db; line-height: 1.4;"></div>
            `;
    }

    overlay.innerHTML = contentHtml;
    document.body.appendChild(overlay);

    // Scan button handlers.
    const launchScan = (mode) => {
      const btnTypes = ['native', 'fit'];

      const start = () => {
        AppState.activeMode = mode;
        btnTypes.forEach(m => {
          let btn = document.getElementById(`sdl-hq-${m}-btn`);
          if (btn) {
            if (m === mode) btn.classList.add('sdl-scanning');
            else btn.classList.add('sdl-btn-dimmed');
          }
        });
        executeHQScan(mode);
      };

      start();
    };

    const nativeBtn = document.getElementById('sdl-hq-native-btn');
    const fitBtn = document.getElementById('sdl-hq-fit-btn');
    if (nativeBtn) nativeBtn.onclick = () => launchScan('native');
    if (fitBtn) fitBtn.onclick = () => launchScan('fit');

    // Non-embed view: redirect to the embed view.
    const mainBtn = document.getElementById('sdl-action-btn');
    if (mainBtn && !isEmbed) {
      mainBtn.onclick = () => {
        window.location.href = `https://www.scribd.com/embeds/${docId}/content?start_page=1&view_mode=scroll&access_key=key-1`;
      };
    }

    const closeBtn = overlay.querySelector('.sdl-close');
    if (closeBtn) closeBtn.onclick = () => overlay.remove();

    // Listen for language changes live
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.language) {
        overlay.remove();
        Interface.render();
      }
    });
  },

  updateState: (state, text) => {
    // Find the active scan button.
    const btn = document.querySelector('#sdl-overlay .sdl-scanning')
      || document.getElementById('sdl-hq-native-btn')
      || document.getElementById('sdl-action-btn');
    if (!btn) return;
    const titleEl = btn.querySelector('.sdl-btn-title') || btn.querySelector('span:first-child');
    if (titleEl) titleEl.innerText = text;

    const feedback = document.getElementById('sdl-feedback-container');
    const I18nSafe = window.I18n || { vi: { overlay: {} }, en: { overlay: {} } };
    const T = I18nSafe[AppState.language]?.overlay || I18nSafe.vi?.overlay || I18nSafe.en?.overlay || {};

    if (state === 'loading') {
      btn.disabled = true; btn.style.cursor = 'wait';
      if (feedback && AppState.activeMode === 'native') {
        feedback.style.display = 'block';
        feedback.innerHTML = `
          <img src="https://i.ibb.co/JFt5vNL0/let-him-cook.jpg" style="width:100%; max-width:85px; border-radius:6px; margin-bottom: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.1);" alt="Let him cook">
          <div style="font-weight:600; color:#fff; margin-bottom:4px;">${T.feedback_pause || '⚠️ Hãy giữ tab này mở'}</div>
          <div style="opacity:0.8; font-size:12px;">${T.feedback_desc || 'Đừng đóng tab này cho đến khi quá trình hoàn tất.'}</div>
        `;
      }
    }
    if (state === 'error') {
      btn.style.background = '#ef4444'; btn.disabled = false; btn.style.cursor = 'pointer';
      if (feedback && AppState.activeMode === 'native') {
        feedback.style.display = 'block';
        feedback.style.background = 'rgba(239, 68, 68, 0.1)';
        feedback.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        feedback.style.padding = '10px';
        feedback.style.borderRadius = '8px';
        feedback.innerHTML = `
            <div style="color:#f87171; font-weight:600; margin-bottom:6px;">${T.feedback_err_title || '⚠️ Trích xuất bị gián đoạn'}</div>
            <div style="margin-bottom:8px; opacity:0.9;">${T.feedback_err_desc || 'Hãy thử lại và giữ tab mở.'}</div>
            <div style="font-size:12px;">${T.feedback_err_help || 'Nếu lỗi vẫn tiếp diễn: <a href="https://github.com/HugoAleOlguin/Scribd-Downloader-Premium/issues" style="color:#60a5fa;" target="_blank">báo lỗi trên GitHub</a>'}</div>
         `;
      }
    }
    if (state === 'success') {
      btn.style.background = '#22c55e'; btn.classList.add('sdl-pulse-success'); btn.disabled = true;
      if (feedback) feedback.style.display = 'none';
    }
  },
  updateProgress: (percent, text) => {
    const fill = document.getElementById('sdl-progress-fill');
    const btn = document.querySelector('#sdl-overlay .sdl-scanning')
      || document.getElementById('sdl-hq-native-btn')
      || document.getElementById('sdl-action-btn');
    if (fill) fill.style.width = `${percent}%`;
    if (text && btn) {
      const titleEl = btn.querySelector('.sdl-btn-title') || btn.querySelector('span:first-child');
      if (titleEl) titleEl.innerText = text;
    }
  }
};

window.initSDL = () => { Interface.render(); };

// Stop polling when the extension context is no longer valid.
if (window.SDL_Started) {
  window.initSDL();
} else {
  window.SDL_Started = true;
  const sdlInterval = setInterval(() => {
    // Check whether the extension runtime is still available.
    try {
      if (!chrome.runtime?.id) {
        clearInterval(sdlInterval);
        return;
      }
    } catch (e) {
      clearInterval(sdlInterval);
      return;
    }
    const id = Utils.getDocumentId();
    if (id && !document.getElementById('sdl-overlay')) Interface.render();
  }, 2000);
}
