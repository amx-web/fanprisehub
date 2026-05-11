import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Users, Trophy, BarChart3, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import { subscribeToEntries } from '../../firebase/entries';
import { useGiveawayStore } from '../../store/giveawayStore';

const STATUS_COLORS = {
    pending:  'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    approved: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    rejected: 'text-red-400 bg-red-400/10 border-red-400/20',
    submitted:'text-blue-400 bg-blue-400/10 border-blue-400/20',
};

function StatCard({ label, value, icon: Icon, gradient, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -4 }}
            className={`relative overflow-hidden rounded-2xl p-px ${gradient}`}
        >
            <div className="bg-[#0d0d18] rounded-2xl p-6 h-full">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient.replace('from-', 'from-').split(' ').join(' ')} opacity-20`}>
                    </div>
                    <Icon className="w-6 h-6 text-white/40 absolute top-5 right-5" />
                </div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-1">{label}</p>
                <p className="text-4xl font-black text-white">{value}</p>
            </div>
        </motion.div>
    );
}

export function AdminDashboard() {
    const navigate = useNavigate();
    const { giveaways, winners } = useGiveawayStore();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = subscribeToEntries((data) => {
            setEntries(data);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const pending  = entries.filter(e => e.status === 'pending' || e.status === 'submitted').length;
    const approved = entries.filter(e => e.status === 'approved').length;
    const rejected = entries.filter(e => e.status === 'rejected').length;

    const stats = [
        { label: 'Total Applicants', value: entries.length, icon: Users,      gradient: 'from-purple-600 to-purple-400',  delay: 0    },
        { label: 'Pending Review',   value: pending,         icon: Clock,      gradient: 'from-yellow-600 to-yellow-400',  delay: 0.05 },
        { label: 'Approved',         value: approved,        icon: TrendingUp, gradient: 'from-emerald-600 to-emerald-400',delay: 0.1  },
        { label: 'Active Giveaways', value: giveaways.length,icon: BarChart3,  gradient: 'from-pink-600 to-pink-400',      delay: 0.15 },
    ];

    const recent = entries.slice(0, 5);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-black text-white">Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back — here's what's happening with your giveaway.</p>
            </motion.div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <StatCard key={s.label} {...s} />
                ))}
            </div>

            {/* Recent Applicants */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#0d0d18] border border-purple-500/10 rounded-2xl overflow-hidden"
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-purple-500/10">
                    <div>
                        <h2 className="text-lg font-bold text-white">Recent Applicants</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Latest giveaway submissions</p>
                    </div>
                    <motion.button
                        whileHover={{ x: 3 }}
                        onClick={() => navigate('/admin/applicants')}
                        className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 font-semibold transition"
                    >
                        View all <ArrowRight className="w-4 h-4" />
                    </motion.button>
                </div>

                {loading ? (
                    <div className="px-6 py-10 text-center text-gray-500 text-sm">Loading…</div>
                ) : recent.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                        <Users className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No applicants yet. Share your giveaway link!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-purple-500/5">
                        {recent.map((e, i) => (
                            <motion.div
                                key={e.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors"
                            >
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    {(e.fullName || '?')[0].toUpperCase()}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold text-sm truncate">{e.fullName || '—'}</p>
                                    <p className="text-gray-500 text-xs truncate">{e.email || '—'}</p>
                                </div>

                                <div className="text-right flex-shrink-0">
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[e.status] || STATUS_COLORS.pending}`}>
                                        {e.status || 'pending'}
                                    </span>
                                    <p className="text-gray-600 text-xs mt-1">
                                        {e.createdAt?.toDate ? e.createdAt.toDate().toLocaleDateString() : '—'}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Winners Quick View */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#0d0d18] border border-purple-500/10 rounded-2xl overflow-hidden"
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-purple-500/10">
                    <div>
                        <h2 className="text-lg font-bold text-white">Recent Winners</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Past giveaway winners</p>
                    </div>
                    <Trophy className="w-5 h-5 text-yellow-400" />
                </div>

                {winners.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                        <Trophy className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No winners yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-purple-500/5">
                        {winners.slice(0, 5).map((w, i) => (
                            <div key={w.id || i} className="flex items-center gap-4 px-6 py-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    {(w.name || '?')[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold text-sm">{w.name}</p>
                                    <p className="text-gray-500 text-xs">{w.giveawayTitle}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-yellow-400 font-black text-sm">{w.prize}</p>
                                    <p className="text-gray-600 text-xs">{new Date(w.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
