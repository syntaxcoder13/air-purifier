import { useState, useEffect, useRef } from 'react';
import Header from './Header';
import AQICard from './AQICard';
import DeviceControl from './DeviceControl';
import ChartSection from './ChartSection';
import { getChartDataset } from '../utils/chartData';

function Dashboard({ user, onLogout, theme, onThemeToggle, openInstructions }) {
    const [currentAQI, setCurrentAQI] = useState(156);
    const [isPurifierOn, setIsPurifierOn] = useState(false);
    const [temperature, setTemperature] = useState(28);
    const [humidity, setHumidity] = useState(65);
    const [pm25, setPm25] = useState(78);
    const [filterLife, setFilterLife] = useState(87);
    const [energyUsed, setEnergyUsed] = useState(2.4);
    const [isBluetoothOn, setIsBluetoothOn] = useState(false);
    const [isWifiOn, setIsWifiOn] = useState(false);
    const [range, setRange] = useState('daily');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifPanel, setShowNotifPanel] = useState(false);
    const prevAQIRef = useRef(currentAQI);
    const lastNotificationRef = useRef({ text: '', time: 0 });
    const powerToggleProcessingRef = useRef(false);

    const dailyData = [
        { label: '00:00', aqi: 145, pm25: 72 },
        { label: '04:00', aqi: 132, pm25: 65 },
        { label: '08:00', aqi: 168, pm25: 85 },
        { label: '12:00', aqi: 156, pm25: 78 },
        { label: '16:00', aqi: 142, pm25: 70 },
        { label: '20:00', aqi: 135, pm25: 67 }
    ];
    const weeklyData = [
        { label: 'Mon', aqi: 145, pm25: 72 },
        { label: 'Tue', aqi: 132, pm25: 65 },
        { label: 'Wed', aqi: 168, pm25: 85 },
        { label: 'Thu', aqi: 156, pm25: 78 },
        { label: 'Fri', aqi: 142, pm25: 70 },
        { label: 'Sat', aqi: 125, pm25: 62 },
        { label: 'Sun', aqi: 138, pm25: 68 }
    ];
    const monthlyData = [
        { label: 'Week 1', aqi: 145, pm25: 72 },
        { label: 'Week 2', aqi: 132, pm25: 65 },
        { label: 'Week 3', aqi: 168, pm25: 85 },
        { label: 'Week 4', aqi: 156, pm25: 78 }
    ];

    // Load notifications and connectivity state on mount
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('notifications') || '{"items":[],"unread":0}');
        if (saved.items) {
            setNotifications(saved.items);
            setUnreadCount(saved.unread || 0);
        }
        
        // Load Bluetooth and WiFi state from localStorage
        const savedConnectivity = JSON.parse(localStorage.getItem('connectivity') || '{"bluetooth":false,"wifi":false}');
        setIsBluetoothOn(savedConnectivity.bluetooth || false);
        setIsWifiOn(savedConnectivity.wifi || false);
    }, []);

    // Simulation interval
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAQI((prev) => {
                const newAQI = isPurifierOn 
                    ? Math.max(50, prev - Math.random() * 3)
                    : Math.min(200, prev + Math.random() * 2);
                
                if (prevAQIRef.current <= 150 && newAQI > 150) {
                    addNotification('AQI spiked to ' + Math.round(newAQI) + ' — consider turning on purifier');
                }
                prevAQIRef.current = newAQI;
                return newAQI;
            });
            setPm25((prev) => isPurifierOn 
                ? Math.max(20, prev - Math.random() * 2)
                : Math.min(150, prev + Math.random() * 1.5)
            );
            setTemperature(27 + Math.random() * 3);
            setHumidity(60 + Math.random() * 10);
        }, 3000);

        return () => clearInterval(interval);
    }, [isPurifierOn]);

    const addNotification = (text) => {
        const now = Date.now();
        if (lastNotificationRef.current.text === text && now - lastNotificationRef.current.time < 2000) return;
        lastNotificationRef.current = { text, time: now };
        
        const newNotif = { text, time: new Date().toLocaleTimeString() };
        setNotifications((prev) => {
            const updated = [...prev, newNotif];
            let newUnreadCount = unreadCount;
            if (!showNotifPanel) {
                newUnreadCount++;
            }
            setUnreadCount(newUnreadCount);
            localStorage.setItem('notifications', JSON.stringify({ items: updated, unread: newUnreadCount }));
            return updated;
        });
    };

    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
        setShowNotifPanel(false);
        localStorage.setItem('notifications', JSON.stringify({ items: [], unread: 0 }));
    };

    const toggleNotifPanel = () => {
        setShowNotifPanel((prev) => {
            if (!prev) { // If panel is opening
                setUnreadCount(0);
                localStorage.setItem('notifications', JSON.stringify({ items: notifications, unread: 0 }));
            }
            return !prev;
        });
    };

    const handlePowerToggle = () => {
        if (powerToggleProcessingRef.current) return;
        if (!isPurifierOn && !isBluetoothOn && !isWifiOn) {
            addNotification('Enable Bluetooth or WiFi before turning ON the purifier');
            return;
        }
        powerToggleProcessingRef.current = true;
        setIsPurifierOn((prev) => {
            addNotification('Purifier turned ' + (!prev ? 'ON' : 'OFF'));
            setTimeout(() => { powerToggleProcessingRef.current = false; }, 300);
            return !prev;
        });
    };

    useEffect(() => {
        if (!isBluetoothOn && !isWifiOn && isPurifierOn) {
            setIsPurifierOn(false);
            addNotification('Both Bluetooth and WiFi are OFF — turning purifier OFF');
        }
    }, [isBluetoothOn, isWifiOn, isPurifierOn]);

    const handleBluetoothToggle = () => {
        setIsBluetoothOn((prev) => {
            const newState = !prev;
            if (newState) {
                setIsWifiOn(false);
                addNotification('Bluetooth turned ON - WiFi turned OFF');
                localStorage.setItem('connectivity', JSON.stringify({ bluetooth: true, wifi: false }));
            } else {
                addNotification('Bluetooth turned OFF');
                localStorage.setItem('connectivity', JSON.stringify({ bluetooth: false, wifi: isWifiOn }));
            }
            return newState;
        });
    };

    const handleWifiToggle = () => {
        setIsWifiOn((prev) => {
            const newState = !prev;
            if (newState) {
                setIsBluetoothOn(false);
                addNotification('WiFi turned ON - Bluetooth turned OFF');
                localStorage.setItem('connectivity', JSON.stringify({ bluetooth: false, wifi: true }));
            } else {
                addNotification('WiFi turned OFF');
                localStorage.setItem('connectivity', JSON.stringify({ bluetooth: isBluetoothOn, wifi: false }));
            }
            return newState;
        });
    };

    const getChartData = () => {
        return getChartDataset(range, { 
            dailyData, 
            weeklyData, 
            monthlyData, 
            currentAQI, 
            startDate, 
            endDate 
        });
    };

    return (
        <div className="min-h-screen">
            <Header
                user={user}
                onLogout={onLogout}
                theme={theme}
                onThemeToggle={onThemeToggle}
                notifications={notifications}
                unreadCount={unreadCount}
                showNotifPanel={showNotifPanel}
                onToggleNotifPanel={toggleNotifPanel}
                onClearNotifications={clearNotifications}
                isPurifierOn={isPurifierOn}
                openInstructions={openInstructions}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Main AQI Display */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <DeviceControl
                        isPurifierOn={isPurifierOn}
                        onPowerToggle={handlePowerToggle}
                        isBluetoothOn={isBluetoothOn}
                        onBluetoothToggle={handleBluetoothToggle}
                        isWifiOn={isWifiOn}
                        onWifiToggle={handleWifiToggle}
                    />
                    <AQICard
                        currentAQI={currentAQI}
                        isPurifierOn={isPurifierOn}
                        temperature={temperature}
                        humidity={humidity}
                        pm25={pm25}
                        filterLife={filterLife}
                        energyUsed={energyUsed}
                    />
                </div>

                {/* Charts */}
                <ChartSection
                    range={range}
                    setRange={setRange}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    getChartData={getChartData}
                    theme={theme}
                    currentAQI={currentAQI}
                />
            </div>
        </div>
    );
}

export default Dashboard;
