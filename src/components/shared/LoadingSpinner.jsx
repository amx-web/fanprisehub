import { motion } from 'framer-motion';

export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950">
            <motion.div
                className="relative w-20 h-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full opacity-75 blur-xl" />
                <div className="absolute inset-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full opacity-50" />
                <div className="absolute inset-6 bg-slate-950 rounded-full" />
            </motion.div>
        </div>
    );
}
