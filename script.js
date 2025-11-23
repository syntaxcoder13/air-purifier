/***********************
    * App State & Helpers *
    ***********************/
const state = {
    isLoggedIn: false,
    isSignUp: false,
    showPassword: false,
    userName: '',
    currentAQI: 156,
    isPurifierOn: false,
    temperature: 28,
    humidity: 65,
    pm25: 78,
    viewMode: 'daily',
    // range can be: 'daily','weekly','monthly','yesterday','today','last7','last30','last90','custom'
    range: 'daily',
    startDate: null,
    endDate: null,
    dailyData: [
        { label: '00:00', aqi: 145, pm25: 72 },
        { label: '04:00', aqi: 132, pm25: 65 },
        { label: '08:00', aqi: 168, pm25: 85 },
        { label: '12:00', aqi: 156, pm25: 78 },
        { label: '16:00', aqi: 142, pm25: 70 },
        { label: '20:00', aqi: 135, pm25: 67 }
    ],
    weeklyData: [
        { label: 'Mon', aqi: 145, pm25: 72 },
        { label: 'Tue', aqi: 132, pm25: 65 },
        { label: 'Wed', aqi: 168, pm25: 85 },
        { label: 'Thu', aqi: 156, pm25: 78 },
        { label: 'Fri', aqi: 142, pm25: 70 },
        { label: 'Sat', aqi: 125, pm25: 62 },
        { label: 'Sun', aqi: 138, pm25: 68 }
    ],
    monthlyData: [
        { label: 'Week 1', aqi: 145, pm25: 72 },
        { label: 'Week 2', aqi: 132, pm25: 65 },
        { label: 'Week 3', aqi: 168, pm25: 85 },
        { label: 'Week 4', aqi: 156, pm25: 78 }
    ]
    ,
    filterLife: 87,
    energyUsed: 2.4
};

function getAQIStatus(aqi) {
    if (aqi <= 50) return { label: 'Good', color: '#16a34a', bg: 'rgba(16,163,82,0.15)' };
    if (aqi <= 100) return { label: 'Moderate', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: '#fb923c', bg: 'rgba(251,146,60,0.15)' };
    if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' };
    return { label: 'Very Unhealthy', color: '#7c3aed', bg: 'rgba(124,58,237,0.15)' };
}

function expandDatasetTo(arr, n) {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    const res = [];
    while (res.length < n) res.push(...arr);
    return res.slice(-n);
}

function generateHourlyDataFor(date, hours = 24, baseAQI = null) {
    // Deterministic hourly generator (no randomness) so UI is stable across reloads
    const out = [];
    const base = baseAQI || Math.round(state.currentAQI);
    for (let h = 0; h < hours; h++) {
        const label = String(h).padStart(2, '0') + ':00';
        // smooth daily cycle using sine wave
        const cycle = Math.sin((h / Math.max(1, hours - 1)) * Math.PI * 2);
        const variation = Math.round(cycle * 6); // ±6
        const aqi = Math.max(10, Math.min(300, base + variation));
        const pm25 = Math.max(5, Math.round(aqi / 2));
        out.push({ label, aqi, pm25 });
    }
    return out;
}

function generateDailyData(days, endDate = new Date(), baseAQI = null) {
    // Deterministic daily generator (no randomness)
    const out = [];
    const base = baseAQI || Math.round(state.currentAQI);
    const d = new Date(endDate);
    d.setHours(0,0,0,0);
    for (let i = days - 1; i >= 0; i--) {
        const cur = new Date(d);
        cur.setDate(d.getDate() - i);
        const label = cur.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        const phase = (days > 1) ? ((days - 1 - i) / (days - 1)) : 0;
        const cycle = Math.sin(phase * Math.PI * 2);
        const variation = Math.round(cycle * 12); // ±12
        const aqi = Math.max(10, Math.min(300, base + variation));
        const pm25 = Math.max(5, Math.round(aqi / 2));
        out.push({ label, aqi, pm25 });
    }
    return out;
}

