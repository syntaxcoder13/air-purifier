import { useState, useEffect, useRef } from 'react';
import Header from './Header';
import AQICard from './AQICard';
import DeviceControl from './DeviceControl';
import ChartSection from './ChartSection';
import { getChartDataset } from '../utils/chartData';

function Dashboard({ userName, onLogout, theme, onThemeToggle, instructionsAccepted, onOpenInstructions }) {
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
    const notificationProcessingRef = useRef(false);
    const unreadCountRef = useRef(0);
    const showNotifPanelRef = useRef(false);
    const powerToggleProcessingRef = useRef(false);
    const processedNotificationIdsRef = useRef(new Set());

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
            // Mark all existing notifications as processed
            saved.items.forEach(item => {
                if (item.id) {
                    processedNotificationIdsRef.current.add(item.id);
                }
            });
            const savedCount = saved.unread || 0;
            setUnreadCount(savedCount);
            unreadCountRef.current = savedCount;
        }
        showNotifPanelRef.current = showNotifPanel;
        
        // Load Bluetooth and WiFi state from localStorage
        const savedConnectivity = JSON.parse(localStorage.getItem('connectivity') || '{"bluetooth":false,"wifi":false}');
        setIsBluetoothOn(savedConnectivity.bluetooth || false);
        setIsWifiOn(savedConnectivity.wifi || false);
    }, []);
    
    // Sync showNotifPanel ref when state changes
    useEffect(() => {
        showNotifPanelRef.current = showNotifPanel;
    }, [showNotifPanel]);

    // Simulation interval
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAQI((prev) => {
                const newAQI = isPurifierOn 
                    ? Math.max(50, prev - Math.random() * 3)
                    : Math.min(200, prev + Math.random() * 2);
                
                // Notify when AQI crosses into high range
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
        const notificationId = `${text}-${now}`;
        
        // Prevent duplicate notifications within 2 seconds
        if (
            lastNotificationRef.current.text === text &&
            now - lastNotificationRef.current.time < 2000
        ) {
            return;
        }
        
        // Check if this notification ID has already been processed
        if (processedNotificationIdsRef.current.has(notificationId)) {
            return;
        }
        
        // Mark as processing
        processedNotificationIdsRef.current.add(notificationId);
        lastNotificationRef.current = { text, time: now };
        
        const timeString = new Date().toLocaleTimeString();
        const newNotif = { text, time: timeString, id: notificationId };
        
        // Update notifications
        setNotifications((prevNotifications) => {
            // Double check - if notification already exists, don't add
            const exists = prevNotifications.some(n => n.id === notificationId);
            if (exists) {
                processedNotificationIdsRef.current.delete(notificationId);
                return prevNotifications;
            }
            
            const updated = [...prevNotifications, newNotif];
            
            // Only increment count if panel is closed (user hasn't seen it yet)
            let newUnreadCount = unreadCountRef.current;
            if (!showNotifPanelRef.current) {
                // Panel is closed, increment by 1 (not from array length to avoid issues)
                newUnreadCount = unreadCountRef.current + 1;
            }
            // If panel is open, don't increment (user is reading)
            
            unreadCountRef.current = newUnreadCount;
            setUnreadCount(newUnreadCount);
            
            // Save to localStorage
            localStorage.setItem('notifications', JSON.stringify({ 
                items: updated, 
                unread: newUnreadCount 
            }));
            
            // Clean up processed IDs after 5 seconds to prevent memory leak
            setTimeout(() => {
                processedNotificationIdsRef.current.delete(notificationId);
            }, 5000);
            
            return updated;
        });
    };

    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
        unreadCountRef.current = 0;
        setShowNotifPanel(false);
        localStorage.setItem('notifications', JSON.stringify({ items: [], unread: 0 }));
    };

    const toggleNotifPanel = () => {
        setShowNotifPanel((prev) => {
            const newValue = !prev;
            showNotifPanelRef.current = newValue;
            
            if (newValue) {
                // Panel is opening, reset unread count
                setUnreadCount(0);
                unreadCountRef.current = 0;
                localStorage.setItem('notifications', JSON.stringify({ items: notifications, unread: 0 }));
            }
            return newValue;
        });
    };

    const handlePowerToggle = () => {
        // Prevent double processing
        if (powerToggleProcessingRef.current) {
            return;
        }
        // If trying to turn ON while both connectivity are OFF, block and notify
        if (!isPurifierOn && !isBluetoothOn && !isWifiOn) {
            addNotification('Enable Bluetooth or WiFi before turning ON the purifier');
            return;
        }

        powerToggleProcessingRef.current = true;

        setIsPurifierOn((prev) => {
            const newState = !prev;
            const notificationText = 'Purifier turned ' + (newState ? 'ON' : 'OFF');

            // Add notification immediately with unique timestamp
            const notificationId = `${notificationText}-${Date.now()}`;
            addNotification(notificationText);

            // Reset flag after a delay
            setTimeout(() => {
                powerToggleProcessingRef.current = false;
            }, 300);

            return newState;
        });
    };

    // If both Bluetooth and WiFi are OFF, ensure purifier is OFF as well
    useEffect(() => {
        if (!isBluetoothOn && !isWifiOn && isPurifierOn) {
            setIsPurifierOn(false);
            addNotification('Both Bluetooth and WiFi are OFF — turning purifier OFF');
        }
    }, [isBluetoothOn, isWifiOn, isPurifierOn]);

    const handleBluetoothToggle = () => {
        setIsBluetoothOn((prevBluetooth) => {
            const newBluetoothState = !prevBluetooth;
            setIsWifiOn((prevWifi) => {
                const newWifiState = newBluetoothState ? false : prevWifi;
                
                if (newBluetoothState) {
                    // If Bluetooth is turning ON, turn WiFi OFF
                    addNotification('Bluetooth turned ON - WiFi turned OFF');
                } else {
                    addNotification('Bluetooth turned OFF');
                }
                
                // Save to localStorage
                localStorage.setItem('connectivity', JSON.stringify({ 
                    bluetooth: newBluetoothState, 
                    wifi: newWifiState 
                }));
                
                return newWifiState;
            });
            return newBluetoothState;
        });
    };

    const handleWifiToggle = () => {
        setIsWifiOn((prevWifi) => {
            const newWifiState = !prevWifi;
            setIsBluetoothOn((prevBluetooth) => {
                const newBluetoothState = newWifiState ? false : prevBluetooth;
                
                if (newWifiState) {
                    // If WiFi is turning ON, turn Bluetooth OFF
                    addNotification('WiFi turned ON - Bluetooth turned OFF');
                } else {
                    addNotification('WiFi turned OFF');
                }
                
                // Save to localStorage
                localStorage.setItem('connectivity', JSON.stringify({ 
                    bluetooth: newBluetoothState, 
                    wifi: newWifiState 
                }));
                
                return newBluetoothState;
            });
            return newWifiState;
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
                userName={userName}
                onLogout={onLogout}
                theme={theme}
                onThemeToggle={onThemeToggle}
                notifications={notifications}
                unreadCount={unreadCount}
                showNotifPanel={showNotifPanel}
                onToggleNotifPanel={toggleNotifPanel}
                onClearNotifications={clearNotifications}
                isPurifierOn={isPurifierOn}
                instructionsAccepted={instructionsAccepted}
                onOpenInstructions={onOpenInstructions}
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

