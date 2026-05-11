import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CountdownTimer({ endDate }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(endDate) - new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                    isExpired: false
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [endDate]);

    if (timeLeft.isExpired) {
        return (
            <div className="text-center">
                <p className="text-red-500 font-bold text-sm">GIVEAWAY ENDED</p>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 justify-center">
            <Clock className="w-4 h-4 text-purple-400" />
            <div className="flex gap-2">
                <TimeUnit value={timeLeft.days} label="d" />
                <span className="text-purple-400 font-bold">:</span>
                <TimeUnit value={timeLeft.hours} label="h" />
                <span className="text-purple-400 font-bold">:</span>
                <TimeUnit value={timeLeft.minutes} label="m" />
                <span className="text-purple-400 font-bold">:</span>
                <TimeUnit value={timeLeft.seconds} label="s" />
            </div>
        </div>
    );
}

function TimeUnit({ value, label }) {
    return (
        <motion.div
            key={value}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
        >
            <span className="text-sm font-bold text-white">{String(value).padStart(2, '0')}</span>
            <p className="text-xs text-gray-400">{label}</p>
        </motion.div>
    );
}