function getChartDataset() {
    const r = state.range || 'daily';
    if (r === 'daily') return state.dailyData;
    if (r === 'weekly') return state.weeklyData;
    if (r === 'monthly') return state.monthlyData;
    if (r === 'today') {
        // hourly data for today
        return generateHourlyDataFor(new Date(), 24);
    }
    if (r === 'yesterday') {
        const d = new Date(); d.setDate(d.getDate() - 1);
        return generateHourlyDataFor(d, 24, Math.max(50, Math.round(state.currentAQI + randInt(-10, 10))));
    }
    if (r === 'last7') return generateDailyData(7);
    if (r === 'last30') return generateDailyData(30);
    if (r === 'last90') return generateDailyData(90);
    // custom: try to infer number of days between startDate and endDate
    if (r === 'custom' && state.startDate && state.endDate) {
        const sd = new Date(state.startDate);
        const ed = new Date(state.endDate);
        const diff = Math.max(1, Math.round((ed - sd) / (1000 * 60 * 60 * 24)) + 1);
        return expandDatasetTo(state.dailyData, diff);
    }
    return state.dailyData;
}

/***********************
 * DOM Elements *
 ***********************/
const authScreen = document.getElementById('authScreen');
const dashboard = document.getElementById('dashboard');
const btnLoginTab = document.getElementById('btnLoginTab');
const btnSignUpTab = document.getElementById('btnSignUpTab');
const nameRow = document.getElementById('nameRow');
const confirmRow = document.getElementById('confirmRow');
const authToggleText = document.getElementById('authToggleText');
const authToggleBtn = document.getElementById('authToggleBtn');
const authSubmit = document.getElementById('authSubmit');
const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('emailInput');
const nameInput = document.getElementById('nameInput');
const passwordInput = document.getElementById('passwordInput');
const confirmInput = document.getElementById('confirmInput');
const togglePwd = document.getElementById('togglePwd');
const eyeIcon = document.getElementById('eyeIcon');
const profileName = document.getElementById('profileName');
const logoutBtn = document.getElementById('logoutBtn');
const aqiBadge = document.getElementById('aqiBadge');
const aqiGlow = document.getElementById('aqiGlow');
const aqiNumber = document.getElementById('aqiNumber');
const trendIcon = document.getElementById('trendIcon');
const humidityVal = document.getElementById('humidityVal');
const tempVal = document.getElementById('tempVal');
const pmVal = document.getElementById('pmVal');
const powerBtn = document.getElementById('powerBtn');
const powerState = document.getElementById('powerState');
const powerDesc = document.getElementById('powerDesc');
const powerIcon = document.getElementById('powerIcon');
// recommendation container removed
// range controls
const rangeButtons = () => Array.from(document.querySelectorAll('.rangeBtn'));
const startDateEl = () => document.getElementById('startDate');
const endDateEl = () => document.getElementById('endDate');
const applyRangeBtn = () => document.getElementById('applyRange');
const rangePickerBtn = () => document.getElementById('rangePickerBtn');
const rangePanel = () => document.getElementById('rangePanel');
const rangeLabelEl = () => document.getElementById('rangeLabel');
const cancelRangeBtn = () => document.getElementById('cancelRange');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const notifBtn = document.getElementById('notifBtn');
const notifCountEl = document.getElementById('notifCount');
const notifPanel = document.getElementById('notifPanel');
const notifList = document.getElementById('notifList');
const clearNotifsBtn = document.getElementById('clearNotifs');
const filterLifeEl = document.getElementById('filterLife');
const energyValEl = document.getElementById('energyVal');
const filterBarEl = document.getElementById('filterBar');

// SVG icons for theme toggle
const svgMoon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const svgSun = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

let aqiChart = null;
let notifications = [];
let unreadCount = 0;
let prevAQI = state.currentAQI;

/***********************
 * Theme Handling *
 ***********************/
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) themeIcon.innerHTML = svgSun; // Show sun icon to switch to light
        if (themeToggle) themeToggle.setAttribute('aria-pressed', 'true');
    } else {
        document.body.classList.remove('dark-mode');
        if (themeIcon) themeIcon.innerHTML = svgMoon; // Show moon icon to switch to dark
        if (themeToggle) themeToggle.setAttribute('aria-pressed', 'false');
    }
    try { localStorage.setItem('theme', theme); } catch (e) {}
    
    // Update chart colors if chart exists
    if (aqiChart) {
        updateChartTheme();
    }
}

