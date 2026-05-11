import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Confetti from 'react-confetti';
import { useMemo, useState } from 'react';
import { useGiveawayStore } from '../../store/giveawayStore';
import { ChevronDown } from 'lucide-react';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseClient';

const COUNTRIES = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
    "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
    "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada",
    "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
    "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus",
    "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
    "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia",
    "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
    "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran",
    "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan",
    "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
    "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
    "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
    "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea",
    "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
    "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
    "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
    "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
    "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
    "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
    "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
    "Yemen", "Zambia", "Zimbabwe"
];

export function EntryModal({ giveaway, isOpen, onClose }) {
    const { enterGiveaway, socialLinks } = useGiveawayStore();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [showConfetti, setShowConfetti] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const requiredPlatforms = useMemo(() => {
        const req = [];
        if (socialLinks?.tiktok) req.push('tiktok');
        if (socialLinks?.telegram) req.push('telegram');
        return req;
    }, [socialLinks]);

    const [followed, setFollowed] = useState({ tiktok: false, telegram: false });
    const allRequiredFollowed = requiredPlatforms.every((p) => followed[p]);

    const onSubmit = async (data) => {
        if (!allRequiredFollowed) return;

        // Keep existing mock/state behavior so the UI flow works
        enterGiveaway(giveaway.id, data);

        // Also persist to Firestore for admin viewing
        try {
            await addDoc(collection(db, 'entries'), {
                giveawayId: giveaway.id,
                fullName: data.fullName,
                email: data.email,
                country: data.country,

                // Infer the "tasks" object from the gating UX
                tasks: {
                    tiktokFollowed: !!followed.tiktok,
                    telegramFollowed: !!followed.telegram,
                },

                status: 'submitted',
                createdAt: serverTimestamp(),
            });
        } catch (e) {
            console.warn('[Firestore] Failed to write entry:', e);
        }

        setShowConfetti(true);
        setIsSubmitted(true);
        setTimeout(() => {
            handleClose();
        }, 3000);
    };

    const handleClose = () => {
        reset();
        setShowConfetti(false);
        setIsSubmitted(false);
        onClose();
    };

    if (!isOpen) return null;

    const inputClass = `w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white
        placeholder-gray-500 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10
        outline-none transition-all duration-200 text-sm`;

    return (
        <>
            {showConfetti && <Confetti recycle={false} numberOfPieces={250} />}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-black/60 border border-white/10 backdrop-blur-2xl rounded-3xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
                >
                    {isSubmitted ? (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            className="text-center py-10"
                        >
                            <motion.div
                                animate={{ y: [0, -12, 0] }}
                                transition={{ duration: 0.6, repeat: 2 }}
                                className="text-6xl mb-5"
                            >
                                🎉
                            </motion.div>
                            <h2 className="text-3xl font-black text-white mb-2">You're In!</h2>
                            <p className="text-gray-400 mb-4">Good luck! We'll notify you if you win.</p>
                            <p className="text-xl font-black bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                                ${giveaway.prizeAmount.toLocaleString()} waiting for you
                            </p>
                        </motion.div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[11px] uppercase tracking-widest font-bold text-red-500 mb-3">
                                    Free Entry
                                </span>
                                <h2 className="text-2xl md:text-3xl font-black text-white">Be a Lucky Winner</h2>
                                <p className="text-gray-400 text-sm mt-1">
                                    Claim your chance at{' '}
                                    <span className="font-bold text-white">${giveaway.prizeAmount.toLocaleString()}</span> in cash rewards.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                                {/* Full Name */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        {...register('fullName', { required: 'Full name is required', minLength: { value: 3, message: 'Name must be at least 3 characters' } })}
                                        className={inputClass}
                                        placeholder="e.g. John Doe"
                                    />
                                    {errors.fullName && <p className="text-red-400 text-xs mt-1.5">{errors.fullName.message}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' }
                                        })}
                                        type="email"
                                        className={inputClass}
                                        placeholder="you@example.com"
                                    />
                                    {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
                                </div>

                                {/* Country */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        Country
                                    </label>
                                    <div className="relative">
                                        <select
                                            {...register('country', { required: 'Please select your country' })}
                                            className={`${inputClass} appearance-none cursor-pointer pr-10`}
                                            defaultValue=""
                                        >
                                            <option value="" disabled className="bg-slate-900 text-gray-400">
                                                Select your country...
                                            </option>
                                            {COUNTRIES.map((country) => (
                                                <option key={country} value={country} className="bg-slate-900 text-white">
                                                    {country}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    {errors.country && <p className="text-red-400 text-xs mt-1.5">{errors.country.message}</p>}
                                </div>

                                {/* Social Gating */}
                                {requiredPlatforms.length > 0 && (
                                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3">
                                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Follow to Enter</h3>
                                        {requiredPlatforms.includes('tiktok') && (
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id="follow_tiktok"
                                                        checked={followed.tiktok}
                                                        onChange={() => setFollowed((s) => ({ ...s, tiktok: !s.tiktok }))}
                                                        className="accent-red-500"
                                                    />
                                                    <label htmlFor="follow_tiktok" className="text-xs text-gray-300">Follow on TikTok</label>
                                                </div>
                                                {socialLinks?.tiktok && (
                                                    <a href={socialLinks.tiktok} target="_blank" rel="noreferrer" className="text-xs text-red-400 hover:text-red-300 transition">Open →</a>
                                                )}
                                            </div>
                                        )}
                                        {requiredPlatforms.includes('telegram') && (
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id="follow_telegram"
                                                        checked={followed.telegram}
                                                        onChange={() => setFollowed((s) => ({ ...s, telegram: !s.telegram }))}
                                                        className="accent-red-500"
                                                    />
                                                    <label htmlFor="follow_telegram" className="text-xs text-gray-300">Follow on Telegram</label>
                                                </div>
                                                {socialLinks?.telegram && (
                                                    <a href={socialLinks.telegram} target="_blank" rel="noreferrer" className="text-xs text-red-400 hover:text-red-300 transition">Open →</a>
                                                )}
                                            </div>
                                        )}
                                        {!allRequiredFollowed && (
                                            <p className="text-xs text-red-400">Please follow the required accounts to submit.</p>
                                        )}
                                    </div>
                                )}

                                {/* Terms */}
                                <div className="flex items-start gap-3 pt-1">
                                    <input
                                        {...register('terms', { required: 'You must agree to the terms' })}
                                        type="checkbox"
                                        id="terms"
                                        className="mt-0.5 accent-red-500"
                                    />
                                    <label htmlFor="terms" className="text-xs text-gray-400 leading-relaxed">
                                        I agree to the{' '}
                                        <span className="text-red-400 cursor-pointer hover:underline">Terms & Conditions</span>{' '}
                                        and{' '}
                                        <span className="text-red-400 cursor-pointer hover:underline">Privacy Policy</span>
                                    </label>
                                </div>
                                {errors.terms && <p className="text-red-400 text-xs">{errors.terms.message}</p>}

                                {/* Submit */}
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 bg-white text-black font-black rounded-2xl text-base shadow-xl hover:bg-gray-100 transition-all duration-200 mt-2"
                                >
                                    Claim My Reward →
                                </motion.button>

                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="w-full py-2.5 text-gray-500 hover:text-white text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                            </form>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </>
    );
}
