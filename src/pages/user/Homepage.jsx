import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Zap, Flame } from 'lucide-react';
import { GiveawayCard } from '../../components/shared/GiveawayCard';
import { TrustBadges } from '../../components/shared/TrustBadges';
import { useGiveawayStore } from '../../store/giveawayStore';
import { GiveawayGiveawayImageBanner } from '../../components/user/GiveawayGiveawayImageBanner';


export function Homepage() {
    const { giveaways } = useGiveawayStore();
    const [isHeroVisible, setIsHeroVisible] = useState(true);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: isHeroVisible ? 1 : 0 }}
                className="relative min-h-[90vh] flex items-center justify-center px-4 pt-20 overflow-hidden"
            >
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-40 -right-40 w-96 h-96 bg-red-600 rounded-full mix-blend-screen filter blur-3xl opacity-10"
                        animate={{ y: [0, 50, 0], x: [0, 30, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute top-1/2 -left-40 w-80 h-80 bg-rose-900 rounded-full mix-blend-screen filter blur-3xl opacity-10"
                        animate={{ y: [50, 0, 50], x: [30, 0, 30], scale: [1, 1.2, 1] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                    <motion.div
                        className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-900 rounded-full mix-blend-screen filter blur-3xl opacity-10"
                        animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
                        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    />
                </div>

                {/* Content */}
                <motion.div
                    className="relative z-10 max-w-4xl mx-auto text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="mb-6">
                        <span className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-sm font-bold text-red-500 backdrop-blur-sm">
                            🎉 PREMIUM REWARDS
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 text-white"
                    >
                        Exclusive <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent">Rewards</span>
                        <br />for <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent">Real Fans</span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl"
                    >
                        Fans worldwide are joining for a chance to win up to $20,000, with more than $2 million in exclusive rewards being distributed.
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto"
                    >
                        {[
                            { label: '8K+', value: 'Active Entries' },
                            { label: '$20,000', value: 'Prize Pool' },
                            { label: '100%', value: 'Free to Enter' }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-4 backdrop-blur"
                            >
                                <p className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    {stat.label}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{stat.value}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-white text-black font-bold rounded-full text-lg flex items-center gap-2 shadow-xl hover:bg-gray-100 transition-all"
                        >
                            Start Winning
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-red-500/10 border border-red-500/30 text-white font-bold rounded-full text-lg backdrop-blur-sm hover:bg-red-500/20 transition-all"
                        >
                            Browse Giveaways
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Active Giveaways Section */}
            <motion.section
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 max-w-7xl mx-auto px-4 py-24"
            >
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-2">
                        <Flame className="w-6 h-6 text-orange-400" />
                        <h2 className="text-sm font-bold text-orange-400 uppercase tracking-wider">HOT OFFERS</h2>
                    </div>
                    <h3 className="text-5xl font-black text-white mb-4">Active Giveaways</h3>
                    <p className="text-xl text-gray-400">Huge prizes waiting. Limited time only.</p>
                </div>

                {/* Image banner for giveaways */}
                <GiveawayGiveawayImageBanner />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {giveaways.map((giveaway) => (
                        <GiveawayCard key={giveaway.id} giveaway={giveaway} />
                    ))}
                </div>
            </motion.section>


            {/* Trust Section */}
            <motion.section
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 max-w-7xl mx-auto px-4 py-24"
            >
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-black text-white mb-4">Why Trust FanPrizeHub?</h2>
                    <p className="text-xl text-gray-400">Transparent, certified, and audited</p>
                </div>

                <TrustBadges />

                {/* Additional Trust Info */}
                <motion.div
                    className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-md"
                    >
                        <Zap className="w-8 h-8 text-red-500 mb-4" />
                        <h4 className="text-xl font-bold text-white mb-2">Instant Payouts</h4>
                        <p className="text-gray-400 leading-relaxed text-sm">Winners receive their prizes within 24 hours to verified accounts.</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-md"
                    >
                        <Zap className="w-8 h-8 text-rose-500 mb-4" />
                        <h4 className="text-xl font-bold text-white mb-2">Verified Winners</h4>
                        <p className="text-gray-400 leading-relaxed text-sm">All winners are publicly verified. No fake accounts. Real people, real prizes.</p>
                    </motion.div>
                </motion.div>
            </motion.section>
        </div>
    );
}
