import { useState } from 'react';

function NameEntryScreen({ onLogin }) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setMessage('Please enter your name.');
            return;
        }
        setLoading(true);
        // Simulate a quick delay
        setTimeout(() => {
            onLogin(name.trim());
        }, 300);
    };

    return (
        <div
            id="nameEntryScreen"
            className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center p-4 relative"
        >
            <div className="absolute inset-0 bg-black opacity-20"></div>

            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-white p-4 rounded-2xl shadow-lg">
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
                    <p className="text-blue-100 text-sm">Welcome! Please enter your name to continue.</p>
                </div>

                <div className="p-8">
                    {message && <p className="text-center text-red-500 mb-4">{message}</p>}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Continuing...' : 'Continue to Dashboard'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default NameEntryScreen;