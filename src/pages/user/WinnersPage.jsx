import { motion } from 'framer-motion';
import { useGiveawayStore } from '../../store/giveawayStore';
import { WinnerCard } from '../../components/user/WinnerCard';

export function WinnersPage() {
    const { winners, giveaways } = useGiveawayStore();

    const giveawaysByTitle = new Map(
        giveaways.map((g) => [g.title, g])
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <div className="max-w-6xl mx-auto px-4 py-24 pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-6xl font-black text-white mb-4">Winners</h1>
                    <p className="text-xl text-gray-400">Verified winners from recent giveaways</p>
                </motion.div>

                {winners.length === 0 ? (
                    <div className="text-center py-16 bg-slate-800/30 border border-purple-500/20 rounded-xl">
                        <p className="text-gray-400">No winners announced yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {winners.map((winner, idx) => (
                            <WinnerCard key={winner.id ?? idx} winner={winner} index={idx} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

