import { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { computeRangeDates, formatRangeLabel } from '../utils/helpers';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function ChartSection({ range, setRange, startDate, setStartDate, endDate, setEndDate, getChartData, theme, currentAQI }) {
    const [showRangePanel, setShowRangePanel] = useState(false);
    const [tempStartDate, setTempStartDate] = useState('');
    const [tempEndDate, setTempEndDate] = useState('');
    const rangePanelRef = useRef(null);
    const rangeBtnRef = useRef(null);

    useEffect(() => {
        const dates = computeRangeDates(range);
        setStartDate(dates.start);
        setEndDate(dates.end);
        setTempStartDate(dates.start);
        setTempEndDate(dates.end);
    }, [range, setStartDate, setEndDate]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                showRangePanel &&
                rangePanelRef.current &&
                rangeBtnRef.current &&
                !rangePanelRef.current.contains(e.target) &&
                !rangeBtnRef.current.contains(e.target)
            ) {
                setShowRangePanel(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showRangePanel]);

    const data = getChartData();
    const labels = data.map((d) => d.label);
    const aqiVals = data.map((d) => d.aqi);
    const pmVals = data.map((d) => d.pm25);
    const isHourly = labels.length && /^\d{2}:00$/.test(labels[0]);
    const isDark = theme === 'dark';

    // Create gradients using useMemo and ref
    const chartData = {
        labels,
        datasets: [
            {
                label: 'AQI',
                data: aqiVals,
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139,92,246,0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: isHourly ? 2 : 0,
                borderWidth: 3
            },
            {
                label: 'PM2.5',
                data: pmVals,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59,130,246,0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: isHourly ? 2 : 0,
                borderWidth: 3
            }
        ]
    };

    const chartOptions = {
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
                    title: function (items) {
                        return items && items.length ? items[0].label : '';
                    },
                    label: function (context) {
                        return context.dataset.label + ': ' + context.formattedValue;
                    }
                }
            },
            legend: { display: false }
        },
        scales: {
            x: {
                ticks: {
                    color: isDark ? '#94a3b8' : '#9ca3af',
                    maxRotation: 0,
                    maxTicksLimit: !isHourly && labels.length > 14 ? 10 : isHourly ? 12 : 7
                },
                grid: {
                    display: true,
                    color: isDark ? '#334155' : '#f3f4f6'
                }
            },
            y: {
                ticks: { color: isDark ? '#94a3b8' : '#9ca3af' },
                grid: {
                    display: true,
                    color: isDark ? '#334155' : '#f3f4f6'
                }
            }
        }
    };

    const handleRangeClick = (newRange) => {
        setRange(newRange);
        setShowRangePanel(false);
    };

    const handleApplyCustomRange = () => {
        if (!tempStartDate || !tempEndDate) {
            alert('Please select both start and end dates');
            return;
        }
        setRange('custom');
        setStartDate(tempStartDate);
        setEndDate(tempEndDate);
        setShowRangePanel(false);
    };

    const rangeLabel = formatRangeLabel(startDate, endDate);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-700">Air Quality Trends</h2>
                <div className="relative">
                    <button
                        ref={rangeBtnRef}
                        onClick={() => setShowRangePanel(!showRangePanel)}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200"
                    >
                        <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8 7V3h8v4"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                        <span className="text-sm">{rangeLabel}</span>
                        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M6 9l6 6 6-6"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    {/* Range panel */}
                    {showRangePanel && (
                        <div
                            ref={rangePanelRef}
                            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-50"
                        >
                            <div className="p-3">
                                <div className="text-sm font-medium text-gray-700 mb-2">Quick ranges</div>
                                <div className="flex flex-col space-y-1">
                                    {['yesterday', 'today', 'last7', 'last30', 'last90'].map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => handleRangeClick(r)}
                                            className={`rangeBtn text-left px-3 py-2 rounded-md text-sm ${
                                                range === r
                                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {r === 'yesterday'
                                                ? 'Yesterday'
                                                : r === 'today'
                                                ? 'Today'
                                                : r === 'last7'
                                                ? 'Last 7 days'
                                                : r === 'last30'
                                                ? 'Last 30 days'
                                                : 'Last 90 days'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="border-t"></div>
                            <div className="p-3">
                                <div className="text-sm font-medium text-gray-700 mb-2">Custom period:</div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex flex-col">
                                        <label className="text-xs text-gray-500 mb-1">Start date</label>
                                        <input
                                            type="date"
                                            value={tempStartDate}
                                            onChange={(e) => setTempStartDate(e.target.value)}
                                            className="border border-gray-200 rounded-lg px-2 py-1 text-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-xs text-gray-500 mb-1">End date</label>
                                        <input
                                            type="date"
                                            value={tempEndDate}
                                            onChange={(e) => setTempEndDate(e.target.value)}
                                            className="border border-gray-200 rounded-lg px-2 py-1 text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <button
                                        onClick={() => setShowRangePanel(false)}
                                        className="text-sm text-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleApplyCustomRange}
                                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="h-80">
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}

export default ChartSection;

