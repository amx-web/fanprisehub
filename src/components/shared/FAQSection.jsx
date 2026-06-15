import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export function FAQSection() {
    const faqs = [
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
    ];

    const iconMap = {
        CheckCircle,
        AlertCircle,
        Info
    };

    const pickIcon = (idx) => {
        if (idx === 0) return iconMap.CheckCircle;
        if (idx === 1) return iconMap.Info;
        if (idx === 2) return iconMap.AlertCircle;
        return iconMap.Info;
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-20"
        >
            <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>

            <div className="space-y-4">
                {faqs.map((faq, idx) => {
                    const Icon = pickIcon(idx);
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-slate-800/30 border border-purple-500/20 rounded-lg p-6"
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    <Icon className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-3">{faq.q}</h4>
                                    <p className="text-gray-400">{faq.a}</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.section>
    );
}

