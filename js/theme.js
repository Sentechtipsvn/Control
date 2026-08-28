// Lấy các phần tử DOM
const settingsBtn = document.getElementById('open-settings');
const settingsPanel = document.getElementById('settings-panel');
const closeSettings = document.getElementById('close-settings');

// Xử lý mở/đóng bảng cài đặt
settingsBtn.addEventListener('click', () => settingsPanel.classList.add('active'));
closeSettings.addEventListener('click', () => settingsPanel.classList.remove('active'));

// Lấy biến CSS và các input
const root = document.documentElement;
const bgColorInput = document.getElementById('stt-bg-color');
const cardBgInput = document.getElementById('stt-card-bg');
const titleColorInput = document.getElementById('stt-title-color');
const labelColorInput = document.getElementById('stt-label-color');
const cardShadowToggle = document.getElementById('stt-card-shadow-toggle');
const iconShadowToggle = document.getElementById('stt-icon-shadow-toggle');

// Shadow Slider Inputs
const shadowX = document.getElementById('shadow-x');
const shadowY = document.getElementById('shadow-y');
const shadowBlur = document.getElementById('shadow-blur');
const shadowSpread = document.getElementById('shadow-spread');
const shadowColor = document.getElementById('shadow-color');

// Hàm lưu cấu hình
function saveSettings() {
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

// Hàm áp dụng cấu hình
function applySettings() {
    // Lấy cấu hình đã lưu nếu có
    const saved = localStorage.getItem('cc-settings');
    if (saved) {
        const s = JSON.parse(saved);
        bgColorInput.value = s.bg; cardBgInput.value = s.cardBg;
        titleColorInput.value = s.titleColor; labelColorInput.value = s.labelColor;
        cardShadowToggle.checked = s.cardShadow; iconShadowToggle.checked = s.iconShadow;
        shadowX.value = s.shX; shadowY.value = s.shY; shadowBlur.value = s.shBlur; shadowSpread.value = s.shSpread; shadowColor.value = s.shColor;
    }

    // Apply CSS Variables
    root.style.setProperty('--bg-color', bgColorInput.value);
    root.style.setProperty('--card-bg', cardBgInput.value);
    root.style.setProperty('--title-color', titleColorInput.value);
    root.style.setProperty('--label-color', labelColorInput.value);

    // Áp dụng shadow cho Card và Icon
    const shadowValue = `${shadowX.value}px ${shadowY.value}px ${shadowBlur.value}px ${shadowSpread.value}px ${shadowColor.value}`;
    root.style.setProperty('--card-shadow', cardShadowToggle.checked ? shadowValue : 'none');
    root.style.setProperty('--icon-shadow', iconShadowToggle.checked ? shadowValue : 'none');
    
    // Cập nhật text cho các label value
    document.getElementById('val-shadow-x').innerText = shadowX.value;
    document.getElementById('val-shadow-y').innerText = shadowY.value;
    document.getElementById('val-shadow-blur').innerText = shadowBlur.value;
    document.getElementById('val-shadow-spread').innerText = shadowSpread.value;
}

// Lắng nghe sự kiện thay đổi
[bgColorInput, titleColorInput, labelColorInput, shadowColor].forEach(input => {
    input.addEventListener('input', () => { applySettings(); saveSettings(); });
});
cardBgInput.addEventListener('input', () => { applySettings(); saveSettings(); });
cardShadowToggle.addEventListener('change', () => { applySettings(); saveSettings(); });
iconShadowToggle.addEventListener('change', () => { applySettings(); saveSettings(); });
[shadowX, shadowY, shadowBlur, shadowSpread].forEach(input => {
    input.addEventListener('input', () => { applySettings(); saveSettings(); });
});

// Chạy lần đầu
applySettings();