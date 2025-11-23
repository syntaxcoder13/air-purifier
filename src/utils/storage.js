// localStorage helpers
export function saveAuth(isLoggedIn, userName) {
    try {
        const payload = { isLoggedIn: !!isLoggedIn, userName: userName || '' };
        localStorage.setItem('auth', JSON.stringify(payload));
    } catch (e) {
        // ignore
    }
}

export function loadAuth() {
    try {
        const raw = localStorage.getItem('auth');
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (data && data.isLoggedIn) {
            return { isLoggedIn: true, userName: data.userName || '' };
        }
    } catch (e) {
        // ignore parse errors
    }
    return null;
}

export function saveTheme(theme) {
    try {
        localStorage.setItem('theme', theme);
    } catch (e) {
        // ignore
    }
}

export function loadTheme() {
    try {
        return localStorage.getItem('theme') || 'dark';
    } catch (e) {
        return 'dark';
    }
}

export function saveNotifications(notifications, unreadCount) {
    try {
        const payload = { items: notifications || [], unread: unreadCount || 0 };
        localStorage.setItem('notifications', JSON.stringify(payload));
    } catch (e) {
        // ignore
    }
}

export function loadNotifications() {
    try {
        const raw = localStorage.getItem('notifications');
        if (!raw) return { items: [], unread: 0 };
        const data = JSON.parse(raw);
        if (data && Array.isArray(data.items)) {
            return {
                items: data.items,
                unread: typeof data.unread === 'number' ? data.unread : 0
            };
        }
    } catch (e) {
        // ignore parse errors
    }
    return { items: [], unread: 0 };
}

export function saveInstructionsAccepted(value) {
    try {
        localStorage.setItem('instructionsAccepted', value ? '1' : '0');
    } catch (e) {}
}

export function loadInstructionsAccepted() {
    try {
        return localStorage.getItem('instructionsAccepted') === '1';
    } catch (e) {
        return false;
    }
}

// Session-scoped acceptance (persists across refresh in same tab, cleared when tab/window closes)
export function saveInstructionsAcceptedSession(value) {
    try {
        sessionStorage.setItem('instructionsAcceptedSession', value ? '1' : '0');
    } catch (e) {}
}

export function loadInstructionsAcceptedSession() {
    try {
        return sessionStorage.getItem('instructionsAcceptedSession') === '1';
    } catch (e) {
        return false;
    }
}

