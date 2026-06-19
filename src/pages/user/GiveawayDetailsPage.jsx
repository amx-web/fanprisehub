import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { PrizeCard } from '../../components/shared/PrizeCard';
import { CountdownTimer } from '../../components/shared/CountdownTimer';
import { EntryModal } from '../../components/user/EntryModal';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { useGiveawayStore } from '../../store/giveawayStore';
import { Users, Trophy, CheckCircle } from 'lucide-react';

const redGlowStyle = {
    color: '#ffffff',
    textShadow: '0 0 10px rgba(239, 68, 68, 0.5), 0 0 20px rgba(239, 68, 68, 0.3)',
    fontWeight: '900',
    letterSpacing: '-0.05em',
};

export function GiveawayDetailsPage() {
    const { id } = useParams();
    const { getGiveawayById, giveaways } = useGiveawayStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const giveaway = getGiveawayById(id);
    const isLoading = !giveaway;



    // Show loading spinner while data is being fetched
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!giveaway || !giveaway.isActive) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white text-2xl font-bold mb-4">Giveaway not found</p>
                    <p className="text-gray-400">This giveaway is no longer available or has ended.</p>
                </div>
            </div>
        );
    }

    // Provide default rules if not available
    const rules = giveaway.rules || [
        'Must be 18+ years old',
        'One entry per person',
        'Valid email required',
        'Winners will be announced'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
            <div className="max-w-6xl mx-auto px-4 py-20 pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                >
                    {/* Left Column - Image */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative overflow-hidden rounded-2xl h-96"
                    >
                        <img
                            src={giveaway.image}
                            alt={giveaway.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    </motion.div>

                    {/* Right Column - Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col justify-between"
                    >
                        {/* Header */}
                        <div>
                            <motion.span
                                className="inline-block px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full text-xs font-bold text-white mb-4"
                                whileHover={{ scale: 1.1 }}
                            >
                                ACTIVE GIVEAWAY
                            </motion.span>

                            <h1 className="text-5xl font-black text-white mb-4">
                                {giveaway.title}
                            </h1>

                            {/* Animated $20,000 Red Glow */}
                            <div className="mb-5">
                                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Grand Prize</p>
                                <motion.span
                                    style={redGlowStyle}
                                    animate={{
                                        textShadow: [
                                            '0 0 10px rgba(239, 68, 68, 0.5), 0 0 20px rgba(239, 68, 68, 0.3)',
                                            '0 0 15px rgba(239, 68, 68, 0.6), 0 0 30px rgba(239, 68, 68, 0.4)',
                                            '0 0 10px rgba(239, 68, 68, 0.5), 0 0 20px rgba(239, 68, 68, 0.3)',
                                        ]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                    className="text-7xl md:text-8xl block"
                                >
                                    {giveaway.currency}{giveaway.prizeAmount.toLocaleString()}
                                </motion.span>
                            </div>

                            <p className="text-lg text-gray-300 mb-8 leading-relaxed border-l-4 border-red-500/60 pl-4">
                                {giveaway.description}
                            </p>
                        </div>

                        {/* Prize Section */}
                        <div className="mb-8">
                            <p className="text-gray-400 text-sm mb-2 uppercase tracking-widest">TOTAL PRIZE POOL</p>
                            <motion.div
                                className="text-6xl font-black bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent mb-4"
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                            >
                                {giveaway.currency}{giveaway.prizeAmount.toLocaleString()}
                            </motion.div>
                            <p className="text-red-500 font-semibold">in cash prizes</p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 backdrop-blur-md transition-all duration-300 hover:border-red-500/20"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-5 h-5 text-red-400" />
                                    <span className="text-sm text-gray-400">Participants</span>
                                </div>
                                <p className="text-2xl font-bold text-white">{giveaway.participants.toLocaleString()}</p>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 backdrop-blur-md transition-all duration-300 hover:border-red-500/20"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Trophy className="w-5 h-5 text-red-500" />
                                    <span className="text-sm text-gray-400">Winners</span>
                                </div>
                                <p className="text-2xl font-bold text-white">{giveaway.winnersCount}</p>
                            </motion.div>
                        </div>

                        {/* Countdown */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-md">
                            <p className="text-gray-400 text-sm mb-3">TIME REMAINING</p>
                            <CountdownTimer endDate={giveaway.endDate} />
                        </div>

                        {/* CTA Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsModalOpen(true)}
                            className="w-full py-4 bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-red-500/50 transition-all"
                        >
                            ENTER NOW
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Rules Section */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-20 pt-20 border-t border-white/10"
                >
                    <h2 className="text-4xl font-black text-white mb-8">Rules & Requirements</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {rules.map((rule, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-md transition-all duration-300 hover:border-red-500/20"
                            >
                                <CheckCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                <p className="text-gray-300">{rule}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* How It Works */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-20 pt-20 border-t border-white/10"
                >
                    <h2 className="text-4xl font-black text-white mb-12">How It Works</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { num: 1, title: 'Enter', desc: 'Fill out the entry form with your details' },
                            { num: 2, title: 'Wait', desc: 'Giveaway ends on the specified date' },
                            { num: 3, title: 'Win', desc: 'Winners announced and paid within 24hrs' }
                        ].map((step, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="relative"
                            >
                                <motion.div
                                    className="bg-gradient-to-br from-red-600 to-red-800 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl mb-4"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {step.num}
                                </motion.div>
                                <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                                <p className="text-gray-400">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            </div>

            <EntryModal giveaway={giveaway} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

