// Helper functions
export function getAQIStatus(aqi) {
    if (aqi <= 50) return { label: 'Good', color: '#16a34a', bg: 'rgba(16,163,82,0.15)' };
    if (aqi <= 100) return { label: 'Moderate', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: '#fb923c', bg: 'rgba(251,146,60,0.15)' };
    if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' };
    return { label: 'Very Unhealthy', color: '#7c3aed', bg: 'rgba(124,58,237,0.15)' };
}

export function expandDatasetTo(arr, n) {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    const res = [];
    while (res.length < n) res.push(...arr);
    return res.slice(-n);
}

export function generateHourlyDataFor(date, hours = 24, baseAQI = null, currentAQI = 156) {
    const out = [];
    const base = baseAQI || Math.round(currentAQI);
    for (let h = 0; h < hours; h++) {
        const label = String(h).padStart(2, '0') + ':00';
        const cycle = Math.sin((h / Math.max(1, hours - 1)) * Math.PI * 2);
        const variation = Math.round(cycle * 6);
        const aqi = Math.max(10, Math.min(300, base + variation));
        const pm25 = Math.max(5, Math.round(aqi / 2));
        out.push({ label, aqi, pm25 });
    }
    return out;
}

export function generateDailyData(days, endDate = new Date(), baseAQI = null, currentAQI = 156) {
    const out = [];
    const base = baseAQI || Math.round(currentAQI);
    const d = new Date(endDate);
    d.setHours(0, 0, 0, 0);
    for (let i = days - 1; i >= 0; i--) {
        const cur = new Date(d);
        cur.setDate(d.getDate() - i);
        const label = cur.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        const phase = (days > 1) ? ((days - 1 - i) / (days - 1)) : 0;
        const cycle = Math.sin(phase * Math.PI * 2);
        const variation = Math.round(cycle * 12);
        const aqi = Math.max(10, Math.min(300, base + variation));
        const pm25 = Math.max(5, Math.round(aqi / 2));
        out.push({ label, aqi, pm25 });
    }
    return out;
}

export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatDateISO(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

export function computeRangeDates(range) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
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

export function formatRangeLabel(startISO, endISO) {
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

export function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

