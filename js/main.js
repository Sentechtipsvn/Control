const SHORTCUT_NAME = "Control";

function runShortcut(textValue) {
    const encodedText = encodeURIComponent(textValue);
    const encodedName = encodeURIComponent(SHORTCUT_NAME);
    
    const url = `shortcuts://run-shortcut?name=${encodedName}&input=text&text=${encodedText}`;
    window.location.href = url;
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
            console.error('Không tìm thấy file ngôn ngữ nào');
            return {};
        }
    }
}

async function applyLanguage() {
    const texts = await loadLanguage();
    
    const titleEl = document.getElementById('app-title');
    if (titleEl) {
        titleEl.innerText = texts.app_title || 'Control Center';
    }
    
    document.querySelectorAll('.btn-action').forEach(btn => {
        const key = btn.getAttribute('data-key');
        const labelEl = btn.querySelector('.btn-label');
        if (labelEl) {
            const defaultLabel = labelEl.innerText || 'Chức năng';
            labelEl.innerText = texts[key] || defaultLabel;
        }
    });
    
    const settingsHeaderEl = document.querySelector('.settings-header h2');
    if (settingsHeaderEl) {
        settingsHeaderEl.innerText = texts.settings_title || 'Cài đặt';
    }
}

document.addEventListener('DOMContentLoaded', applyLanguage);