function updateChartTheme() {
    const isDark = document.body.classList.contains('dark-mode');
    const gridColor = isDark ? '#334155' : '#f3f4f6';
    const tickColor = isDark ? '#94a3b8' : '#9ca3af';
    
    aqiChart.options.scales.x.grid.color = gridColor;
    aqiChart.options.scales.y.grid.color = gridColor;
    aqiChart.options.scales.x.ticks.color = tickColor;
    aqiChart.options.scales.y.ticks.color = tickColor;
    
    // Update tooltip for dark mode
    if (isDark) {
        aqiChart.options.plugins.tooltip.backgroundColor = '#1e293b';
        aqiChart.options.plugins.tooltip.titleColor = '#f8fafc';
        aqiChart.options.plugins.tooltip.bodyColor = '#e2e8f0';
        aqiChart.options.plugins.tooltip.borderColor = '#475569';
    } else {
        aqiChart.options.plugins.tooltip.backgroundColor = 'white';
        aqiChart.options.plugins.tooltip.titleColor = '#111827';
        aqiChart.options.plugins.tooltip.bodyColor = '#374151';
        aqiChart.options.plugins.tooltip.borderColor = '#e5e7eb';
    }
    
    aqiChart.update();
}

/* Notification helpers */
function renderNotifications() {
    if (!notifList) return;
    notifList.innerHTML = '';
    if (notifications.length === 0) {
        notifList.innerHTML = '<div class="text-center text-xs text-gray-500 p-3">No notifications</div>';
        return;
    }
    notifications.slice().reverse().forEach(n => {
        const d = document.createElement('div');
        d.className = 'px-2 py-2 border-b border-gray-100';
        d.innerHTML = `<div class="text-sm">${escapeHtml(n.text)}</div><div class="text-xs text-gray-400 mt-1">${n.time}</div>`;
        notifList.appendChild(d);
    });
}

function updateNotifBadge() {
    if (!notifCountEl) return;
    if (unreadCount > 0) {
        // cap the visible count to avoid overflowing the badge/UI
        notifCountEl.textContent = (unreadCount > 99) ? '99+' : String(unreadCount);
        notifCountEl.classList.remove('hidden');
    } else {
        notifCountEl.classList.add('hidden');
        // ensure text is cleared so it doesn't linger when CSS forces visibility
        notifCountEl.textContent = '';
    }
}

function addNotification(text) {
    const now = new Date();
    notifications.push({ text, time: now.toLocaleTimeString() });
    unreadCount++;
    updateNotifBadge();
    renderNotifications();
    saveNotifications();
}

function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* Persist notifications to localStorage so they survive reloads */
function saveNotifications() {
    try {
        const payload = { items: notifications || [], unread: unreadCount || 0 };
        localStorage.setItem('notifications', JSON.stringify(payload));
    } catch (e) {
        // ignore
    }
}

function loadNotifications() {
    try {
        const raw = localStorage.getItem('notifications');
        if (!raw) return;
        const data = JSON.parse(raw);
        if (data && Array.isArray(data.items)) {
            notifications = data.items;
            unreadCount = typeof data.unread === 'number' ? data.unread : 0;
        }
    } catch (e) {
        // ignore parse errors
    }
}

function toggleNotifPanel(open) {
    if (!notifPanel || !notifBtn) return;
    const isOpen = !notifPanel.classList.contains('hidden');
    const shouldOpen = (typeof open === 'boolean') ? open : !isOpen;
    if (shouldOpen) {
        notifPanel.classList.remove('hidden');
        notifBtn.setAttribute('aria-expanded', 'true');
        // mark as read: clear unread badge but keep history
        unreadCount = 0;
        updateNotifBadge();
        saveNotifications();
    } else {
        notifPanel.classList.add('hidden');
        notifBtn.setAttribute('aria-expanded', 'false');
    }
}

if (notifBtn) {
    notifBtn.addEventListener('click', () => toggleNotifPanel());
}
    if (clearNotifsBtn) {
    clearNotifsBtn.addEventListener('click', () => { notifications = []; unreadCount = 0; renderNotifications(); updateNotifBadge(); saveNotifications(); toggleNotifPanel(false); });
}
const cancelNotifsBtn = document.getElementById('cancelNotifs');
if (cancelNotifsBtn) {
    cancelNotifsBtn.addEventListener('click', () => toggleNotifPanel(false));
}


// Initialize theme
(function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    const theme = saved || 'dark';
    applyTheme(theme);
})();

// Load persisted notifications (history + unread count)
loadNotifications();
renderNotifications();
updateNotifBadge();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-mode');
        applyTheme(isDark ? 'light' : 'dark');
    });
    themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            themeToggle.click();
        }
    });
}

