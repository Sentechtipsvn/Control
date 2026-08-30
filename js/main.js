// js/main.js
const SHORTCUT_NAME = "Control";

// Cập nhật dùng x-callback-url để tự động quay lại WebClip
function runShortcut(textValue) {
    const encodedText = encodeURIComponent(textValue);
    const encodedName = encodeURIComponent(SHORTCUT_NAME);
    const callbackUrl = encodeURIComponent(window.location.href);
    
    // x-callback-url cấu trúc chuẩn của Apple Shortcuts
    const url = `shortcuts://x-callback-url/run-shortcut?name=${encodedName}&input=text&text=${encodedText}&x-success=${callbackUrl}&x-cancel=${callbackUrl}&x-error=${callbackUrl}`;
    window.location.href = url;
}

function toggleActiveAndRun(element, shortcutText) {
    const btnId = element.getAttribute('data-id');
    if (btnId) {
        const storageKey = `sttv_state_${btnId}`;
        const isActive = element.classList.toggle('active');
        localStorage.setItem(storageKey, isActive ? 'true' : 'false');
    }
    // Gửi ID khoá (shortcutText) sang phím tắt thay vì chữ như cũ
    runShortcut(shortcutText);
}

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
            console.error('Lỗi ngôn ngữ');
            return {};
        }
    }
}

async function applyLanguage() {
    const texts = await loadLanguage();
    
    const titleEl = document.getElementById('app-title');
    if (titleEl) {
        titleEl.innerText = texts.app_title || 'Trung tâm điều khiển';
    }
    
    document.querySelectorAll('.btn-action').forEach(btn => {
        const key = btn.getAttribute('data-key');
        const labelEl = btn.querySelector('.btn-label');
        if (labelEl && key && texts[key]) {
            labelEl.innerText = texts[key] || 'Chức năng';
        }
    });

    document.querySelectorAll('[data-key]:not(.btn-action)').forEach(el => {
        const key = el.getAttribute('data-key');
        if (texts[key]) {
            if (el.tagName.toLowerCase() !== 'label' || !el.classList.contains('toggle-label')) {
                 el.innerText = texts[key] || 'Cài đặt';
            }
        }
    });

    // Cập nhật đường link tải phím tắt từ JSON
    const btnShortcut = document.getElementById('btn-get-shortcut');
    if (btnShortcut) {
        const shortcutUrl = texts['url_shortcut'] || 'https://www.icloud.com/shortcuts/a8234ef368b54c59a9ce2da8c9b97365';
        btnShortcut.onclick = () => window.location.href = shortcutUrl;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    applyLanguage();
    restoreActiveStates();
});