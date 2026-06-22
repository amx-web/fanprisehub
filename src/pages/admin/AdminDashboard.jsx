import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Users, Trophy, BarChart3, TrendingUp, ArrowRight, Clock, Trash2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseClient';



import { subscribeToEntries } from '../../firebase/entries';
import { subscribeToGiveaways, updateGiveaway, deleteGiveaway } from '../../firebase/giveaways';
import { subscribeToWinners, addWinner } from '../../firebase/winners';

import { useGiveawayStore } from '../../store/giveawayStore';

const STATUS_COLORS = {
    pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    approved: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    rejected: 'text-red-400 bg-red-400/10 border-red-400/20',
    submitted: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
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
            <div className="bg-[#0d0d18] rounded-2xl p-4 sm:p-6 h-full">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} opacity-20`}
                    ></div>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white/40 absolute top-4 right-4 sm:top-5 sm:right-5" />
                </div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-1">{label}</p>
                <p className="text-2xl sm:text-4xl font-black text-white">{value}</p>
            </div>
        </motion.div>
    );
}

function formatDateLike(ts) {
    if (!ts) return '—';
    if (ts.toDate) return ts.toDate().toLocaleDateString();
    return new Date(ts).toLocaleDateString();
}

export function AdminDashboard() {
    const navigate = useNavigate();
    const { giveaways, winners, setGiveaways, setWinners } = useGiveawayStore();
    const [entries, setEntries] = useState([]);
    const [loadingEntries, setLoadingEntries] = useState(true);
    const [subscriptionError, setSubscriptionError] = useState('');
    const [deletingId, setDeletingId] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState('');
    const [adminDeleteError, setAdminDeleteError] = useState('');


    useEffect(() => {
        const loadWhatsapp = async () => {
            try {
                const snap = await getDoc(doc(db, 'config', 'settings'));
                if (snap.exists() && snap.data().whatsappNumber) {
                    setWhatsappNumber(snap.data().whatsappNumber);
                }
            } catch (e) {
                console.warn('Failed to load WhatsApp number:', e);
            }
        };
        loadWhatsapp();

        let unsubEntries = null;
        let unsubGiveaways = null;
        let unsubWinners = null;


        try {
            unsubEntries = subscribeToEntries((data) => {
                setEntries(data);
                setLoadingEntries(false);
            });
            unsubGiveaways = subscribeToGiveaways((data) => { setGiveaways(data); });
            unsubWinners = subscribeToWinners((data) => { setWinners(data); });
        } catch (e) {
            console.error('[AdminDashboard] Subscription setup failed:', e);
            setSubscriptionError('Failed to load admin dashboard data. Please refresh and try again.');
            setLoadingEntries(false);
        }

        return () => {
            try {
                if (unsubEntries) unsubEntries();
                if (unsubGiveaways) unsubGiveaways();
                if (unsubWinners) unsubWinners();
            } catch (e) {
                console.warn('[AdminDashboard] Error while unsubscribing:', e);
            }
        };
    }, [setGiveaways, setWinners]);

    const pending = useMemo(
        () => entries.filter((e) => e.status === 'pending' || e.status === 'submitted').length,
        [entries]
    );
    const approved = useMemo(() => entries.filter((e) => e.status === 'approved').length, [entries]);

    const stats = useMemo(
        () => [
            { label: 'Total Applicants', value: entries.length, icon: Users, gradient: 'from-purple-600 to-purple-400', delay: 0 },
            { label: 'Pending Review', value: pending, icon: Clock, gradient: 'from-yellow-600 to-yellow-400', delay: 0.05 },
            { label: 'Approved', value: approved, icon: TrendingUp, gradient: 'from-emerald-600 to-emerald-400', delay: 0.1 },
            { label: 'Active Giveaways', value: giveaways.filter(g => g.isActive).length, icon: BarChart3, gradient: 'from-pink-600 to-pink-400', delay: 0.15 },
        ],
        [entries.length, pending, approved, giveaways]
    );

    const recent = entries.slice(0, 5);

    const [selectedGiveawayId, setSelectedGiveawayId] = useState('');
    useEffect(() => {
        if (!selectedGiveawayId && giveaways[0]?.id) setSelectedGiveawayId(giveaways[0].id);
    }, [selectedGiveawayId, giveaways]);

    const selectedGiveaway = useMemo(() => {
        return giveaways.find((g) => String(g.id) === String(selectedGiveawayId));
    }, [giveaways, selectedGiveawayId]);

    const [prizeAmount, setPrizeAmount] = useState(20000);
    const [currency, setCurrency] = useState('€');
    const [endDateValue, setEndDateValue] = useState('');

    useEffect(() => {
        if (!selectedGiveaway) return;
        setPrizeAmount(selectedGiveaway.prizeAmount ?? 20000);
        setCurrency(selectedGiveaway.currency ?? '€');
        const iso = selectedGiveaway?.endDate?.toDate
            ? selectedGiveaway.endDate.toDate().toISOString().slice(0, 16)
            : selectedGiveaway?.endDate instanceof Date
                ? selectedGiveaway.endDate.toISOString().slice(0, 16)
                : '';
        setEndDateValue(iso);
    }, [selectedGiveaway]);

    const [addingWinnerName, setAddingWinnerName] = useState('');
    const [addingWinnerPrize, setAddingWinnerPrize] = useState('');
    const [savingWinner, setSavingWinner] = useState(false);
    const [savingGiveaway, setSavingGiveaway] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [savingWhatsapp, setSavingWhatsapp] = useState(false);
    const [whatsappSaved, setWhatsappSaved] = useState(false);


    const handleDeleteGiveaway = async (id) => {
        if (confirmDeleteId !== id) {
            setConfirmDeleteId(id);
            setAdminDeleteError('');
            return;
        }
        setDeletingId(id);
        setAdminDeleteError('');

        try {
            await deleteGiveaway(id);
            setConfirmDeleteId('');
            if (selectedGiveawayId === id) setSelectedGiveawayId('');
        } catch (e) {
            console.error('Failed to delete giveaway:', e);
            const msg = e?.message
                ? `Failed to delete giveaway: ${e.message}`
                : 'Failed to delete giveaway. Please try again.';
            setAdminDeleteError(msg);
        } finally {
            setDeletingId('');
        }
    };


    return (
        <div className="w-full max-w-6xl mx-auto space-y-5 sm:space-y-8 px-2 sm:px-0">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Overview</h1>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">Welcome back — here's what's happening.</p>
            </motion.div>

            {/* Stat Cards */}
            {subscriptionError ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-300 text-sm">
                    {subscriptionError}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {stats.map((s) => (
                        <StatCard key={s.label} {...s} />
                    ))}
                </div>
            )}

            {/* Recent Applicants */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#0d0d18] border border-purple-500/10 rounded-2xl overflow-hidden"
            >
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-purple-500/10">
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-white">Recent Applicants</h2>
                        <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">Latest giveaway submissions</p>
                    </div>
                    <motion.button
                        whileHover={{ x: 3 }}
                        onClick={() => navigate('/admin/applicants')}
                        className="flex items-center gap-1.5 text-xs sm:text-sm text-purple-400 hover:text-purple-300 font-semibold transition"
                    >
                        View all <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </motion.button>
                </div>

                {loadingEntries ? (
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
                                className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 hover:bg-white/[0.02] transition-colors"
                            >
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                                    {(e.fullName || '?')[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold text-xs sm:text-sm truncate">{e.fullName || '—'}</p>
                                    <p className="text-gray-500 text-xs truncate">{e.email || '—'}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[e.status] || STATUS_COLORS.pending}`}>
                                        {e.status || 'pending'}
                                    </span>
                                    <p className="text-gray-600 text-xs mt-1 hidden sm:block">{formatDateLike(e.createdAt)}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Active Giveaways List with Delete */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="bg-[#0d0d18] border border-purple-500/10 rounded-2xl overflow-hidden"
            >
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-purple-500/10">
                    <h2 className="text-base sm:text-lg font-bold text-white">Active Giveaways</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Manage or delete active giveaways</p>
                </div>

                {adminDeleteError ? (
                    <div className="mx-4 sm:mx-6 my-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl px-4 py-3 text-sm">
                        {adminDeleteError}
                    </div>
                ) : null}


                {giveaways.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                        <p className="text-gray-500 text-sm">No active giveaways.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-purple-500/5">
                        {giveaways.map((g) => (
                            <div key={g.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-white/[0.02] transition-colors">
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold text-sm truncate">{g.title || 'Untitled Giveaway'}</p>
                                    <p className="text-gray-500 text-xs mt-0.5">
                                        {g.currency}{g.prizeAmount?.toLocaleString()} · {g.participants || 0} participants
                                    </p>
                                    <p className="text-gray-600 text-xs mt-1">Ends {formatDateLike(g.endDate)}</p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={deletingId === g.id}
                                    onClick={() => handleDeleteGiveaway(g.id)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${confirmDeleteId === g.id
                                        ? 'bg-red-500 text-white'
                                        : 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    {deletingId === g.id
                                        ? 'Deleting...'
                                        : confirmDeleteId === g.id
                                            ? 'Confirm Delete'
                                            : 'Delete'}
                                </motion.button>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Giveaway Editor + Add Winner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-[#0d0d18] border border-purple-500/10 rounded-2xl overflow-hidden"
            >
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-purple-500/10">
                    <h2 className="text-base sm:text-lg font-bold text-white">Active Giveaway Manager</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Edit prize + timer and manually add winners</p>
                </div>

                <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                    <div className="space-y-3">
                        <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">Active giveaway</label>
                        <select
                            value={selectedGiveawayId}
                            onChange={(e) => setSelectedGiveawayId(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0d0d18] border border-purple-500/15 rounded-xl text-white text-sm focus:border-purple-500/40 focus:outline-none transition"
                        >
                            {giveaways.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.title || 'Giveaway'} ({g.currency}{g.prizeAmount})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Currency</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full px-4 py-3 bg-[#0d0d18] border border-purple-500/15 rounded-xl text-white text-sm focus:border-purple-500/40 focus:outline-none transition"
                            >
                                <option value="€">€</option>
                                <option value="$">$</option>
                                <option value="£">£</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Prize amount</label>
                            <input
                                type="number"
                                value={prizeAmount}
                                onChange={(e) => setPrizeAmount(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
                                className="w-full px-4 py-3 bg-[#0d0d18] border border-purple-500/15 rounded-xl text-white text-sm focus:border-purple-500/40 focus:outline-none transition"
                                placeholder="20000"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Timer end date</label>
                            <input
                                type="datetime-local"
                                value={endDateValue}
                                onChange={(e) => setEndDateValue(e.target.value)}
                                className="w-full px-4 py-3 bg-[#0d0d18] border border-purple-500/15 rounded-xl text-white text-sm focus:border-purple-500/40 focus:outline-none transition"
                            />
                        </div>
                        <div className="flex items-end">
                            <motion.button
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={!selectedGiveawayId || savingGiveaway}
                                onClick={async () => {
                                    if (!selectedGiveawayId) return;
                                    setSavingGiveaway(true);
                                    try {
                                        const endDate = endDateValue ? new Date(endDateValue) : null;
                                        await updateGiveaway(selectedGiveawayId, {
                                            prizeAmount: Number(prizeAmount),
                                            currency,
                                            ...(endDate ? { endDate } : {}),
                                        });
                                    } finally {
                                        setSavingGiveaway(false);
                                    }
                                }}
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                            >
                                {savingGiveaway ? 'Saving...' : 'Save Giveaway'}
                            </motion.button>
                        </div>
                    </div>

                    {/* Add Winner */}
                    <div className="border-t border-purple-500/10 pt-5 sm:pt-6">
                        <h3 className="text-sm font-bold text-white mb-4">Add Winner Manually</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Winner name</label>
                                <input
                                    type="text"
                                    value={addingWinnerName}
                                    onChange={(e) => setAddingWinnerName(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#0d0d18] border border-purple-500/15 rounded-xl text-white text-sm focus:border-purple-500/40 focus:outline-none transition"
                                    placeholder="e.g., Alex Johnson"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Prize (optional)</label>
                                <input
                                    type="text"
                                    value={addingWinnerPrize}
                                    onChange={(e) => setAddingWinnerPrize(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#0d0d18] border border-purple-500/15 rounded-xl text-white text-sm focus:border-purple-500/40 focus:outline-none transition"
                                    placeholder={`${currency}${selectedGiveaway?.prizeAmount ?? 20000}`}
                                />
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={!selectedGiveawayId || savingWinner || !addingWinnerName.trim()}
                            onClick={async () => {
                                if (!selectedGiveawayId || !addingWinnerName.trim()) return;
                                setSavingWinner(true);
                                try {
                                    const prize = addingWinnerPrize.trim()
                                        ? addingWinnerPrize.trim()
                                        : `${currency}${selectedGiveaway?.prizeAmount ?? 20000}`;
                                    await addWinner({
                                        giveawayId: selectedGiveawayId,
                                        name: addingWinnerName.trim(),
                                        prize,
                                        giveawayTitle: selectedGiveaway?.title ?? '',
                                        date: new Date(),
                                    });
                                    setAddingWinnerName('');
                                    setAddingWinnerPrize('');
                                } finally {
                                    setSavingWinner(false);
                                }
                            }}
                            className="w-full mt-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-bold hover:bg-emerald-500/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {savingWinner ? 'Adding...' : 'Add Winner'}
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* WhatsApp Number Manager */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="bg-[#0d0d18] border border-purple-500/10 rounded-2xl overflow-hidden"
            >
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-purple-500/10">
                    <h2 className="text-base sm:text-lg font-bold text-white">WhatsApp Number</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Number that receives giveaway entry messages</p>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">
                            WhatsApp Number (include + and country code)
                        </label>
                        <input
                            type="text"
                            value={whatsappNumber}
                            onChange={(e) => { setWhatsappNumber(e.target.value); setWhatsappSaved(false); }}
                            className="w-full px-4 py-3 bg-[#0d0d18] border border-purple-500/15 rounded-xl text-white text-sm focus:border-purple-500/40 focus:outline-none transition"
                            placeholder="e.g. +2347040329721"
                        />
                    </div>
                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={savingWhatsapp || !whatsappNumber.trim()}
                        onClick={async () => {
                            setSavingWhatsapp(true);
                            try {
                                await setDoc(doc(db, 'config', 'settings'), {
                                    whatsappNumber: whatsappNumber.trim()
                                }, { merge: true });
                                setWhatsappSaved(true);
                            } catch (e) {
                                console.warn('Failed to save WhatsApp number:', e);
                            } finally {
                                setSavingWhatsapp(false);
                            }
                        }}
                        className="w-full py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-bold hover:bg-emerald-500/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {savingWhatsapp ? 'Saving...' : whatsappSaved ? '✅ Saved!' : 'Save WhatsApp Number'}
                    </motion.button>
                </div>
            </motion.div>

            {/* Recent Winners */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#0d0d18] border border-purple-500/10 rounded-2xl overflow-hidden"
            >
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-purple-500/10">
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-white">Recent Winners</h2>
                        <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">Past giveaway winners</p>
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
                            <div key={w.id || i} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                                    {(w.name || '?')[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold text-xs sm:text-sm truncate">{w.name}</p>
                                    <p className="text-gray-500 text-xs truncate">{w.giveawayTitle}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-yellow-400 font-black text-xs sm:text-sm">{w.prize}</p>
                                    <p className="text-gray-600 text-xs hidden sm:block">{formatDateLike(w.date)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}