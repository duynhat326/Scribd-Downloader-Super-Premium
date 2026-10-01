/**
 * Scribd Premium Downloader translations.
 */

const I18n = {
    en: {
        popup: {
            title: 'Scribd Premium', subtitle: 'Document Downloader', status: 'Ready to use',
            how_to: 'HOW DOES IT WORK?',
            step1: 'Open any <strong>Scribd</strong> document you want to save.',
            step2: 'A <strong>floating panel</strong> will appear on the screen. Reload if it does not.',
            step3: "Click <strong>'Extract from Server'</strong> to save the original images.",
            footer: 'v3.0.0 — Open Source'
        },
        overlay: {
            title: '⚡ Scribd Premium', id: 'ID:', file: 'File:', pages: 'Pages:', analyzing: 'Counting pages...',
            activate: 'Go to download mode',
            hq_native_btn: 'Extract from Server', hq_native_sub: 'Original source quality', hq_native_badge: 'OPTIMAL',
            hq_native_tooltip: 'Downloads the original images from the server to preserve maximum quality.',
            hq_fit_btn: 'Secondary Scan', hq_fit_sub: 'Screen capture', hq_fit_badge: 'STANDARD',
            hq_fit_tooltip: 'Captures the document on screen if server extraction is unavailable.',
            hq_btn: 'Premium Extraction', hq_badge: 'RECOMMENDED', hq_tooltip: 'Builds a PDF from every page.',
            states: { loading: 'Preparing extraction...', saving: 'Saving final PDF...', success: 'PDF saved successfully!', error: 'Something went wrong: ' },
            errors: { pdf_lib: 'Reload the page and try again.', no_pages: 'No accessible pages were found.', capture: 'Failed to process the tab capture.' },
            feedback_pause: '⚠️ Keep this tab open',
            feedback_desc: 'You can use your PC or change windows, but do not close this tab until the process finishes.',
            feedback_err_title: '⚠️ Extraction interrupted',
            feedback_err_desc: 'Try again without closing the tab.',
            feedback_err_help: "If the problem persists: <a href='https://github.com/HugoAleOlguin/Scribd-Downloader-Premium/issues' target='_blank' style='color:#60a5fa; text-decoration:underline;'>report it on GitHub</a>."
        }
    },
    vi: {
        popup: {
            title: 'Scribd Premium', subtitle: 'Trình tải tài liệu', status: 'Sẵn sàng sử dụng',
            how_to: 'CÁCH SỬ DỤNG',
            step1: 'Mở tài liệu <strong>Scribd</strong> bạn muốn lưu.',
            step2: '<strong>Bảng điều khiển nổi</strong> sẽ xuất hiện trên trang. Hãy tải lại trang nếu chưa thấy.',
            step3: "Nhấn <strong>'Trích xuất từ máy chủ'</strong> để lưu ảnh gốc.",
            footer: 'v3.0.0 — Mã nguồn mở'
        },
        overlay: {
            title: '⚡ Scribd Premium', id: 'ID:', file: 'Tệp:', pages: 'Trang:', analyzing: 'Đang đếm trang...',
            activate: 'Mở chế độ tải xuống',
            hq_native_btn: 'Trích xuất từ máy chủ', hq_native_sub: 'Chất lượng ảnh gốc', hq_native_badge: 'TỐI ƯU',
            hq_native_tooltip: 'Tải ảnh gốc trực tiếp từ máy chủ để giữ chất lượng cao nhất.',
            hq_fit_btn: 'Chụp dự phòng', hq_fit_sub: 'Chụp toàn màn hình', hq_fit_badge: 'TIÊU CHUẨN',
            hq_fit_tooltip: 'Chụp tài liệu trên màn hình nếu không thể trích xuất từ máy chủ.',
            hq_btn: 'Trích xuất Premium', hq_badge: 'ĐỀ XUẤT', hq_tooltip: 'Tạo PDF từ từng trang.',
            states: { loading: 'Đang chuẩn bị trích xuất...', saving: 'Đang tạo PDF...', success: 'Đã lưu PDF thành công!', error: 'Đã xảy ra lỗi: ' },
            errors: { pdf_lib: 'Hãy tải lại trang và thử lại.', no_pages: 'Không tìm thấy trang có thể truy cập.', capture: 'Không thể xử lý ảnh chụp của tab.' },
            feedback_pause: '⚠️ Hãy giữ tab này mở',
            feedback_desc: 'Bạn có thể dùng máy tính hoặc chuyển cửa sổ, nhưng đừng đóng tab này đến khi hoàn tất.',
            feedback_err_title: '⚠️ Trích xuất bị gián đoạn',
            feedback_err_desc: 'Hãy thử lại và giữ tab mở.',
            feedback_err_help: "Nếu lỗi vẫn tiếp diễn: <a href='https://github.com/HugoAleOlguin/Scribd-Downloader-Premium/issues' target='_blank' style='color:#60a5fa; text-decoration:underline;'>báo lỗi trên GitHub</a>."
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
} else if (typeof window !== 'undefined') {
    window.I18n = I18n;
}
