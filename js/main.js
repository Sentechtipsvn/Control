// Tên shortcut trên iPhone của bạn
const SHORTCUT_NAME = "Control";

function runShortcut(textValue) {
    const encodedText = encodeURIComponent(textValue);
    const encodedName = encodeURIComponent(SHORTCUT_NAME);
    
    const url = `shortcuts://run-shortcut?name=${encodedName}&input=text&text=${encodedText}`;
    window.location.href = url;
}

// Hàm tự nhận ngôn ngữ hệ thống và đọc file JSON
async function loadLanguage() {
    // Lấy ngôn ngữ hệ thống ví dụ: vi-VN, ja, ru, en-GB
    let lang = navigator.language || 'en-GB';
    let langFilePath = `Language/${lang}.json`;
    
    try {
        // Kiểm tra file ngôn ngữ theo hệ thống
        let response = await fetch(langFilePath);
        if (!response.ok) throw new Error('Not found');
        return await response.json();
    } catch (error) {
        // Nếu không có, fallback về en-GB.json
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

// Áp dụng ngôn ngữ lên giao diện
async function applyLanguage() {
    const texts = await loadLanguage();
    
    // Đổi tiêu đề chính
    if (texts.app_title) document.getElementById('app-title').innerText = texts.app_title;
    
    // Đổi nhãn các nút theo data-key
    document.querySelectorAll('.btn-action').forEach(btn => {
        const key = btn.getAttribute('data-key');
        if (texts[key]) {
            btn.querySelector('.btn-label').innerText = texts[key];
        }
    });
    
    // Đổi tiêu đề bảng cài đặt
    if (texts.settings_title) document.querySelector('.settings-header h2').innerText = texts.settings_title;
}

// Chạy khi tải trang
document.addEventListener('DOMContentLoaded', applyLanguage);