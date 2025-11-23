import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import InstructionsModal from './components/InstructionsModal';
import ResetPasswordScreen from './components/ResetPasswordScreen';
import { loadTheme, saveTheme, saveInstructionsAccepted, loadInstructionsAccepted } from './utils/storage';

function App() {
    const [session, setSession] = useState(null);
    const [theme, setTheme] = useState('dark');
    const [showInstructions, setShowInstructions] = useState(false);
    const [modalReadOnly, setModalReadOnly] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isResetPassword, setIsResetPassword] = useState(false);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
            if (session) {
                const instructionsAccepted = loadInstructionsAccepted();
                if (!instructionsAccepted) {
                    setShowInstructions(true);
                    setModalReadOnly(false);
                }
            }
        });

        // Load theme
        const savedTheme = loadTheme();
        setTheme(savedTheme);
        applyTheme(savedTheme);

        // Check for password reset token
        const hash = window.location.hash;
        if (hash.includes('access_token=')) {
            setIsResetPassword(true);
        }


        return () => subscription.unsubscribe();
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



    const openInstructions = (readOnly = true) => {
        setModalReadOnly(readOnly);
        setShowInstructions(true);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (isResetPassword) {
        return <ResetPasswordScreen theme={theme} />;
    }

    return (
        <div className={`min-h-screen antialiased transition-colors duration-300 ${
            theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100' 
                : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-800'
        }`}>
            {(!session || !session.user) ? (
                <AuthScreen theme={theme} />
            ) : (
                <Dashboard 
                    theme={theme}
                    handleThemeToggle={handleThemeToggle}
                    openInstructions={openInstructions}
                    session={session} 
                    supabase={supabase}
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
