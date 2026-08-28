# 🎛️ Control Center Webclip for iOS

[![Platform](https://img.shields.io/badge/Platform-iOS%20Webclip-blue)](https://developer.apple.com/documentation/devicemanagement/webclip)
[![Language](https://img.shields.io/badge/Language-HTML%2FCSS%2FJS-brightgreen)](https://developer.mozilla.org/)
[![License](https://img.shields.io/badge/License-MIT-orange)](LICENSE)

Dự án **Webclip Control Center** là một ứng dụng web giả lập giao diện Trung tâm điều khiển (Control Center) trên iOS. Nó được tối ưu hóa đặc biệt để chạy như một ứng dụng Native (toàn màn hình, không có thanh địa chỉ, không có nút back) khi người dùng thực hiện thao tác "Add to Home Screen" trên Safari.

Ứng dụng cho phép mở các *Shortcuts* hệ thống thông qua URL Scheme, hỗ trợ đa ngôn ngữ tự động, chế độ Sáng/Tối theo hệ thống, và một bảng cài đặt cho phép người dùng tự do tùy biến giao diện.

---

## ✨ Tính năng nổi bật (Features)

- **Tự động đa ngôn ngữ (i18n):** Tự động nhận diện ngôn ngữ hệ điều hành. Hệ thống kiểm tra thư mục `Language/`. Nếu không tìm thấy mã ngôn ngữ tương ứng hoặc thiếu key trong file JSON, hệ thống sẽ tự động fallback về ngôn ngữ mặc định `en-GB.json`.
- **Thiết kế Glassmorphism (Kính mờ):** Các nút chức năng có độ trong suốt, viền mỏng sáng màu và hiệu ứng blur, được bo tròn dạng "viên thuốc" (Pill shape).
- **Tối ưu hóa Native iOS:** Loại bỏ hiệu ứng tap highlight, khóa zoom, hỗ trợ `viewport-fit=cover`, tự nhận diện chế độ Sáng/Tối (Dark/Light mode) theo hệ thống, hỗ trợ Safe Area (tai thỏ).
- **Nút Settings nâng cao:** Nút Setting (50x50px) ở góc phải dưới mở ra bảng tùy chỉnh:
  - Đổi màu nền hệ thống.
  - Đổi màu nền khung chứa nút chức năng.
  - Đổi màu tiêu đề chính và màu nhãn nút.
  - Bật/tắt đổ bóng cho khung nút và khung icon.
  - **Lưu trữ:** Tất cả tùy chỉnh được lưu trong `localStorage` để giữ nguyên sau khi người dùng đóng ứng dụng.
- **Chuẩn hóa kích thước:** Icon chức năng được set cứng **55x55px** (bo tròn hoàn hảo). Nút Setting **50x50px** (không nền).
- **Tích hợp Shortcuts:** Tương tác với Shortcuts iOS qua URL Scheme (`shortcuts://`).

---

## 📁 Cấu trúc thư mục (Project Structure)

```text
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js        # Xử lý logic, ngôn ngữ, sự kiện
│   └── theme.js       # Xử lý theme, lưu localStorage, đổi màu
├── Language/
│   ├── vi-VN.json
│   ├── ja.json
│   ├── ru.json
│   └── en-GB.json     # Fallback mặc định
├── images/
│   ├── assistivetouch.png
│   ├── airplane.png
│   ├── ...
│   └── (Các icon chức năng 55x55px)
└── icons/
    └── icon-setting.png (50x50px)
