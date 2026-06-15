import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, Star, Mail } from 'lucide-react';
import { useState } from 'react';

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
                                    whileHover={{ scale: 1.15, rotate: 10 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="mb-4 inline-flex"
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

                {/* Testimonies Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-12 backdrop-blur"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-white mb-4">Share Your Testimony</h2>
                        <p className="text-gray-300 mb-2">Tell us about your experience with FanPrizeHub</p>
                        <p className="text-gray-400 text-sm">Your story helps others trust our platform</p>
                    </div>

                    <div className="max-w-2xl mx-auto space-y-6">
                        {/* Email Contact */}
                        <motion.a
                            href="mailto:fanprizehub@gmail.com?subject=FanPrizeHub%20Testimony"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-4 p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl hover:border-purple-500/60 transition-all"
                        >
                            <Mail className="w-8 h-8 text-purple-400" />
                            <div className="text-left flex-1">
                                <p className="text-white font-semibold">Send us your testimony via email</p>
                                <p className="text-gray-400 text-sm">fanprizehub@gmail.com</p>
                            </div>
                            <span className="text-purple-400">→</span>
                        </motion.a>

                        {/* Inline Form */}
                        <div>
                            <p className="text-white font-semibold mb-4">Or share your story here:</p>
                            <TestimonyForm />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function TestimonyForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rating: '5',
        testimony: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Send email to fanprizehub@gmail.com
            const subject = encodeURIComponent('New Testimony Submission');
            const body = encodeURIComponent(
                `Name: ${formData.name}\nEmail: ${formData.email}\nRating: ${formData.rating}/5\n\nTestimony:\n${formData.testimony}`
            );

            // Create mailto link and open it
            window.location.href = `mailto:fanprizehub@gmail.com?subject=${subject}&body=${body}`;

            // Show success message
            setSubmitted(true);
            setFormData({ name: '', email: '', rating: '5', testimony: '' });

            // Reset form after 3 seconds
            setTimeout(() => {
                setSubmitted(false);
            }, 3000);
        } catch (error) {
            console.error('Error submitting testimony:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 bg-slate-800/50 border border-purple-500/20 rounded-xl p-6"
        >
            {submitted && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg flex items-center gap-2"
                >
                    <CheckCircle className="w-5 h-5" />
                    Thank you! Your testimony will be sent via email.
                </motion.div>
            )}

            <div>
                <label className="block text-white font-semibold mb-2">Your Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 transition"
                />
            </div>

            <div>
                <label className="block text-white font-semibold mb-2">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 transition"
                />
            </div>

            <div>
                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    Rating
                </label>
                <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/60 transition"
                >
                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars - Excellent!</option>
                    <option value="4">⭐⭐⭐⭐ 4 Stars - Very Good</option>
                    <option value="3">⭐⭐⭐ 3 Stars - Good</option>
                    <option value="2">⭐⭐ 2 Stars - Fair</option>
                    <option value="1">⭐ 1 Star - Poor</option>
                </select>
            </div>

            <div>
                <label className="block text-white font-semibold mb-2">Your Testimony</label>
                <textarea
                    name="testimony"
                    value={formData.testimony}
                    onChange={handleChange}
                    placeholder="Share your experience with FanPrizeHub... (minimum 20 characters)"
                    required
                    minLength="20"
                    rows="5"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 transition resize-none"
                />
            </div>

            <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 disabled:from-gray-600 disabled:to-gray-500 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all"
            >
                {loading ? 'Submitting...' : 'Submit Testimony'}
            </motion.button>
        </motion.form>
    );
}
