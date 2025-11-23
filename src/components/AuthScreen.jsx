import { useState } from 'react';
import { supabase } from '../supabaseClient';

function AuthScreen({ theme }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirm: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id.replace('Input', '')]: e.target.value
        });
    };

    const validatePassword = (password) => {
        const hasNumber = /\d/;
        const hasAlphabet = /[a-zA-Z]/;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
        return hasNumber.test(password) && hasAlphabet.test(password) && hasSpecialChar.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const { email, password, confirm } = formData;

        if (isSignUp) {
            if (password !== confirm) {
                setMessage('Passwords do not match!');
                setLoading(false);
                return;
            }
            if (!validatePassword(password)) {
                setMessage('Password must contain at least one number, one alphabet, and one special character.');
                setLoading(false);
                return;
            }
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: formData.name,
                    },
                },
            });
            if (error) {
                setMessage(error.message);
            } else {
                setMessage('Success! Please check your email for a verification link.');
                setEmailSent(true);
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                setMessage(error.message);
            }
            // onLogin will be handled by the listener in App.jsx
        }
        setLoading(false);
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const { email } = formData;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
        });
        if (error) {
            setMessage(error.message);
        } else {
            setMessage('Password reset link sent! Please check your email.');
        }
        setLoading(false);
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    if (emailSent) {
        return (
            <div
                id="authScreen"
                className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center p-4 relative"
            >
                <div className="absolute inset-0 bg-black opacity-20"></div>

                <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Check your email</h1>
                    <p className="text-gray-600">
                        We've sent a verification link to <strong>{formData.email}</strong>. Please check your inbox and follow the link to complete your registration.
                    </p>
                </div>
            </div>
        );
    }

    if (showForgotPassword) {
        return (
            <div
                id="authScreen"
                className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center p-4 relative"
            >
                <div className="absolute inset-0 bg-black opacity-20"></div>

                <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Forgot Password</h1>
                    {message && <p className="text-center text-red-500 mb-4">{message}</p>}
                    <form className="space-y-4" onSubmit={handleForgotPassword}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M3 8l9 6 9-6"
                                            stroke="#9ca3af"
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"
                                            stroke="#9ca3af"
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <input
                                    id="emailInput"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Send Reset Link'}
                        </button>
                    </form>
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            <button
                                onClick={() => setShowForgotPassword(false)}
                                className="text-indigo-600 font-semibold hover:text-indigo-800 ml-1"
                            >
                                Back to Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div
            id="authScreen"
            className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center p-4 relative"
        >
            <div className="absolute inset-0 bg-black opacity-20"></div>

            {/* animated orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl pulse-soft"></div>
                <div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 opacity-8 rounded-full blur-3xl pulse-soft"
                    style={{ animationDelay: '0.6s' }}
                ></div>
            </div>

            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-white p-4 rounded-2xl shadow-lg">
                            {/* Wind Icon */}
                            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" className="text-indigo-600">
                                <path
                                    d="M3 12h13a3 3 0 1 0 0-6 3 3 0 0 0-3 3"
                                    stroke="#4f46e5"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M3 17h9a2 2 0 0 0 0-4 2 2 0 0 0-2 2"
                                    stroke="#4f46e5"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Smart Air Purifier</h1>
                    <p className="text-blue-100 text-sm">Breathe Clean, Live Healthy</p>
                </div>

                <div className="p-8">
                    {/* toggle */}
                    <div className="flex mb-6 bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setIsSignUp(false)}
                            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                                !isSignUp
                                    ? 'bg-white text-indigo-600 shadow-md'
                                    : 'text-gray-600'
                            }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsSignUp(true)}
                            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                                isSignUp
                                    ? 'bg-white text-indigo-600 shadow-md'
                                    : 'text-gray-600'
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {message && <p className="text-center text-red-500 mb-4">{message}</p>}

                    <form id="authForm" className="space-y-4" onSubmit={handleSubmit}>
                        {/* name (signup only) */}
                        {isSignUp && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        {/* user icon */}
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z"
                                                stroke="#9ca3af"
                                                strokeWidth="1.2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        id="nameInput"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M3 8l9 6 9-6"
                                            stroke="#9ca3af"
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"
                                            stroke="#9ca3af"
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <input
                                    id="emailInput"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                {!isSignUp && (
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="text-sm text-indigo-600 hover:text-indigo-800"
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M12 17a2 2 0 0 0 2-2v-2a2 2 0 1 0-4 0v2a2 2 0 0 0 2 2z"
                                            stroke="#9ca3af"
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M5 11V9a7 7 0 1 1 14 0v2"
                                            stroke="#9ca3af"
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <input
                                    id="passwordInput"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePassword}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
                                                stroke="#9ca3af"
                                                strokeWidth="1.2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <circle cx="12" cy="12" r="3" stroke="#9ca3af" strokeWidth="1.2" />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-6 0-10-7-10-7a18.58 18.58 0 0 1 5-5.94"
                                                stroke="#9ca3af"
                                                strokeWidth="1.2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M1 1l22 22"
                                                stroke="#9ca3af"
                                                strokeWidth="1.2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {isSignUp && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M12 17a2 2 0 0 0 2-2v-2a2 2 0 1 0-4 0v2a2 2 0 0 0 2 2z"
                                                stroke="#9ca3af"
                                                strokeWidth="1.2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        id="confirmInput"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.confirm}
                                        onChange={handleInputChange}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            <span>{isSignUp ? "Already have an account?" : "Don't have an account?"}</span>
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-indigo-600 font-semibold hover:text-indigo-800 ml-1"
                            >
                                {isSignUp ? 'Login' : 'Sign Up'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthScreen;

