import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, LayoutDashboard, Mail, Gift } from 'lucide-react';
import { useState } from 'react';

export function AdminNavbar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Edit Giveaway', path: '/admin/create', icon: Gift },
        { name: 'Email Templates', path: '/admin/email-template', icon: Mail },
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
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                    >
                        <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Admin Panel
                        </span>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <motion.button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                                whileHover={{ y: -2 }}
                            >
                                <link.icon className="w-5 h-5" />
                                {link.name}
                            </motion.button>
                        ))}

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg flex items-center gap-2 transition"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </motion.button>
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
                                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-purple-500/10 rounded transition-colors flex items-center gap-2"
                            >
                                <link.icon className="w-5 h-5" />
                                {link.name}
                            </button>
                        ))}
                        <button className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors flex items-center gap-2">
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
}