/* -----------------------------
   Auth persistence (localStorage)
   ----------------------------- */
function saveAuth() {
    try {
        const payload = { isLoggedIn: !!state.isLoggedIn, userName: state.userName || '' };
        localStorage.setItem('auth', JSON.stringify(payload));
    } catch (e) {
        // ignore
    }
}

function loadAuth() {
    try {
        const raw = localStorage.getItem('auth');
        if (!raw) return false;
        const data = JSON.parse(raw);
        if (data && data.isLoggedIn) {
            state.isLoggedIn = true;
            state.userName = data.userName || '';
            // show dashboard immediately
            showDashboard();
            return true;
        }
    } catch (e) {
        // ignore parse errors
    }
    return false;
}

/***********************
 * Auth Logic *
 ***********************/
function setAuthMode(isSignUp) {
    state.isSignUp = isSignUp;
    nameRow.classList.toggle('hidden', !isSignUp);
    confirmRow.classList.toggle('hidden', !isSignUp);
    btnLoginTab.classList.toggle('bg-white', !isSignUp);
    btnSignUpTab.classList.toggle('bg-white', isSignUp);
    btnLoginTab.classList.toggle('text-indigo-600', !isSignUp);
    btnSignUpTab.classList.toggle('text-indigo-600', isSignUp);
    authSubmit.textContent = isSignUp ? 'Create Account' : 'Sign In';
    authToggleText.textContent = isSignUp ? 'Already have an account?' : "Don't have an account?";
    authToggleBtn.textContent = isSignUp ? 'Login' : 'Sign Up';
}

btnLoginTab.addEventListener('click', () => setAuthMode(false));
btnSignUpTab.addEventListener('click', () => setAuthMode(true));
authToggleBtn.addEventListener('click', () => setAuthMode(!state.isSignUp));

togglePwd.addEventListener('click', () => {
    state.showPassword = !state.showPassword;
    passwordInput.type = state.showPassword ? 'text' : 'password';
    confirmInput.type = state.showPassword ? 'text' : 'password';
    eyeIcon.innerHTML = state.showPassword ?
        '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="#9ca3af" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="#9ca3af" stroke-width="1.2" />' :
        '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-6 0-10-7-10-7a18.58 18.58 0 0 1 5-5.94" stroke="#9ca3af" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 1l22 22" stroke="#9ca3af" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>';
});

authSubmit.addEventListener('click', (e) => {
    const email = emailInput.value.trim();
    const pwd = passwordInput.value.trim();
    const name = nameInput.value.trim();
    const confirm = confirmInput.value.trim();

    if (state.isSignUp) {
        if (!name || !email || !pwd) { alert('Please fill all fields!'); return; }
        if (pwd !== confirm) { alert('Passwords do not match!'); return; }
        state.userName = name;
    } else {
        if (!email || !pwd) { alert('Please fill all fields!'); return; }
        state.userName = email.split('@')[0] || 'user';
    }

    emailInput.value = '';
    passwordInput.value = '';
    nameInput.value = '';
    confirmInput.value = '';
    state.isLoggedIn = true;
    saveAuth();
    showDashboard();
});

logoutBtn.addEventListener('click', () => {
    state.isLoggedIn = false;
    state.userName = '';
    saveAuth();
    dashboard.classList.add('hidden');
    authScreen.classList.remove('hidden');
});

/***********************
 * Dashboard render/update *
 ***********************/
