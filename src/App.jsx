import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import InstructionsModal from './components/InstructionsModal';
import NameEntryScreen from './components/NameEntryScreen';
import { loadTheme, saveTheme, saveInstructionsAccepted, loadInstructionsAccepted } from './utils/storage';

function App() {
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('dark');
    const [showInstructions, setShowInstructions] = useState(false);
    const [modalReadOnly, setModalReadOnly] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for a saved user in localStorage
        const savedUser = localStorage.getItem('smart-air-purifier-user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            const instructionsAccepted = loadInstructionsAccepted();
            if (!instructionsAccepted) {
                setShowInstructions(true);
                setModalReadOnly(false);
            }
        }
        setLoading(false);

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

    const handleThemeToggle = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        saveTheme(newTheme);
        applyTheme(newTheme);
    };

    const handleAcceptInstructions = () => {
        saveInstructionsAccepted(true);
        setShowInstructions(false);
    };

    const handleLogin = (name) => {
        const newUser = { name };
        setUser(newUser);
        localStorage.setItem('smart-air-purifier-user', JSON.stringify(newUser));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('smart-air-purifier-user');
        // Optional: also clear instructions acceptance on logout
    };

    const openInstructions = (readOnly = true) => {
        setModalReadOnly(readOnly);
        setShowInstructions(true);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={`min-h-screen antialiased transition-colors duration-300 ${
            theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100' 
                : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-800'
        }`}>
            {!user ? (
                <NameEntryScreen onLogin={handleLogin} />
            ) : (
                <Dashboard 
                    user={user}
                    onLogout={handleLogout}
                    theme={theme}
                    onThemeToggle={handleThemeToggle}
                    openInstructions={openInstructions}
                />
            )}
            {showInstructions && (
                <InstructionsModal 
                    showInstructions={showInstructions}
                    onClose={() => setShowInstructions(false)}
                    readOnly={modalReadOnly}
                    theme={theme}
                />
            )}
        </div>
    );
}

export default App;
