const STTV_KEYS = {
    BG_COLOR: 'sttv_bg_color',
    CARD_BG: 'sttv_card_bg',
    TITLE_COLOR: 'sttv_title_color',
    LABEL_COLOR: 'sttv_label_color',
    CARD_SHADOW_TOGGLE: 'sttv_card_shadow_toggle',
    ICON_SHADOW_TOGGLE: 'sttv_icon_shadow_toggle',
    SHADOW_X: 'sttv_shadow_x',
    SHADOW_Y: 'sttv_shadow_y',
    SHADOW_BLUR: 'sttv_shadow_blur',
    SHADOW_SPREAD: 'sttv_shadow_spread',
    SHADOW_TEMP: 'sttv_shadow_temp',
    SHADOW_COLOR: 'sttv_shadow_color'
};

function initTheme() {
    // Load config từ localStorage với fallback an toàn
    const bgColor = localStorage.getItem(STTV_KEYS.BG_COLOR) || '#0b1120';
    const cardBg = localStorage.getItem(STTV_KEYS.CARD_BG) || 'rgba(255, 255, 255, 0.08)';
    const titleColor = localStorage.getItem(STTV_KEYS.TITLE_COLOR) || '#ffffff';
    const labelColor = localStorage.getItem(STTV_KEYS.LABEL_COLOR) || '#ffffff';

    const cardShadowOn = localStorage.getItem(STTV_KEYS.CARD_SHADOW_TOGGLE) === 'true';
    const iconShadowOn = localStorage.getItem(STTV_KEYS.ICON_SHADOW_TOGGLE) === 'true';

    const sX = localStorage.getItem(STTV_KEYS.SHADOW_X) || '0';
    const sY = localStorage.getItem(STTV_KEYS.SHADOW_Y) || '4';
    const sBlur = localStorage.getItem(STTV_KEYS.SHADOW_BLUR) || '10';
    const sSpread = localStorage.getItem(STTV_KEYS.SHADOW_SPREAD) || '0';
    const sTemp = localStorage.getItem(STTV_KEYS.SHADOW_TEMP) || '50';
    const sColor = localStorage.getItem(STTV_KEYS.SHADOW_COLOR) || '#000000';

    // Cập nhật DOM controls
    document.getElementById('stt-bg-color').value = bgColor;
    document.getElementById('stt-card-bg').value = cardBg;
    document.getElementById('stt-title-color').value = titleColor;
    document.getElementById('stt-label-color').value = labelColor;
    document.getElementById('stt-card-shadow-toggle').checked = cardShadowOn;
    document.getElementById('stt-icon-shadow-toggle').checked = iconShadowOn;

    document.getElementById('shadow-x').value = sX;
    document.getElementById('shadow-y').value = sY;
    document.getElementById('shadow-blur').value = sBlur;
    document.getElementById('shadow-spread').value = sSpread;
    document.getElementById('shadow-temp').value = sTemp;
    document.getElementById('shadow-color').value = sColor;

    updateShadowValuesDisplay();
    applyTheme();
}

function computeShadowString() {
    const sX = document.getElementById('shadow-x').value;
    const sY = document.getElementById('shadow-y').value;
    const sBlur = document.getElementById('shadow-blur').value;
    const sSpread = document.getElementById('shadow-spread').value;
    const sTemp = parseInt(document.getElementById('shadow-temp').value, 10);
    let sColor = document.getElementById('shadow-color').value;

    // Tính toán nhiệt độ màu nếu không sửa màu thủ công
    // Temp: 0 (lạnh/xanh) -> 50 (trung tính) -> 100 (nóng/đỏ-cam)
    if (sTemp !== 50) {
        const r = Math.min(255, Math.floor((sTemp / 50) * 128));
        const b = Math.min(255, Math.floor(((100 - sTemp) / 50) * 128));
        sColor = `rgba(${r}, 0, ${b}, 0.5)`;
    }

    return `${sX}px ${sY}px ${sBlur}px ${sSpread}px ${sColor}`;
}

function applyTheme() {
    const root = document.documentElement;

    const bgColor = document.getElementById('stt-bg-color').value;
    const cardBg = document.getElementById('stt-card-bg').value;
    const titleColor = document.getElementById('stt-title-color').value;
    const labelColor = document.getElementById('stt-label-color').value;

    const cardShadowOn = document.getElementById('stt-card-shadow-toggle').checked;
    const iconShadowOn = document.getElementById('stt-icon-shadow-toggle').checked;

    const shadowStr = computeShadowString();

    root.style.setProperty('--bg-color', bgColor);
    root.style.setProperty('--card-bg', cardBg);
    root.style.setProperty('--title-color', titleColor);
    root.style.setProperty('--label-color', labelColor);

    root.style.setProperty('--card-shadow', cardShadowOn ? shadowStr : 'none');
    root.style.setProperty('--icon-shadow', iconShadowOn ? shadowStr : 'none');

    // Lưu trữ localStorage
    localStorage.setItem(STTV_KEYS.BG_COLOR, bgColor);
    localStorage.setItem(STTV_KEYS.CARD_BG, cardBg);
    localStorage.setItem(STTV_KEYS.TITLE_COLOR, titleColor);
    localStorage.setItem(STTV_KEYS.LABEL_COLOR, labelColor);
    localStorage.setItem(STTV_KEYS.CARD_SHADOW_TOGGLE, cardShadowOn);
    localStorage.setItem(STTV_KEYS.ICON_SHADOW_TOGGLE, iconShadowOn);
    localStorage.setItem(STTV_KEYS.SHADOW_X, document.getElementById('shadow-x').value);
    localStorage.setItem(STTV_KEYS.SHADOW_Y, document.getElementById('shadow-y').value);
    localStorage.setItem(STTV_KEYS.SHADOW_BLUR, document.getElementById('shadow-blur').value);
    localStorage.setItem(STTV_KEYS.SHADOW_SPREAD, document.getElementById('shadow-spread').value);
    localStorage.setItem(STTV_KEYS.SHADOW_TEMP, document.getElementById('shadow-temp').value);
    localStorage.setItem(STTV_KEYS.SHADOW_COLOR, document.getElementById('shadow-color').value);
}

function updateShadowValuesDisplay() {
    document.getElementById('val-shadow-x').textContent = document.getElementById('shadow-x').value;
    document.getElementById('val-shadow-y').textContent = document.getElementById('shadow-y').value;
    document.getElementById('val-shadow-blur').textContent = document.getElementById('shadow-blur').value;
    document.getElementById('val-shadow-spread').textContent = document.getElementById('shadow-spread').value;
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    const inputs = document.querySelectorAll('.settings-panel input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            updateShadowValuesDisplay();
            applyTheme();
        });
    });

    // Toggle Settings Panel
    const openBtn = document.getElementById('open-settings');
    const closeBtn = document.getElementById('close-settings');
    const panel = document.getElementById('settings-panel');

    if (openBtn && panel && closeBtn) {
        openBtn.addEventListener('click', () => panel.classList.add('active'));
        closeBtn.addEventListener('click', () => panel.classList.remove('active'));
    }
});