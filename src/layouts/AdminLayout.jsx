import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Trophy, Zap,
    LogOut, Menu, X, PlusCircle
} from 'lucide-react';
import { useState } from 'react';




const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },

    { label: 'Applicants', path: '/admin/applicants', icon: Users },
    { label: 'Winners', path: '/admin/winners', icon: Trophy },

    { label: 'Create Giveaway', path: '/admin/create', icon: PlusCircle },
];

export function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex">
            {/* ── Sidebar (desktop) ── */}
            <aside className="hidden lg:flex flex-col w-64 bg-[#0d0d18] border-r border-purple-500/10 fixed inset-y-0 z-40">
                {/* Brand */}
                <div className="px-6 py-6 border-b border-purple-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-black text-white text-lg leading-none">FanPrizeHub</p>
                            <p className="text-[11px] text-purple-400 font-semibold uppercase tracking-widest">Admin</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-6 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <motion.button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.97 }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active
                                    ? 'bg-gradient-to-r from-purple-600/30 to-pink-500/10 text-white border border-purple-500/30'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${active ? 'text-purple-400' : ''}`} />
                                {item.label}
                                {active && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400"
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="px-3 pb-6">
                    <button
                        onClick={async () => {
                            try {
                                const { signOut } = await import('firebase/auth');
                                const { auth } = await import('../firebaseClient');
                                await signOut(auth);
                            } catch {
                                // ignore
                            } finally {
                                localStorage.removeItem('isAdmin');
                                navigate('/admin/login');
                            }
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>

            </aside>

            {/* ── Mobile sidebar ── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 w-72 bg-[#0d0d18] border-r border-purple-500/10 z-50 flex flex-col lg:hidden"
                        >
                            <div className="px-6 py-5 border-b border-purple-500/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-white" />
                                    </div>
                                    <p className="font-black text-white">FanPrizeHub</p>
                                </div>
                                <button onClick={() => setSidebarOpen(false)}>
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <nav className="flex-1 px-3 py-6 space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.path);
                                    return (
                                        <button
                                            key={item.path}
                                            onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active
                                                ? 'bg-gradient-to-r from-purple-600/30 to-pink-500/10 text-white border border-purple-500/30'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </nav>

                            <div className="px-3 pb-6">
                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all">
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ── Main content ── */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-purple-500/10 px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 text-gray-400 hover:text-white"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="hidden lg:block">
                        <p className="text-sm text-gray-500">
                            {navItems.find(n => isActive(n.path))?.label || 'Admin Panel'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs font-black">
                            A
                        </div>
                    </div>
                </header>

                {/* Page */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
