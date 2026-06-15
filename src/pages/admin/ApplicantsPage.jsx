import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
    Users, Search, Filter, ChevronDown, ChevronUp,
    CheckCircle2, XCircle, Clock, Mail, Globe,
    CreditCard, Music, MessageSquare, Loader2
} from 'lucide-react';
import { subscribeToEntries, updateEntryStatus } from '../../firebase/entries';
import { deleteEntry } from '../../firebase/entriesAdmin';

const STATUS_STYLES = {
    pending: { cls: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', label: 'Pending' },
    submitted: { cls: 'text-blue-400 bg-blue-400/10 border-blue-400/20', label: 'Submitted' },
    approved: { cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', label: 'Approved' },
    rejected: { cls: 'text-red-400 bg-red-400/10 border-red-400/20', label: 'Rejected' },
};

function StatusBadge({ status }) {
    const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${s.cls}`}>
            {status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
            {status === 'rejected' && <XCircle className="w-3 h-3" />}
            {(status === 'pending' || status === 'submitted') && <Clock className="w-3 h-3" />}
            <span className="hidden sm:inline">{s.label}</span>
        </span>
    );
}

function DetailRow({ icon: Icon, label, value }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">{label}</p>
                <p className="text-white text-xs sm:text-sm mt-0.5 break-words">{value}</p>
            </div>
        </div>
    );
}

function ApplicantCard({ entry, onStatusChange }) {
    const [expanded, setExpanded] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleStatus = async (newStatus) => {
        setUpdating(true);
        try {
            await updateEntryStatus(entry.id, newStatus);
            onStatusChange(entry.id, newStatus);
        } catch (e) {
            console.error(e);
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteEntry(entry.id);
        } catch (e) {
            console.error(e);
        } finally {
            setDeleting(false);
        }
    };

    const formatDate = (ts) => {
        if (!ts) return '—';
        if (ts.toDate) return ts.toDate().toLocaleString();
        return new Date(ts).toLocaleString();
    };

    const payoutDisplay = entry.payoutDetails
        ? Object.entries(entry.payoutDetails)
            .filter(([, v]) => v)
            .map(([k, v]) => `${k}: ${v}`)
            .join(' · ')
        : null;

    const tasksList = entry.tasks
        ? Object.entries(entry.tasks)
            .filter(([, done]) => done)
            .map(([k]) =>
                k.replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (c) => c.toUpperCase())
                    .replace('Followed', '✓')
                    .replace('Subscribed', '✓')
            )
        : [];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0d0d18] border border-purple-500/10 rounded-2xl overflow-hidden hover:border-purple-500/25 transition-colors"
        >
            {/* ── Row ── */}
            <div
                className="flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 cursor-pointer select-none"
                onClick={() => setExpanded(!expanded)}
            >
                {/* Avatar */}
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {(entry.fullName || '?')[0].toUpperCase()}
                </div>

                {/* Name + email */}
                <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-xs sm:text-sm truncate">{entry.fullName || '—'}</p>
                    <p className="text-gray-500 text-xs truncate">{entry.email || '—'}</p>
                    {/* Show country on mobile under name */}
                    <p className="text-gray-400 text-xs truncate sm:hidden">{entry.country || '—'}</p>
                </div>

                {/* Country - hidden on mobile (shown under name instead) */}
                <div className="hidden sm:block text-gray-400 text-sm flex-shrink-0 w-28 truncate">
                    {entry.country || '—'}
                </div>

                {/* Payout method - desktop only */}
                <div className="hidden md:block text-gray-400 text-xs flex-shrink-0 w-28 truncate">
                    {entry.payoutMethod || '—'}
                </div>

                {/* Date - desktop only */}
                <div className="hidden lg:block text-gray-500 text-xs flex-shrink-0 w-32 text-right">
                    {formatDate(entry.createdAt)}
                </div>

                {/* Status */}
                <div className="flex-shrink-0">
                    <StatusBadge status={entry.status} />
                </div>

                {/* Expand icon */}
                <div className="text-gray-600 flex-shrink-0">
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </div>

            {/* ── Expanded details ── */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-purple-500/10 px-3 sm:px-5 py-4 sm:py-5 space-y-4 sm:space-y-6">
                            {/* Detail grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                <DetailRow icon={Mail} label="Email" value={entry.email} />
                                <DetailRow icon={Globe} label="Country" value={entry.country} />
                                <DetailRow icon={CreditCard} label="Payout Method" value={entry.payoutMethod} />
                                <DetailRow icon={CreditCard} label="Payout Details" value={payoutDisplay} />
                                <DetailRow icon={Music} label="Favourite Song" value={entry.favoriteSong} />
                                <DetailRow icon={MessageSquare} label="Why They Like It" value={entry.reasonForLiking} />
                            </div>

                            {/* Tasks completed */}
                            {tasksList.length > 0 && (
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Social Tasks Completed</p>
                                    <div className="flex flex-wrap gap-2">
                                        {tasksList.map((t) => (
                                            <span key={t} className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pt-2 border-t border-purple-500/10">
                                <p className="text-xs text-gray-500 sm:mr-auto">
                                    Submitted: {formatDate(entry.createdAt)}
                                </p>
                                {/* Buttons - wrap on mobile */}
                                <div className="flex flex-wrap gap-2">
                                    {deleting ? (
                                        <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition"
                                            disabled={deleting}
                                        >
                                            <XCircle className="w-3.5 h-3.5" />
                                            Delete
                                        </motion.button>
                                    )}

                                    {updating ? (
                                        <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                                    ) : (
                                        <>
                                            {entry.status !== 'approved' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleStatus('approved')}
                                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Approve
                                                </motion.button>
                                            )}
                                            {entry.status !== 'rejected' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleStatus('rejected')}
                                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition"
                                                >
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    Reject
                                                </motion.button>
                                            )}
                                            {(entry.status === 'approved' || entry.status === 'rejected') && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleStatus('pending')}
                                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold hover:bg-yellow-500/20 transition"
                                                >
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Reset
                                                </motion.button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function ApplicantsPage() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();
    const filterStatus = searchParams.get('filterStatus') || 'all';

    useEffect(() => {
        const unsub = subscribeToEntries((data) => {
            setEntries(data);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleStatusChange = (id, newStatus) => {
        setEntries((prev) =>
            prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
    };

    const filtered = entries.filter((e) => {
        const matchSearch =
            !search ||
            (e.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
            (e.email || '').toLowerCase().includes(search.toLowerCase()) ||
            (e.country || '').toLowerCase().includes(search.toLowerCase());

        const matchStatus =
            filterStatus === 'all' ||
            e.status === filterStatus ||
            (filterStatus === 'pending' && e.status === 'submitted');

        return matchSearch && matchStatus;
    });

    const counts = {
        all: entries.length,
        pending: entries.filter(e => e.status === 'pending' || e.status === 'submitted').length,
        approved: entries.filter(e => e.status === 'approved').length,
        rejected: entries.filter(e => e.status === 'rejected').length,
    };

    const filters = [
        { key: 'all', label: 'All', count: counts.all },
        { key: 'pending', label: 'Pending', count: counts.pending },
        { key: 'approved', label: 'Approved', count: counts.approved },
        { key: 'rejected', label: 'Rejected', count: counts.rejected },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-0">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Applicants</h1>
                <p className="text-gray-500 mt-1 text-sm">
                    {entries.length} {entries.length === 1 ? 'person has' : 'people have'} applied.
                </p>
            </motion.div>

            {/* Search + Filter bar */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="flex flex-col gap-3"
            >
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email or country…"
                        className="w-full pl-11 pr-4 py-3 bg-[#0d0d18] border border-purple-500/15 rounded-xl text-white text-sm placeholder-gray-600 focus:border-purple-500/40 focus:outline-none transition"
                    />
                </div>

                {/* Status tabs - scrollable on mobile */}
                <div className="flex items-center gap-1 bg-[#0d0d18] border border-purple-500/15 rounded-xl p-1 overflow-x-auto">
                    {filters.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => {
                                const next = new URLSearchParams(searchParams);
                                if (f.key === 'all') next.delete('filterStatus');
                                else next.set('filterStatus', f.key);
                                setSearchParams(next, { replace: false });
                            }}
                            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filterStatus === f.key
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Filter className="w-3 h-3" />
                            {f.label}
                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${filterStatus === f.key ? 'bg-white/20' : 'bg-white/5'}`}>
                                {f.count}
                            </span>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Table header - desktop only */}
            <div className="hidden md:flex items-center gap-4 px-5 py-2 text-[11px] uppercase tracking-widest text-gray-600 font-semibold">
                <div className="w-11 flex-shrink-0" />
                <div className="flex-1">Applicant</div>
                <div className="w-28 flex-shrink-0">Country</div>
                <div className="hidden md:block w-28 flex-shrink-0">Payout</div>
                <div className="hidden lg:block w-32 flex-shrink-0 text-right">Submitted</div>
                <div className="flex-shrink-0 w-24 text-right">Status</div>
                <div className="w-4 flex-shrink-0" />
            </div>

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center py-20 gap-3 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Loading applicants…</span>
                </div>
            ) : filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 sm:py-20 bg-[#0d0d18] border border-purple-500/10 rounded-2xl"
                >
                    <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-400 font-semibold text-sm">
                        {search || filterStatus !== 'all' ? 'No applicants match your filters.' : 'No applicants yet.'}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1 px-4">
                        {search || filterStatus !== 'all' ? 'Try adjusting your search or filter.' : 'Share your giveaway link to get submissions.'}
                    </p>
                </motion.div>
            ) : (
                <motion.div layout className="space-y-2">
                    {filtered.map((entry) => (
                        <ApplicantCard
                            key={entry.id}
                            entry={entry}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    );
}