function updateAQIUI() {
    // If purifier is OFF, show NULL values in the UI (display-only). Keep internal numeric state for simulation.
    if (!state.isPurifierOn) {
        // Hide the small badge up top; show a dash only in the main AQI number.
        aqiNumber.textContent = '-';
        if (aqiBadge) aqiBadge.classList.add('hidden');
        aqiBadge.style.backgroundColor = '';
        aqiBadge.style.color = '';
        aqiGlow.style.backgroundColor = '';
        aqiGlow.style.opacity = '0';
        humidityVal.textContent = '-';
        tempVal.textContent = '-';
        pmVal.textContent = '-';
        if (filterLifeEl) filterLifeEl.textContent = '-';
        if (energyValEl) energyValEl.textContent = '-';
        // collapse filter bar visually when device is OFF
        if (filterBarEl) {
            filterBarEl.style.width = '0%';
            filterBarEl.classList.remove('filter-anim');
        }
        trendIcon.innerHTML = '';
        return;
    }

    const s = getAQIStatus(Math.round(state.currentAQI));
    aqiBadge.textContent = s.label;
    aqiBadge.style.backgroundColor = s.bg;
    aqiBadge.style.color = s.color;
    // Ensure badge is visible when purifier is ON
    if (aqiBadge) aqiBadge.classList.remove('hidden');
    aqiGlow.style.backgroundColor = s.color;
    aqiGlow.style.opacity = '0.12';
    aqiNumber.textContent = Math.round(state.currentAQI);
    humidityVal.textContent = Math.round(state.humidity) + '%';
    tempVal.textContent = Math.round(state.temperature) + '°C';
    pmVal.textContent = Math.round(state.pm25);
    if (filterLifeEl) filterLifeEl.textContent = (typeof state.filterLife === 'number') ? state.filterLife + '% Life' : String(state.filterLife);
    if (energyValEl) energyValEl.textContent = (typeof state.energyUsed === 'number') ? state.energyUsed + ' kWh' : String(state.energyUsed);
    // animate filter bar when purifier is ON
    if (filterBarEl) {
        // ensure it animates from current width to new width
        // add class for subtle glow during transition
        filterBarEl.classList.add('filter-anim');
        // set width to configured percentage
        filterBarEl.style.width = (typeof state.filterLife === 'number' ? state.filterLife : 0) + '%';
        // remove glow after animation completes
        setTimeout(() => filterBarEl.classList.remove('filter-anim'), 900);
    }

    if (state.currentAQI > 100) {
        trendIcon.innerHTML = '<path d="M3 17l6-6 4 4 8-8" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
    } else {
        trendIcon.innerHTML = '<path d="M21 7l-6 6-4-4-8 8" stroke="#16a34a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    // recommendations removed
}
// recommendation logic removed

function powerSvg(size = 20) { return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="M12 2v10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12a7 7 0 1 0 14 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }
function windSvg(size = 20) { return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="M3 12h13a3 3 0 1 0 0-6 3 3 0 0 0-3 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }
function alertSvg(size = 20) { return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 9v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 17h.01" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }
function checkSvg(size = 20) { return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }
function zapSvg(size = 20) { return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }

/***********************
 * Chart Setup *
 ***********************/
function createChart() {
    const ctx = document.getElementById('aqiChart').getContext('2d');
    const data = getChartDataset();
    const labels = data.map(d => d.label);
    const aqiVals = data.map(d => d.aqi);
    const pmVals = data.map(d => d.pm25);
    const isDark = document.body.classList.contains('dark-mode');

    // detect hourly vs daily labels (hourly labels like '00:00')
    const isHourly = labels.length && /^\d{2}:00$/.test(labels[0]);

    const gradientAQI = ctx.createLinearGradient(0, 0, 0, 400);
    gradientAQI.addColorStop(0, 'rgba(139,92,246,0.8)');
    gradientAQI.addColorStop(1, 'rgba(139,92,246,0.0)');

    const gradientPM = ctx.createLinearGradient(0, 0, 0, 400);
    gradientPM.addColorStop(0, 'rgba(59,130,246,0.8)');
    gradientPM.addColorStop(1, 'rgba(59,130,246,0.0)');

    const cfg = {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'AQI',
                    data: aqiVals,
                    borderColor: '#8b5cf6',
                    backgroundColor: gradientAQI,
                    fill: true,
                    tension: 0.4,
                    pointRadius: isHourly ? 2 : 0,
                    borderWidth: 3
                },
                {
                    label: 'PM2.5',
                    data: pmVals,
                    borderColor: '#3b82f6',
                    backgroundColor: gradientPM,
                    fill: true,
                    tension: 0.4,
                    pointRadius: isHourly ? 2 : 0,
                    borderWidth: 3
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    backgroundColor: isDark ? '#1e293b' : 'white',
                    titleColor: isDark ? '#f8fafc' : '#111827',
                    bodyColor: isDark ? '#e2e8f0' : '#374151',
                    borderColor: isDark ? '#475569' : '#e5e7eb',
                    borderWidth: 1,
                    usePointStyle: true,
                    padding: 10,
                    callbacks: {
                        title: function(items) {
                            // show full label as title
                            return items && items.length ? items[0].label : '';
                        },
                        label: function(context) {
                            return context.dataset.label + ': ' + context.formattedValue;
                        }
                    }
                },
                legend: { display: false }
            },
            scales: {
                x: {
                    ticks: { color: isDark ? '#94a3b8' : '#9ca3af', maxRotation: 0 },
                    grid: { display: true, color: isDark ? '#334155' : '#f3f4f6' },
                    ticks: { color: isDark ? '#94a3b8' : '#9ca3af' },
                    afterDataLimits: function(scale) {
                        // reduce tick density for long ranges
                        if (!isHourly && labels.length > 14) {
                            scale.options.ticks.maxTicksLimit = 10;
                        } else {
                            scale.options.ticks.maxTicksLimit = isHourly ? 12 : 7;
                        }
                    }
                },
                y: {
                    ticks: { color: isDark ? '#94a3b8' : '#9ca3af' },
                    grid: { display: true, color: isDark ? '#334155' : '#f3f4f6' }
                }
            }
        }
    };

    if (aqiChart) { aqiChart.destroy(); }
    aqiChart = new Chart(ctx, cfg);
}

function refreshChart() {
    const data = getChartDataset();
    const labels = data.map(d => d.label);
    const aqiVals = data.map(d => d.aqi);
    const pmVals = data.map(d => d.pm25);
    const isHourly = labels.length && /^\d{2}:00$/.test(labels[0]);
    aqiChart.data.labels = labels;
    aqiChart.data.datasets[0].data = aqiVals;
    aqiChart.data.datasets[1].data = pmVals;
    // adjust visual density
    aqiChart.data.datasets[0].pointRadius = isHourly ? 2 : 0;
    aqiChart.data.datasets[1].pointRadius = isHourly ? 2 : 0;
    if (!isHourly && labels.length > 14) {
        aqiChart.options.scales.x.ticks.maxTicksLimit = 10;
    } else {
        aqiChart.options.scales.x.ticks.maxTicksLimit = isHourly ? 12 : 7;
    }
    aqiChart.update();
}

function formatDateISO(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function computeRangeDates(range) {
    const today = new Date();
    today.setHours(0,0,0,0);
    let start = new Date(today);
    let end = new Date(today);
    if (range === 'today') {
        // start=end=today
    } else if (range === 'yesterday') {
        start.setDate(today.getDate() - 1);
        end.setDate(today.getDate() - 1);
    } else if (range === 'last7') {
        start.setDate(today.getDate() - 6);
    } else if (range === 'last30') {
        start.setDate(today.getDate() - 29);
    } else if (range === 'last90') {
        start.setDate(today.getDate() - 89);
    }
    return { start: formatDateISO(start), end: formatDateISO(end) };
}

function setRangeUI(range) {
    state.range = range;
    const dates = computeRangeDates(range);
    if (startDateEl) startDateEl.value = dates.start;
    if (endDateEl) endDateEl.value = dates.end;
    state.startDate = dates.start;
    state.endDate = dates.end;
    // update active class on buttons
    document.querySelectorAll('.rangeBtn').forEach(b => b.classList.remove('bg-gradient-to-r','from-blue-500','to-indigo-600','text-white','shadow-md'));
    const btn = Array.from(rangeButtons()).find(b => b.dataset.range === range);
    if (btn) btn.classList.add('bg-gradient-to-r','from-blue-500','to-indigo-600','text-white','shadow-md');
    if (aqiChart) refreshChart(); else createChart();
    // update visible label on the picker
    const labelEl = rangeLabelEl(); if (labelEl) labelEl.textContent = formatRangeLabel(dates.start, dates.end);
}

if (rangeButtons() && rangeButtons().length > 0) {
    // attach to currently available buttons; when calling later we'll re-query
    rangeButtons().forEach(btn => {
        btn.addEventListener('click', () => {
            setRangeUI(btn.dataset.range);
            // close panel if present
            const panel = rangePanel(); if (panel) panel.classList.add('hidden');
        });
    });
}

if (applyRangeBtn) {
    applyRangeBtn().addEventListener('click', () => {
        const sEl = startDateEl(); const eEl = endDateEl();
        if (!sEl || !eEl) return;
        const s = sEl.value;
        const e = eEl.value;
        if (!s || !e) { alert('Please select both start and end dates'); return; }
        state.range = 'custom';
        state.startDate = s;
        state.endDate = e;
        // clear active preset buttons
        document.querySelectorAll('.rangeBtn').forEach(b => b.classList.remove('bg-gradient-to-r','from-blue-500','to-indigo-600','text-white','shadow-md'));
        // update label
        const labelEl = rangeLabelEl(); if (labelEl) labelEl.textContent = formatRangeLabel(s, e);
        if (aqiChart) refreshChart(); else createChart();
        // close panel
        const panel = rangePanel(); if (panel) panel.classList.add('hidden');
    });
}

// toggle panel button
if (rangePickerBtn()) {
    rangePickerBtn().addEventListener('click', (e) => {
        const panel = rangePanel(); if (!panel) return;
        panel.classList.toggle('hidden');
    });
}

// cancel button in panel
if (cancelRangeBtn()) {
    cancelRangeBtn().addEventListener('click', () => {
        const panel = rangePanel(); if (panel) panel.classList.add('hidden');
    });
}

// close panel when clicking outside
document.addEventListener('click', (e) => {
    const panel = rangePanel(); const btn = rangePickerBtn();
    if (!panel || !btn) return;
    if (panel.classList.contains('hidden')) return;
    const target = e.target;
    if (!panel.contains(target) && !btn.contains(target)) {
        panel.classList.add('hidden');
    }
});

function formatRangeLabel(startISO, endISO) {
    try {
        const s = new Date(startISO);
        const e = new Date(endISO);
        const opts = { month: 'short', day: 'numeric' };
        if (startISO === endISO) return s.toLocaleDateString(undefined, opts);
        return s.toLocaleDateString(undefined, opts) + ' - ' + e.toLocaleDateString(undefined, opts);
    } catch (err) {
        return startISO + ' - ' + endISO;
    }
}

// Initialize default range UI
setRangeUI(state.range || 'daily');

/***********************
 * Simulate real-time data *
 ***********************/
let simInterval = null;
function startSimulation() {
    if (simInterval) clearInterval(simInterval);
    simInterval = setInterval(() => {
        if (state.isPurifierOn) {
            state.currentAQI = Math.max(50, state.currentAQI - Math.random() * 3);
            state.pm25 = Math.max(20, state.pm25 - Math.random() * 2);
        } else {
            state.currentAQI = Math.min(200, state.currentAQI + Math.random() * 2);
            state.pm25 = Math.min(150, state.pm25 + Math.random() * 1.5);
        }
        state.temperature = 27 + Math.random() * 3;
        state.humidity = 60 + Math.random() * 10;

        const dest = getChartDataset();
        if (Array.isArray(dest) && dest.length) {
            const last = dest[dest.length - 1];
            last.aqi = Math.round(state.currentAQI);
            last.pm25 = Math.round(state.pm25);
        }

        updateAQIUI();
        // notify when AQI crosses into high range
        if (prevAQI <= 150 && state.currentAQI > 150) {
            addNotification('AQI spiked to ' + Math.round(state.currentAQI) + ' — consider turning on purifier');
        }
        prevAQI = state.currentAQI;
        refreshChart();
    }, 3000);
}

/***********************
 * Device control logic *
 ***********************/
powerBtn.addEventListener('click', () => {
    state.isPurifierOn = !state.isPurifierOn;
    if (state.isPurifierOn) {
        powerBtn.classList.remove('bg-gradient-to-br', 'from-gray-300', 'to-gray-400');
        powerBtn.classList.add('bg-gradient-to-br', 'from-green-400', 'to-green-600', 'shadow-lg');
        powerState.textContent = 'ON';
        powerDesc.textContent = 'Purifying Air...';
    } else {
        powerBtn.classList.remove('from-green-400', 'to-green-600', 'shadow-lg');
        powerBtn.classList.add('bg-gradient-to-br', 'from-gray-300', 'to-gray-400');
        powerState.textContent = 'OFF';
        powerDesc.textContent = 'Tap to Start';
    }
    // notify user of purifier state change
    addNotification('Purifier turned ' + (state.isPurifierOn ? 'ON' : 'OFF'));
    // Immediately update AQI display so turning OFF shows NULL right away
    updateAQIUI();
});

/***********************
 * Show Dashboard *
 ***********************/
function showDashboard() {
    authScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    profileName.textContent = state.userName || 'User';
    updateAQIUI();
    createChart();
    startSimulation();
}

// Try to restore auth from storage; if not restored, default to login mode
if (!loadAuth()) {
    setAuthMode(false);
}

authForm.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        authSubmit.click();
    }
});