import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function UserFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="bg-gradient-to-t from-slate-950 to-slate-900/50 border-t border-purple-500/20 mt-20"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-6 h-6 text-purple-400" />
                            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                FanPrizeHub
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Real cash giveaways for real people. Trust, transparency, and excitement.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-purple-400 transition">Home</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition">Giveaways</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition">Winners</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition">Rules</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="/terms" className="hover:text-purple-400 transition">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition">Contact</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition">Support</a></li>
                        </ul>
                    </div>

                    {/* Stats */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Stats</h4>
                        <ul className="space-y-3 text-sm">
                            <li><span className="text-purple-400 font-bold">50K+</span> <span className="text-gray-400">Active Users</span></li>
                            <li><span className="text-purple-400 font-bold">€100K+</span> <span className="text-gray-400">Distributed</span></li>
                            <li><span className="text-purple-400 font-bold">1K+</span> <span className="text-gray-400">Happy Winners</span></li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-purple-500/20 pt-8">
                    <p className="text-center text-gray-400 text-sm">
                        © {currentYear} FanPrizeHub. All rights reserved. | Certified & Audited
                    </p>
                </div>
            </div>
        </motion.footer>
    );
}
