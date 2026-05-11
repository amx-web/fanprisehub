import { motion } from 'framer-motion';

import giveawayBannerImg from '../../../image/ChatGPT Image May 11, 2026, 04_54_17 AM.png';



export function GiveawayGiveawayImageBanner() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
        >
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-md">
                <div className="absolute inset-0">
                    <img
                        src={giveawayBannerImg}
                        alt="Giveaway promo"
                        className="w-full h-full object-cover opacity-35"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
                </div>

                <div className="relative p-8 sm:p-10">
                    <p className="text-sm font-bold text-orange-300 uppercase tracking-wider">$20,000 CASH GIVEAWAY</p>
                    <h3 className="mt-2 text-3xl sm:text-4xl font-black text-white">
                        Win from the $20,000 prize pool
                    </h3>
                    <p className="mt-3 text-gray-300 max-w-2xl">
                        Enter active giveaways for a chance at instant winners and real rewards.
                    </p>

                </div>
            </div>
        </motion.div>
    );
}

