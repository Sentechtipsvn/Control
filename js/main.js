// js/main.js
// Xử lý i18n, kết nối mạng, vibration và thực thi phím tắt iOS

const SHORTCUT_NAME = "Control";

// 1. Kiểm tra trạng thái kết nối mạng
function checkNetworkStatus() {
    window.addEventListener('offline', () => {
        console.warn('[Network] Mất kết nối Internet.');
    });
    window.addEventListener('online', () => {
        console.log('[Network] Đã khôi phục kết nối Internet.');
    });
}

// 2. Chạy Phím Tắt iOS & Haptic Feedback
function runShortcut(textValue) {
    if (navigator.vibrate) {
        navigator.vibrate(10); // Rung nhẹ 10ms
    }
    const encodedText = encodeURIComponent(textValue);
    const encodedName = encodeURIComponent(SHORTCUT_NAME);
    const url = `shortcuts://run-shortcut?name=${encodedName}&input=text&text=${encodedText}`;
    window.location.href = url;
}

// 3. Hệ thống Đa ngôn ngữ (i18n) - Chuẩn hóa fallback đúng ngữ cảnh
async function loadLanguage() {
    const userLang = navigator.language || 'en-GB';
    let langData = {};
    let fallbackData = {};

    // Load en-GB.json làm fallback mặc định
    try {
        const resFallback = await fetch('Language/en-GB.json');
        if (resFallback.ok) {
            fallbackData = await resFallback.json();
        }
    } catch (err) {
        console.error('[i18n] Không thể tải file fallback mặc định en-GB.json', err);
    }

    // Tải ngôn ngữ cụ thể theo máy
    try {
        const resLang = await fetch(`Language/${userLang}.json`);
        if (resLang.ok) {
            langData = await resLang.json();
        } else {
            console.warn(`[i18n] Không tìm thấy file Language/${userLang}.json, tự động fallback về en-GB.json`);
            langData = fallbackData;
        }
    } catch (err) {
        console.warn(`[i18n] Lỗi tải ngôn ngữ ${userLang}, sử dụng fallback en-GB.json`, err);
        langData = fallbackData;
    }

    // Áp dụng dịch ngữ cảnh, fallback đúng nghĩa ngữ cảnh
    const titleEl = document.getElementById('app-title');
    if (titleEl) {
        titleEl.textContent = langData.app_title || fallbackData.app_title || 'Control Center';
    }

    const sttTitleEl = document.getElementById('settings-title');
    if (sttTitleEl) {
        sttTitleEl.textContent = langData.settings_title || fallbackData.settings_title || 'Cài đặt';
    }

    // Cập nhật nhãn nút bấm
    const buttons = document.querySelectorAll('.btn-action');
    buttons.forEach(btn => {
        const key = btn.getAttribute('data-key');
        const labelEl = btn.querySelector('.btn-label');
        if (key && labelEl) {
            labelEl.textContent = langData[key] || fallbackData[key] || labelEl.textContent;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    checkNetworkStatus();
    loadLanguage();
});