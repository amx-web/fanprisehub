import { motion } from 'framer-motion';
import { MoreVertical, Edit, Trash2, Zap } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGiveawayStore } from '../../store/giveawayStore';

export function GiveawayManageCard({ giveaway }) {
    const navigate = useNavigate();
    const { deleteGiveaway, pickWinner } = useGiveawayStore();
    const [showMenu, setShowMenu] = useState(false);
    const [deleting, setDeleting] = useState(false);


    const handlePickWinner = () => {
        pickWinner(giveaway.id);
        setShowMenu(false);
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/60 transition-all"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{giveaway.title}</h3>
                    <p className="text-sm text-gray-400">ID: {giveaway.id}</p>
                </div>

                {/* Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition"
                    >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>

                    {showMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full right-0 mt-2 bg-slate-900 border border-purple-500/30 rounded-lg overflow-hidden z-10 min-w-48"
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/admin/edit/${giveaway.id}`);
                                    setShowMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-purple-500/20 text-gray-300 hover:text-white transition flex items-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Edit
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePickWinner();
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-yellow-500/20 text-yellow-300 hover:text-yellow-200 transition flex items-center gap-2"
                            >
                                <Zap className="w-4 h-4" />
                                Pick Winner
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const ok = window.confirm(`Are you sure? This will delete all entries and cannot be undone.`);
                                    if (!ok) return;

                                    setDeleting(true);
                                    deleteGiveaway(giveaway.id)
                                        .then(() => {
                                            setShowMenu(false);
                                            alert('Giveaway deleted successfully');
                                        })
                                        .catch((e) => {
                                            console.error('[GiveawayManageCard] delete failed:', e);
                                            const msg = e?.message
                                                ? `Failed to delete giveaway: ${e.message}`
                                                : 'Failed to delete giveaway. Please try again.';
                                            alert(msg);
                                        })
                                        .finally(() => setDeleting(false));
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={deleting}
                            >
                                <Trash2 className="w-4 h-4" />
                                {deleting ? 'Deleting…' : 'Delete'}
                            </button>


                        </motion.div>
                    )}
                </div>
            </div>

            {/* Direct actions */}
            <div className="flex items-center gap-3 mb-4">
                <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/admin/edit/${giveaway.id}`)}
                    className="flex-1 bg-purple-600/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 transition rounded-xl px-4 py-2 text-sm font-bold"
                >
                    Edit
                </motion.button>
                <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        const ok = window.confirm(`Are you sure? This will delete all entries and cannot be undone.`);
                        if (!ok) return;

                        setDeleting(true);
                        deleteGiveaway(giveaway.id)
                            .then(() => {
                                // state updated by store subscription
                                alert('Giveaway deleted successfully');
                            })
                            .catch((e) => {
                                console.error('[GiveawayManageCard] delete failed:', e);
                                const msg = e?.message
                                    ? `Failed to delete giveaway: ${e.message}`
                                    : 'Failed to delete giveaway. Please try again.';
                                alert(msg);
                            })
                            .finally(() => setDeleting(false));
                    }}
                    disabled={deleting}
                    className="flex-1 bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition rounded-xl px-4 py-2 text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {deleting ? 'Deleting…' : 'Delete'}
                </motion.button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-xs text-gray-500 uppercase">Prize</p>
                    <p className="text-lg font-bold text-white">{giveaway.currency}{giveaway.prizeAmount}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase">Participants</p>
                    <p className="text-lg font-bold text-white">{giveaway.participants}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase">Status</p>
                    <motion.span
                        className={`inline-block px-2 py-1 bg-green-600/20 text-green-400 text-xs font-semibold rounded mt-1`}
                        animate={{ opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        {giveaway.isActive ? 'Active' : 'Inactive'}
                    </motion.span>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase">Winners</p>
                    <p className="text-lg font-bold text-white">{giveaway.winnersCount}</p>
                </div>
            </div>

            {/* Time Left */}
            <div className="pt-4 border-t border-purple-500/20">
                <p className="text-xs text-gray-500 uppercase">Ends in</p>
                <p className="text-sm text-gray-300">
                    {Math.ceil((new Date(giveaway.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                </p>
            </div>
        </motion.div>
    );
}

