// js/theme.js
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
    const saved = localStorage.getItem('sttv_cc_settings');
    
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
            console.error('Lỗi parse cấu hình', e);
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

// --- THUẬT TOÁN NÉN CẤU HÌNH (Rút gọn mã xuất nhập tối đa 28 ký tự) ---
function hexToBytes(hex) {
    let h = (hex || '#000000').replace('#', '');
    if(h.length === 3) h = h.split('').map(x => x+x).join('');
    let num = parseInt(h, 16) || 0;
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function bytesToHex(r, g, b) {
    return "#" + (16777216 + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function encodeSettings(s) {
    let bytes = [];
    // 5 Màu sắc x 3 bytes = 15 bytes
    bytes.push(...hexToBytes(s.bg));
    bytes.push(...hexToBytes(s.cardBg));
    bytes.push(...hexToBytes(s.titleColor));
    bytes.push(...hexToBytes(s.labelColor));
    bytes.push(...hexToBytes(s.shColor));
    
    // Đóng gói Bool (1 byte)
    bytes.push((s.cardShadow ? 2 : 0) | (s.iconShadow ? 1 : 0));
    
    // Đóng gói tham số đổ bóng (4 bytes offset tránh số âm)
    bytes.push((parseInt(s.shX) || 0) + 50);
    bytes.push((parseInt(s.shY) || 0) + 50);
    bytes.push((parseInt(s.shBlur) || 0));
    bytes.push((parseInt(s.shSpread) || 0) + 20);

    // Chuyển 20 bytes thành chuỗi an toàn (Chữ hoa, chữ thường, số)
    let str = String.fromCharCode.apply(null, bytes);
    return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function decodeSettings(code) {
    let base64 = code.trim().replace(/-/g, '+').replace(/_/g, '/');
    while(base64.length % 4) base64 += '=';
    let str = atob(base64);
    if(str.length !== 20) throw new Error("Chiều dài mã không đúng định dạng");
    
    let b = [];
    for(let i = 0; i < 20; i++) b.push(str.charCodeAt(i));

    return {
        bg: bytesToHex(b[0], b[1], b[2]),
        cardBg: bytesToHex(b[3], b[4], b[5]),
        titleColor: bytesToHex(b[6], b[7], b[8]),
        labelColor: bytesToHex(b[9], b[10], b[11]),
        shColor: bytesToHex(b[12], b[13], b[14]),
        cardShadow: !!(b[15] & 2),
        iconShadow: !!(b[15] & 1),
        shX: (b[16] - 50).toString(),
        shY: (b[17] - 50).toString(),
        shBlur: (b[18]).toString(),
        shSpread: (b[19] - 20).toString()
    };
}
// ----------------------------------------------------------------------

if (bgColorInput) {
    [bgColorInput, cardBgInput, titleColorInput, labelColorInput, shadowColor].forEach(input => {
        input.addEventListener('input', applySettingsPreview);
    });
    [cardShadowToggle, iconShadowToggle].forEach(input => {
        input.addEventListener('change', applySettingsPreview);
    });

    [shadowX, shadowY, shadowBlur, shadowSpread].forEach(input => {
        input.addEventListener('input', applySettingsPreview);
        
        const handleStartDrag = (e) => {
            settingsPanel.classList.add('faded');
            e.target.closest('.setting-group').classList.add('active-slider');
        };
        const handleEndDrag = (e) => {
            settingsPanel.classList.remove('faded');
            e.target.closest('.setting-group').classList.remove('active-slider');
        };

        input.addEventListener('mousedown', handleStartDrag);
        input.addEventListener('touchstart', handleStartDrag, {passive: true});
        
        input.addEventListener('mouseup', handleEndDrag);
        input.addEventListener('touchend', handleEndDrag);
    });
    
    document.addEventListener('mouseup', () => {
        if(settingsPanel.classList.contains('faded')) {
            settingsPanel.classList.remove('faded');
            document.querySelectorAll('.active-slider').forEach(el => el.classList.remove('active-slider'));
        }
    });
    document.addEventListener('touchend', () => {
        if(settingsPanel.classList.contains('faded')) {
            settingsPanel.classList.remove('faded');
            document.querySelectorAll('.active-slider').forEach(el => el.classList.remove('active-slider'));
        }
    });

    document.getElementById('btn-save-settings').addEventListener('click', () => {
        saveSettings();
        settingsPanel.classList.remove('active');
    });

    document.getElementById('btn-export-settings').addEventListener('click', () => {
        const settings = getCurrentSettingsObj();
        try {
            const compactCode = encodeSettings(settings);
            prompt("Sao chép mã cấu hình (Tối đa 28 ký tự):", compactCode);
            showToast('Đã tạo mã xuất');
        } catch (e) {
            console.error("Lỗi đóng gói mã cấu hình:", e);
            alert("Có lỗi xảy ra khi tạo mã cấu hình.");
        }
    });

    document.getElementById('btn-import-settings').addEventListener('click', () => {
        const code = prompt("Nhập mã cấu hình đã sao chép:");
        if (code) {
            try {
                const s = decodeSettings(code);
                localStorage.setItem('sttv_cc_settings', JSON.stringify(s));
                loadSettingsFromStorage();
                showToast('Nhập cấu hình thành công!');
            } catch (e) {
                alert("Mã cấu hình không hợp lệ hoặc bị lỗi!");
                console.error("Lỗi nhập mã:", e);
            }
        }
    });

    document.addEventListener('DOMContentLoaded', loadSettingsFromStorage);
}