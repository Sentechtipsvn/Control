const SHORTCUT_NAME = "Control";

function runShortcut(textValue) {
    const encodedText = encodeURIComponent(textValue);
    const encodedName = encodeURIComponent(SHORTCUT_NAME);
    
    const url = `shortcuts://run-shortcut?name=${encodedName}&input=text&text=${encodedText}`;
    window.location.href = url;
}

// Active State Status Toggle & Execution
function toggleActiveAndRun(element, shortcutText) {
    const btnId = element.getAttribute('data-id');
    if (btnId) {
        const storageKey = `sttv_state_${btnId}`;
        const isActive = element.classList.toggle('active');
        localStorage.setItem(storageKey, isActive ? 'true' : 'false');
    }
    runShortcut(shortcutText);
}

// Restore Active States from localStorage
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
        if (labelEl && key && texts[key]) {
            labelEl.innerText = texts[key];
        }
    });

    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (texts[key]) {
            el.innerText = texts[key];
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    applyLanguage();
    restoreActiveStates();
});