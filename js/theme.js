const settingsBtn = document.getElementById('open-settings');
const settingsPanel = document.getElementById('settings-panel');
const closeSettings = document.getElementById('close-settings');
const toastNotification = document.getElementById('toast-notification');

function showToast(message) {
    if (!toastNotification) return;
    toastNotification.innerText = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
        toastNotification.classList.remove('show');
    }, 2500);
}

if (settingsBtn && settingsPanel) {
    settingsBtn.addEventListener('click', () => settingsPanel.classList.add('active'));
}
if (closeSettings && settingsPanel) {
    closeSettings.addEventListener('click', () => settingsPanel.classList.remove('active'));
}

const root = document.documentElement;
const bgColorInput = document.getElementById('stt-bg-color');
const cardBgInput = document.getElementById('stt-card-bg');
const titleColorInput = document.getElementById('stt-title-color');
const labelColorInput = document.getElementById('stt-label-color');
const cardShadowToggle = document.getElementById('stt-card-shadow-toggle');
const iconShadowToggle = document.getElementById('stt-icon-shadow-toggle');

const shadowX = document.getElementById('shadow-x');
const shadowY = document.getElementById('shadow-y');
const shadowBlur = document.getElementById('shadow-blur');
const shadowSpread = document.getElementById('shadow-spread');
const shadowColor = document.getElementById('shadow-color');

function getCurrentSettingsObj() {
    return {
        bg: bgColorInput.value,
        cardBg: cardBgInput.value,
        titleColor: titleColorInput.value,
        labelColor: labelColorInput.value,
        cardShadow: cardShadowToggle.checked,
        iconShadow: iconShadowToggle.checked,
        shX: shadowX.value,
        shY: shadowY.value,
        shBlur: shadowBlur.value,
        shSpread: shadowSpread.value,
        shColor: shadowColor.value
    };
}

function saveSettings() {
    if (!bgColorInput) return;
    const settings = getCurrentSettingsObj();
    localStorage.setItem('sttv_cc_settings', JSON.stringify(settings));
    showToast('Đã lưu cấu hình');
}

function loadSettingsFromStorage() {
    if (!bgColorInput) return;
    const saved = localStorage.getItem('sttv_cc_settings') || localStorage.getItem('cc-settings');
    
    if (saved) {
        try {
            const s = JSON.parse(saved);
            if(s.bg) bgColorInput.value = s.bg;
            if(s.cardBg) cardBgInput.value = s.cardBg;
            if(s.titleColor) titleColorInput.value = s.titleColor;
            if(s.labelColor) labelColorInput.value = s.labelColor;
            cardShadowToggle.checked = !!s.cardShadow;
            iconShadowToggle.checked = !!s.iconShadow;
            if(s.shX) shadowX.value = s.shX;
            if(s.shY) shadowY.value = s.shY;
            if(s.shBlur) shadowBlur.value = s.shBlur;
            if(s.shSpread) shadowSpread.value = s.shSpread;
            if(s.shColor) shadowColor.value = s.shColor;
        } catch (e) {
            console.error('Lỗi parse settings', e);
        }
    }
    applySettingsPreview();
}

function applySettingsPreview() {
    if (!bgColorInput) return;
    
    root.style.setProperty('--bg-color', bgColorInput.value);
    root.style.setProperty('--card-bg', cardBgInput.value);
    root.style.setProperty('--title-color', titleColorInput.value);
    root.style.setProperty('--label-color', labelColorInput.value);

    const shadowValue = `${shadowX.value}px ${shadowY.value}px ${shadowBlur.value}px ${shadowSpread.value}px ${shadowColor.value}`;
    root.style.setProperty('--card-shadow', cardShadowToggle.checked ? shadowValue : 'none');
    root.style.setProperty('--icon-shadow', iconShadowToggle.checked ? shadowValue : 'none');
    
    const valShadowX = document.getElementById('val-shadow-x');
    const valShadowY = document.getElementById('val-shadow-y');
    const valShadowBlur = document.getElementById('val-shadow-blur');
    const valShadowSpread = document.getElementById('val-shadow-spread');
    
    if (valShadowX) valShadowX.innerText = shadowX.value;
    if (valShadowY) valShadowY.innerText = shadowY.value;
    if (valShadowBlur) valShadowBlur.innerText = shadowBlur.value;
    if (valShadowSpread) valShadowSpread.innerText = shadowSpread.value;
}

if (bgColorInput) {
    [bgColorInput, cardBgInput, titleColorInput, labelColorInput, shadowColor].forEach(input => {
        input.addEventListener('input', applySettingsPreview);
    });
    [cardShadowToggle, iconShadowToggle].forEach(input => {
        input.addEventListener('change', applySettingsPreview);
    });
    [shadowX, shadowY, shadowBlur, shadowSpread].forEach(input => {
        input.addEventListener('input', applySettingsPreview);
    });

    document.getElementById('btn-save-settings').addEventListener('click', () => {
        saveSettings();
    });

    document.getElementById('btn-export-settings').addEventListener('click', () => {
        const settings = getCurrentSettingsObj();
        const base64 = btoa(JSON.stringify(settings));
        prompt("Sao chép mã cấu hình Base64 bên dưới:", base64);
        showToast('Đã lưu cấu hình');
    });

    document.getElementById('btn-import-settings').addEventListener('click', () => {
        const base64 = prompt("Dán mã cấu hình Base64 vào đây:");
        if (base64) {
            try {
                const json = atob(base64);
                const s = JSON.parse(json);
                localStorage.setItem('sttv_cc_settings', JSON.stringify(s));
                loadSettingsFromStorage();
                showToast('Nhập cấu hình thành công!');
            } catch (e) {
                alert("Mã cấu hình không hợp lệ hoặc bị lỗi!");
                console.error("Import error:", e);
            }
        }
    });

    document.addEventListener('DOMContentLoaded', loadSettingsFromStorage);
}