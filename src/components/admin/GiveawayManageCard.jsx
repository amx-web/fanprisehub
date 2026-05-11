import { motion } from 'framer-motion';
import { MoreVertical, Edit, Trash2, Zap } from 'lucide-react';
import { useState } from 'react';
import { useGiveawayStore } from '../../store/giveawayStore';

export function GiveawayManageCard({ giveaway }) {
    const { deleteGiveaway, pickWinner } = useGiveawayStore();
    const [showMenu, setShowMenu] = useState(false);

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
                            <button className="w-full text-left px-4 py-2 hover:bg-purple-500/20 text-gray-300 hover:text-white transition flex items-center gap-2">
                                <Edit className="w-4 h-4" />
                                Edit
                            </button>
                            <button
                                onClick={handlePickWinner}
                                className="w-full text-left px-4 py-2 hover:bg-yellow-500/20 text-yellow-300 hover:text-yellow-200 transition flex items-center gap-2"
                            >
                                <Zap className="w-4 h-4" />
                                Pick Winner
                            </button>
                            <button
                                onClick={() => {
                                    deleteGiveaway(giveaway.id);
                                    setShowMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </motion.div>
                    )}
                </div>
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
                        className="inline-block px-2 py-1 bg-green-600/20 text-green-400 text-xs font-semibold rounded mt-1"
                        animate={{ opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Active
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
