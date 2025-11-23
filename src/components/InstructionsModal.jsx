import { useState } from 'react';
import { saveInstructionsAccepted } from '../utils/storage';

function InstructionsModal({ showInstructions, readOnly = false, onClose, theme = 'dark' }) {
    const [checked, setChecked] = useState(false);

    const isDark = theme === 'dark';
    const modalBg = isDark ? 'bg-slate-800 text-gray-100' : 'bg-white text-gray-900';
    const cardBg = isDark ? 'bg-slate-800' : 'bg-gray-50';
    const cardBorder = isDark ? 'border border-slate-700' : 'border border-gray-100';
    const importantBg = isDark ? 'bg-indigo-900/30 border-l-4 border-indigo-400 text-indigo-200' : 'bg-indigo-50 border-l-4 border-indigo-500 text-indigo-700';

    if (!showInstructions) return null;

    const handleAccept = () => {
        saveInstructionsAccepted(true);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black opacity-60"></div>

            <div className={`relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden ${modalBg}`}>
                <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
                    <div className="p-3 bg-white/20 rounded-lg">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M11 10h2v6h-2zM12 7h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Quick Start & Safety Instructions</h2>
                        <p className="text-sm opacity-90">Read these important points before using the dashboard controls.</p>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="space-y-4">
                        <div className={`${importantBg} p-3 rounded-md`}>
                            <p className="text-sm font-medium">Important</p>
                            <p className="text-sm mt-1">Power control and remote commands work only when the device has at least one active connectivity option (Bluetooth or WiFi).</p>
                        </div>

                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <div className="text-indigo-600 mt-1">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 2v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M5 12a7 7 0 1 0 14 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Enable Bluetooth or WiFi to use Power Control from this dashboard.</div>
                            </li>

                            <li className="flex items-start space-x-3">
                                <div className="text-indigo-600 mt-1">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 8l9 6 9-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Notifications appear in the bell icon. Keep the panel closed to accumulate unread counts.</div>
                            </li>

                            <li className="flex items-start space-x-3">
                                <div className="text-indigo-600 mt-1">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 12h13a3 3 0 1 0 0-6 3 3 0 0 0-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Check filter status and maintenance recommendations regularly for optimal performance.</div>
                            </li>
                        </ul>

                        {/* Removed collapsible FAQ-style details per request */}
                    </div>

                    <div className="space-y-4">
                        <div className={`${cardBg} p-3 rounded-md ${isDark ? '' : ''}`}>
                            <h3 className="text-sm font-medium">Quick tips</h3>
                            <ul className={`mt-2 text-sm list-disc pl-5 space-y-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                <li>Turn on either Bluetooth or WiFi on your device to enable remote control.</li>
                                <li>Use the energy and filter panels to monitor usage and maintenance.</li>
                                <li>Tap the info (i) icon in the navbar to re-open these instructions anytime this session.</li>
                            </ul>
                        </div>

                        <div className={`${cardBg} p-3 rounded-md ${cardBorder}`}>
                            <h4 className="text-sm font-medium">More details</h4>
                            <div className={`text-sm mt-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                <p>When both Bluetooth and WiFi are off, the dashboard disables power control to avoid inconsistent states. If connectivity returns, you can resume control.</p>
                                <p className="mt-2">Power control actions are only accepted when the device rerts at least one active connectivity channel. The UI will show a clear message and disable the control when the device is offline.</p>
                                <p className="mt-2">Notifications are delivered to the bell icon and unread counts increase while the panel is closed. Check the notifications panel to review recent alerts and device recommendations.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`px-6 py-4 border-t flex items-center justify-end space-x-3 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-t'}`}>
                    {!readOnly && (
                        <div className="flex items-center mr-auto">
                            <input
                                id="acceptCheckbox"
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => setChecked(e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="acceptCheckbox" className="text-sm text-gray-700">I have read and agree to the instructions</label>
                        </div>
                    )}

                    {readOnly ? (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            Close
                        </button>
                    ) : (
                        <button
                            onClick={handleAccept}
                            disabled={!checked}
                            className={`px-4 py-2 rounded-lg text-white ${checked ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}
                        >
                            Accept and Continue
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InstructionsModal;
