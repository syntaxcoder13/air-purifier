import { useState, useEffect, useRef } from 'react';

function Header({ user, onLogout, theme, onThemeToggle, notifications, unreadCount, showNotifPanel, onToggleNotifPanel, onClearNotifications, isPurifierOn, openInstructions }) {
    const notifPanelRef = useRef(null);
    const notifBtnRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                showNotifPanel &&
                notifPanelRef.current &&
                notifBtnRef.current &&
                !notifPanelRef.current.contains(e.target) &&
                !notifBtnRef.current.contains(e.target)
            ) {
                onToggleNotifPanel();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showNotifPanel, onToggleNotifPanel]);

    const svgMoon = (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    const svgSun = (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    return (
        <div className="header-bg shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M3 12h13a3 3 0 1 0 0-6 3 3 0 0 0-3 3"
                                    stroke="#fff"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Smart Air Purifier</h1>
                            <p className="text-sm text-gray-500">Real-time Air Quality Monitoring</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            {isPurifierOn ? (
                                <>
                                    <svg className="w-5 h-5 text-green-500 animate-pulse" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M12 2v20"
                                            stroke="#16a34a"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-600">Live</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M12 2v20"
                                            stroke="#9ca3af"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-500">Offline</span>
                                </>
                            )}
                        </div>
                        <div className="flex items-center space-x-3 bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-2 rounded-xl border border-indigo-100 relative">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                                        stroke="#fff"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <span className="font-semibold text-gray-900" title={user.name}>
                                {user.name}
                            </span>
                            <button onClick={onLogout} className="text-red-600 hover:text-red-800 transition" title="Logout">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex items-center space-x-3 relative">
                            {/* Notification bell */}
                            <button
                                ref={notifBtnRef}
                                onClick={onToggleNotifPanel}
                                className="relative text-gray-600 hover:text-gray-800 transition mr-2"
                                title="Notifications"
                                aria-haspopup="true"
                                aria-expanded={showNotifPanel}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"
                                        stroke="currentColor"
                                        strokeWidth="1.4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2.5 h-2.5"></span>
                                )}
                            </button>

                            {/* Notification panel */}
                            {showNotifPanel && (
                                <div
                                    ref={notifPanelRef}
                                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50"
                                >
                                    <div className="px-3 py-2 border-b text-sm font-semibold">Notifications</div>
                                    <div className="max-h-48 overflow-y-auto p-2 text-sm">
                                        {notifications.length === 0 ? (
                                            <div className="text-center text-xs text-gray-500 p-3">No notifications</div>
                                        ) : (
                                            notifications
                                                .slice()
                                                .reverse()
                                                .map((n, idx) => (
                                                    <div key={idx} className="px-2 py-2 border-b border-gray-100">
                                                        <div className="text-sm">{n.text}</div>
                                                        <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                                                    </div>
                                                ))
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between p-2 border-t">
                                        <button
                                            onClick={onToggleNotifPanel}
                                            className="text-sm text-gray-600"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={onClearNotifications}
                                            className="text-sm text-indigo-600"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => openInstructions(true)}
                                className="text-gray-600 hover:text-gray-800 transition mr-2"
                                title="Instructions"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M11 10h2v6h-2zM12 7h.01" stroke="#6b7280" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button
                                onClick={onThemeToggle}
                                className="text-gray-600 hover:text-gray-800 transition mr-2"
                                title="Toggle theme"
                                role="button"
                                aria-pressed={theme === 'dark'}
                                tabIndex={0}
                            >
                                {theme === 'dark' ? svgSun : svgMoon}
                            </button>
                        </div>
                    </div>

                    {/* Hamburger Menu Button for Mobile */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                            aria-label="Open menu"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu Panel */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden absolute top-full right-4 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                            <div className="p-4 space-y-4">
                                {/* User Info */}
                                <div className="flex items-center space-x-3">
                                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                                                stroke="#fff"
                                                strokeWidth="1.2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <span className="font-semibold text-gray-900 truncate" title={user.name}>
                                        {user.name}
                                    </span>
                                </div>

                                <div className="border-t border-gray-200"></div>

                                {/* Menu Items */}
                                <div className="space-y-2">
                                    <button
                                        onClick={() => { onToggleNotifPanel(); setIsMobileMenuOpen(false); }}
                                        className="w-full flex items-center justify-between text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                                    >
                                        <span>Notifications</span>
                                        {unreadCount > 0 && (
                                            <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</span>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => { openInstructions(true); setIsMobileMenuOpen(false); }}
                                        className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                                    >
                                        Instructions
                                    </button>
                                    <button
                                        onClick={() => { onThemeToggle(); setIsMobileMenuOpen(false); }}
                                        className="w-full flex items-center justify-between text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                                    >
                                        <span>Toggle Theme</span>
                                        <span>{theme === 'dark' ? svgSun : svgMoon}</span>
                                    </button>
                                </div>

                                <div className="border-t border-gray-200"></div>

                                {/* Live/Offline Status */}
                                <div className="flex items-center justify-between px-3 py-2">
                                    <span className="text-sm text-gray-600">Device Status</span>
                                    {isPurifierOn ? (
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4 text-green-500 animate-pulse" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M12 2v20"
                                                    stroke="#16a34a"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-600">Live</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M12 2v20"
                                                    stroke="#9ca3af"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-500">Offline</span>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-gray-200"></div>

                                {/* Logout Button */}
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center space-x-3 text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>Change User</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;
