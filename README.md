# Scribd Premium Downloader

Tiện ích trình duyệt để lưu tài liệu Scribd công khai thành PDF ngay trên máy của bạn. Không cần tài khoản hay dịch vụ tải xuống bên thứ ba.

## Tính năng

| Chế độ | Hoạt động | Kết quả |
| --- | --- | --- |
| **Trích xuất từ máy chủ** | Tải ảnh gốc của từng trang và ghép thành PDF. Nếu không lấy được ảnh gốc, tiện ích tự chuyển sang chụp dự phòng. | PDF chất lượng cao |
| **Chụp dự phòng** | Chụp toàn bộ trang sau khi thu nhỏ để tránh bị cắt trang. | PDF dạng ảnh |

PDF giữ đúng chiều dọc hoặc ngang của từng trang.

## Cài đặt

1. Tải hoặc sao chép mã nguồn về một thư mục cố định.
2. Chạy `build.bat`. Lệnh này tạo hai thư mục `chrome/` và `firefox/`.
3. Cài theo trình duyệt:

### Chrome, Edge và Brave

1. Mở `chrome://extensions/` hoặc `edge://extensions/`.
2. Bật **Chế độ nhà phát triển**.
3. Chọn **Tải tiện ích đã giải nén** và chọn thư mục `chrome/`.

### Firefox

1. Mở `about:debugging#/runtime/this-firefox`.
2. Chọn **Load Temporary Add-on…**.
3. Mở thư mục `firefox/` và chọn `manifest.json`.

Firefox sẽ gỡ tiện ích tạm thời khi đóng trình duyệt; hãy nạp lại theo các bước trên khi cần.

## Cách dùng

1. Mở một tài liệu công khai trên Scribd.
2. Chuyển vào chế độ xem tải xuống nếu tiện ích yêu cầu.
3. Trong bảng điều khiển nổi, chọn **Trích xuất từ máy chủ**.
4. Giữ tab Scribd mở đến khi PDF được tải xuống.

Nếu ảnh gốc không khả dụng, chọn **Chụp dự phòng**. Bạn có thể đổi ngôn ngữ giao diện thành `VI` trong cửa sổ tiện ích.

## Cấu trúc dự án

```text
src/shared/   mã dùng chung cho Chrome và Firefox
src/chrome/   manifest và background của Chrome
src/firefox/  manifest và background của Firefox
chrome/       bản build để cài trên Chrome, Edge, Brave
firefox/      bản build để cài trên Firefox
```

Chỉnh sửa mã trong `src/`, sau đó chạy lại `build.bat` để đồng bộ hai thư mục cài đặt.

## Lưu ý pháp lý

Chỉ sử dụng tiện ích với tài liệu bạn có quyền truy cập và theo luật bản quyền tại nơi bạn sinh sống. Bạn tự chịu trách nhiệm về cách sử dụng tiện ích này.

## Giấy phép

Xem [LICENSE.md](LICENSE.md).
