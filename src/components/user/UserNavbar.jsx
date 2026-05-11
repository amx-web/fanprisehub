import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function UserNavbar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Giveaways', path: '/' },
        { name: 'Winners', path: '/winners' },
        { name: 'Rules', path: '/rules' }
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-slate-950/80 backdrop-blur-md border-b border-purple-500/20"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <motion.div
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-8 h-8 text-purple-400" />
                        </motion.div>
                        <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            FanPrizeHub
                        </span>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <motion.button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className="text-gray-300 hover:text-white transition-colors relative group"
                                whileHover={{ y: -2 }}
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300" />
                            </motion.button>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden border-t border-purple-500/20 py-4 space-y-2"
                    >
                        {navLinks.map((link) => (
                            <button
                                key={link.path}
                                onClick={() => {
                                    navigate(link.path);
                                    setIsOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-purple-500/10 rounded transition-colors"
                            >
                                {link.name}
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
}
