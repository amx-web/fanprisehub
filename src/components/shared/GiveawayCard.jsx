import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CountdownTimer } from './CountdownTimer';
import { PrizeCard } from './PrizeCard';
import { Users, Trophy } from 'lucide-react';

export function GiveawayCard({ giveaway, showFullDetails = false }) {
    const navigate = useNavigate();

    // If the giveaway is not active, don't render it
    if (!giveaway.isActive) {
        return null;
    }

    console.log('Rendering giveaway:', giveaway);

    return (
        <motion.div
            whileHover={{ y: -10 }}
            onClick={() => navigate(`/giveaway/${giveaway.id}`)}
            className="group cursor-pointer"
        >
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-md h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] transition-all duration-500 hover:border-red-500/30">
                {/* Background Image */}
                <div className="absolute inset-0 overflow-hidden">
                    {giveaway.image && (
                        <img
                            src={giveaway.image}
                            alt={giveaway.title}
                            className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                            loading="lazy"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-4 sm:p-5 lg:p-6">
                    {/* Header */}
                    <div>
                        <motion.div
                            className="inline-block bg-red-500/10 border border-red-500/20 px-2 sm:px-3 py-1 rounded-full mb-2 sm:mb-3 backdrop-blur-sm"
                            whileHover={{ scale: 1.1 }}
                        >
                            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-red-500">ACTIVE</span>
                        </motion.div>

                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-red-500 transition line-clamp-2">
                            {giveaway.title}
                        </h3>

                        <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">
                            {giveaway.description}
                        </p>
                    </div>

                    {/* Prize Display */}
                    <div className="mb-3 sm:mb-4">
                        <motion.div
                            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-1 sm:mb-2"
                            whileHover={{ scale: 1.1 }}
                        >
                            {giveaway.currency}{giveaway.prizeAmount.toLocaleString()}
                        </motion.div>
                        <p className="text-red-500 text-[10px] sm:text-xs font-semibold">CASH PRIZE</p>
                    </div>

                    {/* Stats and Countdown */}
                    <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                        <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                                <Users className="w-3 sm:w-4 h-3 sm:h-4" />
                                <span className="truncate">{giveaway.participants.toLocaleString()} entries</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Trophy className="w-3 sm:w-4 h-3 sm:h-4" />
                                <span className="truncate">{giveaway.winnersCount} winner{giveaway.winnersCount > 1 ? 's' : ''}</span>
                            </div>
                        </div>

                        <div className="bg-white/[0.05] border border-white/10 rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-3 lg:p-4">
                            <CountdownTimer endDate={giveaway.endDate} countdownTime={giveaway.countdownTime} />
                        </div>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-2.5 sm:py-3 lg:py-4 bg-white text-black font-bold text-sm sm:text-base rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:bg-gray-100"
                    >
                        ENTER NOW
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

