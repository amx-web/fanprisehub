import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useGiveawayStore } from '../../store/giveawayStore';

export function AdminWinnersPage() {
    const { winners } = useGiveawayStore();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-black text-white">Winners</h1>
                <p className="text-gray-500 mt-1">{winners.length} winner{winners.length !== 1 ? 's' : ''} announced so far.</p>
            </motion.div>

            {winners.length === 0 ? (
                <div className="text-center py-20 bg-[#0d0d18] border border-purple-500/10 rounded-2xl">
                    <Trophy className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-400 font-semibold">No winners yet.</p>
                    <p className="text-gray-600 text-sm mt-1">Pick a winner from the giveaway cards.</p>
                </div>
            ) : (
                <div className="bg-[#0d0d18] border border-purple-500/10 rounded-2xl overflow-hidden">
                    <div className="divide-y divide-purple-500/5">
                        {winners.map((w, i) => (
                            <motion.div
                                key={w.id || i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-4 px-6 py-5 hover:bg-white/[0.02] transition-colors"
                            >
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-black text-base flex-shrink-0">
                                    {(w.name || '?')[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-bold text-sm">{w.name}</p>
                                    <p className="text-gray-500 text-xs">{w.giveawayTitle}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-yellow-400 font-black">{w.prize}</p>
                                    <p className="text-gray-600 text-xs mt-0.5">{new Date(w.date).toLocaleDateString()}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
