import { useEffect, useRef } from 'react';

function DeviceControl({ isPurifierOn, onPowerToggle, isBluetoothOn, onBluetoothToggle, isWifiOn, onWifiToggle }) {
    const isConnectivityAvailable = isBluetoothOn || isWifiOn;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-6">Device Control</h2>

            {/* Bluetooth and WiFi Controls */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Connectivity</h3>
                <div className="grid grid-cols-2 gap-4">
                    {/* Bluetooth Button */}
                    <button
                        onClick={onBluetoothToggle}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                            isBluetoothOn
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6.5 6.5l11 11M12 3v6m0 6v6M17.5 6.5C16 5 13.5 4.5 12 4.5c-1.5 0-4 .5-5.5 2M17.5 17.5C16 19 13.5 19.5 12 19.5c-1.5 0-4-.5-5.5-2"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M9 12a3 3 0 1 0 6 0"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="text-xs font-medium">Bluetooth</span>
                        <span className="text-xs mt-1 opacity-80">{isBluetoothOn ? 'ON' : 'OFF'}</span>
                    </button>

                    {/* WiFi Button */}
                    <button
                        onClick={onWifiToggle}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                            isWifiOn
                                ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M5 12.55a11 11 0 0 1 14.08 0"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M1.42 9a16 16 0 0 1 21.16 0"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M8.53 16.11a6 6 0 0 1 6.95 0"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 20h.01"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="text-xs font-medium">WiFi</span>
                        <span className="text-xs mt-1 opacity-80">{isWifiOn ? 'ON' : 'OFF'}</span>
                    </button>
                </div>
            </div>

            {/* Power Control */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-6">Power Control</h3>
                <div className="flex flex-col items-center">
                    <button
                        onClick={() => { if (isConnectivityAvailable) onPowerToggle(); }}
                        disabled={!isConnectivityAvailable}
                        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 transform shadow-lg ${
                            isPurifierOn
                                ? 'bg-gradient-to-br from-green-400 to-green-600'
                                : 'bg-gradient-to-br from-gray-300 to-gray-400'
                        } ${!isConnectivityAvailable ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'hover:scale-105'}`}
                    >
                        <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 2v10"
                                stroke="#fff"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M5 12a7 7 0 1 0 14 0"
                                stroke="#fff"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <div className="mt-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">{isPurifierOn ? 'ON' : 'OFF'}</div>
                        <div className="text-sm text-gray-500 mt-1">
                            {isPurifierOn ? 'Purifying Air...' : 'Tap to Start'}
                        </div>
                    </div>
                    {!isConnectivityAvailable && (
                        <div className="text-xs text-red-500 mt-3">Enable Bluetooth or WiFi to use Power Control</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DeviceControl;
