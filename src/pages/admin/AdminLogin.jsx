import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_CODE = import.meta.env.VITE_ADMIN_CODE;
console.log('Admin code from env:', import.meta.env.VITE_ADMIN_CODE);

export function AdminLogin() {
    const navigate = useNavigate();

    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (String(code) === String(ADMIN_CODE)) {
                localStorage.setItem('isAdmin', 'true');
                navigate('/admin', { replace: true });
            } else {
                setError('Invalid admin code');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl bg-[#0d0d18] border border-purple-500/10 p-6">
                <h1 className="text-2xl font-black text-white">Admin Login</h1>
                <p className="text-sm text-gray-500 mt-2">Enter the admin secret code.</p>

                {error ? (
                    <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-200 text-sm">
                        {error}
                    </div>
                ) : null}

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Admin code</label>
                        <input
                            type="password"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/15 rounded-xl text-white text-sm focus:border-purple-500/40 focus:outline-none transition"
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

