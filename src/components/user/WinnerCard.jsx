import { motion } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export function WinnerCard({ winner, index }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), index * 100);
    }, [index]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="group"
        >
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-500/30 p-6 hover:border-purple-500/60 transition-all duration-300">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Rank Badge */}
                <motion.div
                    className="absolute top-4 right-4"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {index === 0 ? (
                        <div className="text-4xl">🥇</div>
                    ) : index === 1 ? (
                        <div className="text-4xl">🥈</div>
                    ) : (
                        <div className="text-4xl">🥉</div>
                    )}
                </motion.div>

                {/* Content */}
                <div className="relative">
                    <div className="flex items-start gap-4 mb-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="flex-shrink-0"
                        >
                            <Trophy className="w-8 h-8 text-yellow-400" />
                        </motion.div>

                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-1">
                                {winner.name}
                            </h3>
                            <p className="text-sm text-gray-400">
                                {winner.giveawayTitle}
                            </p>
                        </div>
                    </div>

                    {/* Prize Amount */}
                    <motion.div
                        className="text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent mb-4"
                        whileHover={{ scale: 1.05 }}
                    >
                        {winner.prize}
                    </motion.div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Sparkles className="w-3 h-3" />
                        <span>{new Date(winner.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
