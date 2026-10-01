<div align="center">

# Scribd Premium Downloader

**Lưu và sao lưu tài liệu Scribd trực tiếp từ trình duyệt.**<br/>
Không cần tài khoản bên ngoài. Không dùng máy chủ của bên thứ ba. Mọi thứ chạy 100% trên máy của bạn.

[![Phiên bản](https://img.shields.io/badge/phiên_bản-3.0.0-0f766e?style=flat-square)](https://github.com/duynhat326/Scribd-Downloader-Super-Premium/releases/latest)
[![Chrome](https://img.shields.io/badge/Chrome-✓-4285F4?style=flat-square&logo=googlechrome&logoColor=white)](https://github.com/duynhat326/Scribd-Downloader-Super-Premium/releases/latest)
[![Firefox](https://img.shields.io/badge/Firefox-✓-FF7139?style=flat-square&logo=firefox&logoColor=white)](https://github.com/duynhat326/Scribd-Downloader-Super-Premium/releases/latest)
[![Giấy phép](https://img.shields.io/badge/giấy_phép-MIT-blue?style=flat-square)](LICENSE.md)

<br/>

[![Tải xuống](https://img.shields.io/badge/⬇️_Tải_v3.0.0-0f766e?style=for-the-badge)](https://github.com/duynhat326/Scribd-Downloader-Super-Premium/releases/latest)

[Read in English](README.md)

</div>

---

## Tiện ích này làm gì?

Sau khi cài đặt, tiện ích sẽ thêm một **bảng điều khiển nổi** vào mọi trang tài liệu Scribd. Từ bảng này, bạn có thể tải tài liệu bằng một trong hai phương thức:

| Chế độ | Cách hoạt động | Kết quả |
|--------|----------------|---------|
| ⚡ **Trích xuất từ máy chủ** | Tái tạo ảnh gốc của tài liệu trực tiếp từ máy chủ, có Smart Stitching để ghép các trang bị chia nhỏ. | PDF ảnh chất lượng cao nhất |
| 📷 **Chụp dự phòng** | Chụp toàn trang với các tài liệu không thể trích xuất từ máy chủ, giữ đúng chiều dọc hoặc ngang của từng trang. | PDF ảnh chất lượng tiêu chuẩn |

> ⚠️ Tiện ích chỉ hoạt động với các tài liệu **công khai, có thể truy cập** trên Scribd.

---

## ⚡ Cài đặt

Đừng lo — việc này đơn giản hơn bạn nghĩ! Chỉ cần làm theo ba bước sau.

---

### Bước 1 — Tải tiện ích

Nhấn nút bên dưới để tải bản phát hành mới nhất dưới dạng tệp ZIP:

[![Tải xuống](https://img.shields.io/badge/⬇️_Tải_v3.0.0-0f766e?style=for-the-badge)](https://github.com/duynhat326/Scribd-Downloader-Super-Premium/releases/latest)

Sau khi tải, hãy **giải nén thư mục** vào một vị trí cố định trên máy. Ví dụ:

```
C:\Extensions\scribd-downloader\
```

> **Quan trọng:** Đừng di chuyển hoặc xóa thư mục này sau khi cài đặt. Trình duyệt cần các tệp ở đúng vị trí; nếu di chuyển, tiện ích sẽ ngừng hoạt động.

---

### Bước 2 — Build tiện ích

Mở thư mục vừa giải nén và **nhấp đúp `build.bat`**.

Tập lệnh sẽ tự động tạo hai thư mục sẵn sàng để cài đặt:

```
scribd-downloader/
├── chrome/       ← Dành cho Chrome, Edge và Brave
├── firefox/      ← Dành cho Firefox
└── ...
```

> ℹ️ Nếu không có gì xảy ra khi nhấp đúp, hãy nhấp phải `build.bat` và chọn **"Run as administrator"**.

---

### Bước 3 — Nạp tiện ích vào trình duyệt

Chọn trình duyệt của bạn và làm theo hướng dẫn:

#### Chrome / Edge / Brave

1. Mở tab mới và vào `chrome://extensions/` (hoặc `edge://extensions/` với Edge).
2. Bật **"Developer mode"** — công tắc ở **góc trên bên phải**.
3. Nhấn **"Load unpacked"**.
4. Chọn thư mục **`chrome/`** được tạo ở Bước 2.

Tiện ích đã được cài đặt! Bạn sẽ thấy biểu tượng của nó trên thanh công cụ trình duyệt.

#### Firefox

1. Mở tab mới và vào `about:debugging#/runtime/this-firefox`.
2. Nhấn **"Load Temporary Add-on..."**.
3. Mở thư mục **`firefox/`** từ Bước 2 và chọn tệp **`manifest.json`**.

> ⚠️ **Lưu ý cho Firefox:** Vì tiện ích chưa được ký qua Firefox Add-ons, nó sẽ bị gỡ khi bạn đóng trình duyệt. Bạn cần lặp lại Bước 3 mỗi lần mở Firefox. Đây là giới hạn bảo mật của Firefox, không phải lỗi.

---

## Cách sử dụng

### ⚡ Trích xuất từ máy chủ (Khuyến nghị)

Chế độ này lấy ảnh gốc trực tiếp từ máy chủ Scribd để tái tạo PDF chất lượng cao, sử dụng Smart Stitching cho các trang bị chia nhỏ.

```
1. Mở bất kỳ tài liệu công khai nào trên scribd.com.
2. Bảng điều khiển của tiện ích sẽ xuất hiện trên màn hình.
3. Nhấn "Trích xuất Premium" hoặc mở "Tùy chọn khác" → "Trích xuất từ máy chủ".
4. Chờ tiện ích tự tìm và tái tạo từng trang.
5. Khi hoàn tất, PDF sẽ tự động được tải xuống.
```

### 📷 Chụp dự phòng

Dùng chế độ này khi tài liệu không thể trích xuất từ máy chủ. Tiện ích sẽ chụp từng trang hiển thị và tạo PDF ảnh, đồng thời giữ đúng chiều dọc hoặc ngang của mỗi trang.

```
1. Trong trình xem, mở "Tùy chọn khác" → "Chụp dự phòng".
2. Giữ tab Scribd mở trong khi tiện ích chụp tài liệu.
3. Chờ PDF cuối cùng tự động tải xuống.
```

---

## Khắc phục sự cố

**Bảng điều khiển nổi không xuất hiện**<br/>
→ Tải lại trang bằng `F5`. Nếu lỗi vẫn tiếp diễn sau khi cập nhật tiện ích, hãy chạy lại `build.bat` và cài lại tiện ích trong phần cài đặt của trình duyệt.

**Firefox báo lỗi "empty add-on"**<br/>
→ Hãy chắc chắn bạn chọn tệp `manifest.json` trong thư mục `firefox/` được tạo ở Bước 2, không phải tệp ở vị trí khác.

**Trích xuất từ máy chủ bị dừng hoặc không tìm thấy trang**<br/>
→ Kiểm tra tài liệu có thể truy cập công khai, tải lại trang và thử lại. Nếu vẫn không được, hãy dùng **Chụp dự phòng**.

---

## Dành cho nhà phát triển

Muốn đóng góp hoặc chỉnh sửa tiện ích? Đây là cấu trúc dự án:

```
scribd-downloader/
│
├── src/                   ← Chỉnh sửa mã nguồn tại đây
│   ├── shared/            ← Mã dùng chung cho cả hai trình duyệt
│   │   ├── content.js     ← Giao diện bảng nổi + logic trích xuất
│   │   ├── popup.html/js  ← Cửa sổ tiện ích
│   │   ├── overlay.css    ← Kiểu dáng bảng điều khiển
│   │   └── libs/          ← jsPDF, trợ giúp i18n, shim
│   ├── chrome/
│   │   ├── manifest.json  ← Manifest v3 (service worker)
│   │   └── background.js  ← Xử lý chụp cho Chrome
│   └── firefox/
│       ├── manifest.json  ← Manifest v3 (service worker)
│       └── background.js  ← Xử lý chụp cho Firefox
│
├── chrome/                ← Tạo tự động bởi build.bat — không sửa trực tiếp
├── firefox/               ← Tạo tự động bởi build.bat — không sửa trực tiếp
│
└── build.bat              ← Tập lệnh build: biên dịch src/ → chrome/ và firefox/
```

**Quy trình:** Sửa trong `src/`, sau đó chạy `build.bat` để tạo lại các thư mục cài đặt. Bạn cũng có thể chạy từ terminal:

```bat
build.bat
```

---

## ⚠️ Miễn trừ trách nhiệm pháp lý

Công cụ này được tạo ra **chỉ cho mục đích giáo dục và nghiên cứu**. Tác giả không khuyến khích hoặc hỗ trợ việc phân phối trái phép nội dung có bản quyền.

Bạn **hoàn toàn chịu trách nhiệm** về cách dùng tiện ích này. Chỉ sử dụng với tài liệu bạn sở hữu, tài liệu thuộc phạm vi công cộng, hoặc phù hợp với luật bản quyền tại quốc gia của bạn.

---

<div align="center">

Made with ❤️ by **[HugoAleOlguin](https://github.com/HugoAleOlguin)**

[⭐ Star on GitHub](https://github.com/duynhat326/Scribd-Downloader-Super-Premium) · [🐛 Báo lỗi](https://github.com/duynhat326/Scribd-Downloader-Super-Premium/issues)

</div>
