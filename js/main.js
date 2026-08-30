// js/main.js
const SHORTCUT_NAME = "Control";

function runShortcut(textValue) {
    const encodedText = encodeURIComponent(textValue);
    const encodedName = encodeURIComponent(SHORTCUT_NAME);
    
    const url = `shortcuts://run-shortcut?name=${encodedName}&input=text&text=${encodedText}`;
    window.location.href = url;
}

// Chế độ Bật/Tắt động & Gửi lệnh tới Shortcut
function toggleActiveAndRun(element, shortcutText) {
    const btnId = element.getAttribute('data-id');
    if (btnId) {
        const storageKey = `sttv_state_${btnId}`;
        const isActive = element.classList.toggle('active');
        localStorage.setItem(storageKey, isActive ? 'true' : 'false');
    }
    runShortcut(shortcutText);
}

// Khôi phục trạng thái từ localStorage
function restoreActiveStates() {
    document.querySelectorAll('.btn-action').forEach(btn => {
        const btnId = btn.getAttribute('data-id');
        if (btnId) {
            const state = localStorage.getItem(`sttv_state_${btnId}`);
            if (state === 'true') {
                btn.classList.add('active');
            }
        }
    });
}

// Đọc file JSON ngôn ngữ
async function loadLanguage() {
    let lang = navigator.language || 'en-GB';
    let langFilePath = `Language/${lang}.json`;
    
    try {
        let response = await fetch(langFilePath);
        if (!response.ok) throw new Error('Not found');
        return await response.json();
    } catch (error) {
        try {
            let fallbackResponse = await fetch('Language/en-GB.json');
            if (!fallbackResponse.ok) throw new Error('Fallback not found');
            return await fallbackResponse.json();
        } catch (err) {
            console.error('Không tìm thấy file ngôn ngữ nào');
            return {};
        }
    }
}

// Áp dụng đa ngôn ngữ vào các nhãn hiển thị và fix lỗi mất Icon
async function applyLanguage() {
    const texts = await loadLanguage();
    
    // Tiêu đề trang
    const titleEl = document.getElementById('app-title');
    if (titleEl) {
        titleEl.innerText = texts.app_title || 'Trung tâm điều khiển';
    }
    
    // Label trong các nút bấm (Sử dụng selector chính xác để không ghi đè img bên trong btn-action)
    document.querySelectorAll('.btn-action').forEach(btn => {
        const key = btn.getAttribute('data-key');
        const labelEl = btn.querySelector('.btn-label');
        if (labelEl && key && texts[key]) {
            labelEl.innerText = texts[key] || 'Chức năng';
        }
    });

    // Label trong phần cài đặt (Loại trừ .btn-action để tránh xoá code cấu trúc html của nút)
    document.querySelectorAll('[data-key]:not(.btn-action)').forEach(el => {
        const key = el.getAttribute('data-key');
        if (texts[key]) {
            // Không ghi đè các element con nếu là thẻ label bọc toggle
            if (el.tagName.toLowerCase() !== 'label' || !el.classList.contains('toggle-label')) {
                 el.innerText = texts[key] || 'Cài đặt';
            }
        }
    });
}

// Chạy khi trang web đã được load xong
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage();
    restoreActiveStates();
});