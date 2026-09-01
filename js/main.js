// js/main.js
const SHORTCUT_NAME = "Control";

function runShortcut(textValue) {
    const encodedText = encodeURIComponent(textValue);
    const encodedName = encodeURIComponent(SHORTCUT_NAME);
    const callbackUrl = encodeURIComponent(window.location.href);
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
            console.error('Lỗi ngôn ngữ', err);
            return {};
        }
    }
}

async function applyLanguage() {
    const texts = await loadLanguage();
    
    const titleEl = document.getElementById('app-title');
    if (titleEl) {
        titleEl.innerText = texts.app_title || 'Bảng điều khiển';
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

    const btnShortcut = document.getElementById('btn-get-shortcut');
    if (btnShortcut) {
        const shortcutUrl = texts['url_shortcut'] || 'https://www.icloud.com/shortcuts/a8234ef368b54c59a9ce2da8c9b97365';
        btnShortcut.onclick = () => window.location.href = shortcutUrl;
    }
}

function initSystemSliders() {
    const sliders = [
        { id: 'vol-slider', prefix: 'volume-' },
        { id: 'bri-slider', prefix: 'brightness-' }
    ];

    sliders.forEach(s => {
        const slider = document.getElementById(s.id);
        if (!slider) return;
        
        const tooltip = slider.nextElementSibling;
        let hideTimeout;

        const updateSliderView = () => {
            const val = slider.value;
            const min = slider.min ? parseFloat(slider.min) : 0;
            const max = slider.max ? parseFloat(slider.max) : 100;
            const percent = ((val - min) / (max - min)) * 100;
            
            slider.style.setProperty('--val', `${percent}%`);
            tooltip.innerText = val;
            
            // Tính toán vị trí tooltip theo percent (Trừ đi offset nhỏ của thumb width 28px)
            const thumbWidth = 28;
            const offset = (percent / 100) * (slider.clientWidth - thumbWidth) + (thumbWidth / 2);
            tooltip.style.left = `${offset}px`;
        };

        slider.addEventListener('input', () => {
            updateSliderView();
            tooltip.classList.add('show');
            if (hideTimeout) clearTimeout(hideTimeout);
        });

        const handleRelease = () => {
            if (hideTimeout) clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                tooltip.classList.remove('show');
            }, 1000);
            
            runShortcut(`${s.prefix}${slider.value}`);
        };

        slider.addEventListener('change', handleRelease);
        slider.addEventListener('touchend', handleRelease);
        
        // Init state
        updateSliderView();
    });
}

function initMain() {
    applyLanguage();
    restoreActiveStates();
    initSystemSliders();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMain);
} else {
    initMain();
}