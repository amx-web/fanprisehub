import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { testimonialPool } from '../../shared/testimonialPool';

function pickRandomDifferent(pool, usedIds) {
    // Try to avoid repeating the most recent ones.
    const candidates = pool.filter((t) => !usedIds.has(t.id) && t?.avatar);
    if (candidates.length > 0) {
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    // Fallback: allow repeats if user stays on the page a long time,
    // but still require an avatar so profile pictures show for all popups.
    const withAvatar = pool.filter((t) => t?.avatar);
    if (withAvatar.length > 0) {
        return withAvatar[Math.floor(Math.random() * withAvatar.length)];
    }

    // Last resort (should never happen because pool items include avatar)
    return pool[Math.floor(Math.random() * pool.length)];
}

export function TestimonialsPopup() {
    const [current, setCurrent] = useState(null);
    const [queueIdSet, setQueueIdSet] = useState(() => new Set());
    const [isVisible, setIsVisible] = useState(false);

    const pool = useMemo(() => testimonialPool, []);

    useEffect(() => {
        // Show first pop after load.
        const timers = [];

        const showNext = () => {
            const next = pickRandomDifferent(pool, queueIdSet);
            if (next) {
                setQueueIdSet((prev) => {
                    const n = new Set(prev);
                    n.add(next.id);
                    if (n.size > 10) {
                        const first = n.values().next().value;
                        n.delete(first);
                    }
                    return n;
                });
                setCurrent(next);
                setIsVisible(true);
            }

            // Stay visible for 5 minutes (300,000 ms)
            timers.push(
                window.setTimeout(() => {
                    setIsVisible(false);

                    // Delay for 2 minutes (120,000 ms) before showing another message
                    timers.push(
                        window.setTimeout(() => {
                            showNext();
                        }, 120000)
                    );
                }, 300000)
            );
        };

        // Initial delay before the first message (4 seconds)
        timers.push(
            window.setTimeout(() => {
                showNext();
            }, 4000)
        );

        return () => {
            timers.forEach((t) => window.clearTimeout(t));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pool, queueIdSet]);

    return (
        <div className="fixed top-[35%] right-4 z-40 pointer-events-none -translate-y-1/2">
            <AnimatePresence>
                {isVisible && current && (
                    <motion.div
                        key={current.id}
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="pointer-events-auto w-[200px] md:w-[240px] max-w-[85vw] bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl p-2.5 md:p-3 shadow-2xl"
                    >
                        <div className="flex items-start gap-3">
                            <img
                                src={current.avatar}
                                alt={current.name}
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-red-500/30 object-cover"
                            />

                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-bold text-white">{current.name}</p>
                                    <span className="text-xs text-red-400 font-semibold">{current.dateText}</span>
                                </div>

                                <p className="text-[11px] md:text-sm text-gray-300 mt-1 leading-snug">{current.message}</p>

                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-xs text-gray-400">Received</span>
                                    <span className="text-sm md:text-lg font-black bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                                        {current.amount}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

