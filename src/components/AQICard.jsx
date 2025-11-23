import { useEffect, useRef } from 'react';
import { getAQIStatus } from '../utils/helpers';

function AQICard({ currentAQI, isPurifierOn, temperature, humidity, pm25, filterLife, energyUsed }) {
    const filterBarRef = useRef(null);

    useEffect(() => {
        if (filterBarRef.current) {
            if (isPurifierOn) {
                filterBarRef.current.classList.add('filter-anim');
                filterBarRef.current.style.width = filterLife + '%';
                setTimeout(() => {
                    if (filterBarRef.current) {
                        filterBarRef.current.classList.remove('filter-anim');
                    }
                }, 900);
            } else {
                filterBarRef.current.style.width = '0%';
                filterBarRef.current.classList.remove('filter-anim');
            }
        }
    }, [isPurifierOn, filterLife]);
    const aqiStatus = isPurifierOn ? getAQIStatus(Math.round(currentAQI)) : null;

    return (
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-700">Current Air Quality</h2>
                {isPurifierOn && aqiStatus && (
                    <span
                        className="px-4 py-2 rounded-full text-sm font-medium"
                        style={{
                            backgroundColor: aqiStatus.bg,
                            color: aqiStatus.color
                        }}
                    >
                        {aqiStatus.label}
                    </span>
                )}
            </div>

            <div className="flex items-center justify-center mb-6">
                <div className="relative">
                    {isPurifierOn && aqiStatus && (
                        <div
                            className="w-48 h-48 rounded-full opacity-20 absolute inset-0 aqi-glow"
                            style={{
                                backgroundColor: aqiStatus.color,
                                opacity: 0.12
                            }}
                        ></div>
                    )}
                    <div className="relative flex flex-col items-center justify-center w-48 h-48">
                        <div className="text-6xl font-bold text-gray-900 num-xxl">
                            {isPurifierOn ? Math.round(currentAQI) : '-'}
                        </div>
                        <div className="text-lg text-gray-600 mt-2">AQI</div>
                        {isPurifierOn && (
                            <div className="flex items-center mt-2">
                                {currentAQI > 100 ? (
                                    <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M3 17l6-6 4 4 8-8"
                                            stroke="#ef4444"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M21 7l-6 6-4-4-8 8"
                                            stroke="#16a34a"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 2s-6 7-6 11a6 6 0 1 0 12 0c0-4-6-11-6-11z"
                                stroke="#3b82f6"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="text-sm text-gray-600">Humidity</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {isPurifierOn ? Math.round(humidity) + '%' : '-'}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M14 14.76V3a2 2 0 1 0-4 0v11.76A4 4 0 1 0 14 14.76z"
                                stroke="#fb923c"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="text-sm text-gray-600">Temp</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {isPurifierOn ? Math.round(temperature) + '°C' : '-'}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 2C8.1 6 6 8 6 12a6 6 0 1 0 12 0c0-4-2.1-6-6-10z"
                                stroke="#8b5cf6"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="text-sm text-gray-600">PM2.5</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {isPurifierOn ? Math.round(pm25) : '-'}
                    </div>
                </div>
            </div>

            {/* Filter Status and Energy Used */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Filter Status</span>
                        <span className="text-sm font-bold text-green-600">
                            {isPurifierOn ? filterLife + '% Life' : '-'}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                            ref={filterBarRef}
                            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                            style={{ width: isPurifierOn ? filterLife + '%' : '0%' }}
                        ></div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Energy Used Today</span>
                        <span className="text-sm font-bold text-purple-600">
                            {isPurifierOn ? energyUsed + ' kWh' : '-'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AQICard;

