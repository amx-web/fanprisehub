import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function PrizeCard({ amount, currency = "€" }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-2xl blur-2xl opacity-60 -z-10" />

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-500/30 rounded-2xl p-8 text-center backdrop-blur">
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex justify-center mb-4"
                >
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                </motion.div>

                <p className="text-gray-400 text-sm mb-2">PRIZE POOL</p>
                <motion.div
                    className="text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {currency}{amount}
                </motion.div>
                <p className="text-purple-400 text-sm mt-2">IN CASH</p>
            </div>
        </motion.div>
    );
}
