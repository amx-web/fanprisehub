import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export function RulesPageContent() {
    const rules = [
        {
            title: 'Age Requirement',
            description: 'You must be at least 18 years old to participate in FanPrizeHub giveaways.',
            icon: AlertCircle
        },
        {
            title: 'One Entry Per Person',
            description: 'Each person can only enter once per giveaway. Multiple entries from the same person will result in disqualification.',
            icon: CheckCircle
        },
        {
            title: 'Valid Email Required',
            description: 'You must provide a valid, active email address. We will contact winners at this address.',
            icon: Info
        },
        {
            title: 'No Fake Accounts',
            description: 'Accounts with false information or bot activity will be immediately banned.',
            icon: AlertCircle
        },
        {
            title: 'Random Selection',
            description: 'Winners are selected completely at random using certified RNG technology.',
            icon: CheckCircle
        },
        {
            title: 'Prize Verification',
            description: 'Winners must verify their identity before receiving their prizes. All winners are publicly announced.',
            icon: Info
        },
        {
            title: 'No Purchase Necessary',
            description: 'FanPrizeHub giveaways are completely free to enter. You never need to pay anything.',
            icon: CheckCircle
        },
        {
            title: 'Prize Payout',
            description: 'Verified winners receive their prizes within 24 hours to their specified payment method.',
            icon: CheckCircle
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <div className="max-w-4xl mx-auto px-4 py-24 pt-32">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-6xl font-black text-white mb-4">
                        Terms & <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Rules</span>
                    </h1>
                    <p className="text-xl text-gray-400">
                        Fair, transparent, and legally compliant giveaways
                    </p>
                </motion.div>

                {/* Rules Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                >
                    {rules.map((rule, idx) => {
                        const Icon = rule.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ y: -5 }}
                                className="group bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-all"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="mb-4"
                                >
                                    <Icon className="w-8 h-8 text-purple-400 group-hover:text-pink-400 transition" />
                                </motion.div>

                                <h3 className="text-xl font-bold text-white mb-2">{rule.title}</h3>
                                <p className="text-gray-400">{rule.description}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Privacy Section */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mb-20 bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-12 backdrop-blur"
                >
                    <h2 className="text-3xl font-bold text-white mb-6">Privacy & Data Protection</h2>

                    <div className="space-y-4 text-gray-300">
                        <p>
                            Your personal information is protected with industry-standard encryption. We never share your data with third parties without your consent.
                        </p>
                        <p>
                            We use your email only to notify you about giveaway results and important updates. You can opt out at any time.
                        </p>
                        <p>
                            All payment information is processed securely through verified payment processors.
                        </p>
                        <p>
                            For more information, please read our full <a href="#" className="text-purple-400 hover:text-pink-400 transition">Privacy Policy</a>.
                        </p>
                    </div>
                </motion.section>

                {/* FAQ Section */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mb-20"
                >
                    <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>

                    <div className="space-y-4">
                        {[
                            {
                                q: 'Is FanPrizeHub legitimate?',
                                a: 'Yes! We are a certified and audited platform with thousands of verified winners. All giveaways are completely fair and transparent.'
                            },
                            {
                                q: 'How do I know if I won?',
                                a: 'Winners are announced on our website and notified via email. You will receive payment within 24 hours of verification.'
                            },
                            {
                                q: 'Can I enter multiple times?',
                                a: 'No. Only one entry per person per giveaway. Multiple entries will result in disqualification.'
                            },
                            {
                                q: 'What if I forget my email?',
                                a: 'Contact our support team immediately. We can help recover your account using your phone number.'
                            }
                        ].map((faq, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-slate-800/30 border border-purple-500/20 rounded-lg p-6"
                            >
                                <h4 className="text-lg font-bold text-white mb-3">{faq.q}</h4>
                                <p className="text-gray-400">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Contact Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-12 backdrop-blur"
                >
                    <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
                    <p className="text-gray-300 mb-6">Our support team is here to help 24/7</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all"
                    >
                        Contact Support
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}
