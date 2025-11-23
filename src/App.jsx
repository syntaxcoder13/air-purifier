import { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import InstructionsModal from './components/InstructionsModal';
import { loadAuth, saveAuth, loadTheme, saveTheme, saveInstructionsAcceptedSession, loadInstructionsAcceptedSession } from './utils/storage';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        // Load auth state
        const auth = loadAuth();
        if (auth && auth.isLoggedIn) {
            setIsLoggedIn(true);
            setUserName(auth.userName);
        }

        // Restore session-scoped acceptance so the info icon remains across refreshes
        const sessionAccepted = loadInstructionsAcceptedSession();
        setInstructionsAccepted(!!sessionAccepted);
        // Load theme
        const savedTheme = loadTheme();
        setTheme(savedTheme);
        applyTheme(savedTheme);
    }, []);

    const applyTheme = (newTheme) => {
        if (newTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };

    const handleLogin = (name) => {
        setIsLoggedIn(true);
        setUserName(name);
        saveAuth(true, name);
        // For now show instructions modal every time after login (session-only)
        // Keep session acceptance separate so the info icon persists across refresh
        setInstructionsAccepted((prev) => prev);
        setShowInstructionsModal(true);
        setModalReadOnly(false);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserName('');
        saveAuth(false, '');
    };

    const handleThemeToggle = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        saveTheme(newTheme);
        applyTheme(newTheme);
    };

    const [instructionsAccepted, setInstructionsAccepted] = useState(false);
    const [showInstructionsModal, setShowInstructionsModal] = useState(false);
    const [modalReadOnly, setModalReadOnly] = useState(false);

    const handleAcceptInstructions = () => {
        // Persist acceptance for this browser tab/session only so the info icon survives refresh
        saveInstructionsAcceptedSession(true);
        setInstructionsAccepted(true);
        setShowInstructionsModal(false);
    };

    const openInstructions = (readOnly = true) => {
        setModalReadOnly(readOnly);
        setShowInstructionsModal(true);
    };

    return (
        <div className={`min-h-screen antialiased transition-colors duration-300 ${
            theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100' 
                : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-800'
        }`}>
            {isLoggedIn ? (
                <>
                    <Dashboard
                        userName={userName}
                        onLogout={handleLogout}
                        theme={theme}
                        onThemeToggle={handleThemeToggle}
                        instructionsAccepted={instructionsAccepted}
                        onOpenInstructions={openInstructions}
                    />
                    <InstructionsModal
                        isOpen={showInstructionsModal}
                        readOnly={modalReadOnly}
                        onAccept={handleAcceptInstructions}
                        onClose={() => setShowInstructionsModal(false)}
                        theme={theme}
                    />
                </>
            ) : (
                <AuthScreen onLogin={handleLogin} theme={theme} />
            )}
        </div>
    );
}

export default App;

