import { motion } from 'framer-motion';
import { Heart, Shield, Award } from 'lucide-react';

export function TrustBadges() {
    const badges = [
        { icon: Shield, label: "Secure Entry", color: "from-red-600 to-red-400" },
        { icon: Award, label: "Verified Winners", color: "from-red-800 to-red-600" },
        { icon: Heart, label: "Trusted Platform", color: "from-crimson-600 to-red-500" }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {badges.map((badge, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`bg-gradient-to-br ${badge.color} p-0.5 rounded-lg`}
                >
                    <div className="bg-slate-900 rounded-lg p-4 flex flex-col items-center text-center">
                        <badge.icon className="w-8 h-8 mb-2 text-white" />
                        <p className="text-sm font-semibold text-white">{badge.label}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
