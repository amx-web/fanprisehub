import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CountdownTimer({ endDate, countdownTime }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false,
    });

    const [invalidFormat, setInvalidFormat] = useState(false);

    const toValidDate = (value) => {
        if (!value) return null;

        // Firestore Timestamp
        if (value?.toDate && typeof value.toDate === 'function') {
            const d = value.toDate();
            return isNaN(d?.getTime?.()) ? null : d;
        }

        // ISO string or something parseable
        if (typeof value === 'string' || typeof value === 'number') {
            const d = new Date(value);
            return isNaN(d.getTime()) ? null : d;
        }

        // Date object
        if (value instanceof Date) {
            return isNaN(value.getTime()) ? null : value;
        }

        return null;
    };

    useEffect(() => {
        const calculateTimeLeft = () => {
            const rawTarget = countdownTime ? countdownTime : endDate;
            const targetDate = toValidDate(rawTarget);

            if (!targetDate) {
                setInvalidFormat(true);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
                return;
            }

            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference > 0) {
                setInvalidFormat(false);
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                    isExpired: false,
                });
            } else {
                setInvalidFormat(false);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [endDate, countdownTime]);

    if (invalidFormat) {
        return (
            <div className="text-center">
                <p className="text-gray-400 font-bold text-sm">Time unavailable</p>
            </div>
        );
    }

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
