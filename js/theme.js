const settingsBtn = document.getElementById('open-settings');
const settingsPanel = document.getElementById('settings-panel');
const closeSettings = document.getElementById('close-settings');

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

function saveSettings() {
    if (!bgColorInput) return; 
    const settings = {
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
    localStorage.setItem('cc-settings', JSON.stringify(settings));
}

function applySettings() {
    if (!bgColorInput) return;
    const saved = localStorage.getItem('cc-settings');
    
    if (saved) {
        try {
            const s = JSON.parse(saved);
            bgColorInput.value = s.bg || '#0b1120'; 
            cardBgInput.value = s.cardBg || 'rgba(255, 255, 255, 0.08)';
            titleColorInput.value = s.titleColor || '#ffffff'; 
            labelColorInput.value = s.labelColor || '#ffffff';
            cardShadowToggle.checked = !!s.cardShadow; 
            iconShadowToggle.checked = !!s.iconShadow;
            shadowX.value = s.shX || '0'; 
            shadowY.value = s.shY || '4'; 
            shadowBlur.value = s.shBlur || '10'; 
            shadowSpread.value = s.shSpread || '0'; 
            shadowColor.value = s.shColor || '#000000';
        } catch (e) {
            console.error('Lỗi parse settings', e);
        }
    }

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
    [bgColorInput, titleColorInput, labelColorInput, shadowColor].forEach(input => {
        input.addEventListener('input', () => { applySettings(); saveSettings(); });
    });
    cardBgInput.addEventListener('input', () => { applySettings(); saveSettings(); });
    cardShadowToggle.addEventListener('change', () => { applySettings(); saveSettings(); });
    iconShadowToggle.addEventListener('change', () => { applySettings(); saveSettings(); });
    [shadowX, shadowY, shadowBlur, shadowSpread].forEach(input => {
        input.addEventListener('input', () => { applySettings(); saveSettings(); });
    });

    document.addEventListener('DOMContentLoaded', applySettings);
}