import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Confetti from 'react-confetti';
import { useMemo, useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

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
    "Kenya", "Kiribati", "Kuwait", "Laos", "Latvia", "Lebanon",
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

const HEARD_ABOUT_US_OPTIONS = [
    'Instagram', 'TikTok', 'YouTube', 'Facebook', 'Twitter/X',
    'Friend/Family', 'Google Search', 'Other',
];

const SOCIAL_PLATFORMS = [
    { key: 'instagram', label: 'Instagram' },
    { key: 'tiktok', label: 'TikTok' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'facebook', label: 'Facebook' },
];

const FAN_DURATION_OPTIONS = [
    'Less than 1 month', '1–6 months', '6–12 months', '1–3 years', '3+ years',
];

export function EntryModal({ giveaway, isOpen, onClose }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            country: '',
            address: '',
            heardAboutUs: '',
            social: { instagram: false, tiktok: false, youtube: false, facebook: false },
            fanDuration: '',
            hasFanCard: '',
        },
    });

    const [showConfetti, setShowConfetti] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState('+2347040329721');
    const [formSnapshot, setFormSnapshot] = useState(null);

    useEffect(() => {
        const loadNumber = async () => {
            try {
                const { doc, getDoc } = await import('firebase/firestore');
                const { db } = await import('../../firebaseClient');
                const snap = await getDoc(doc(db, 'config', 'settings'));
                if (snap.exists() && snap.data().whatsappNumber) {
                    setWhatsappNumber(snap.data().whatsappNumber);
                }
            } catch (e) {
                console.warn('Failed to load WhatsApp number, using default:', e);
            }
        };
        loadNumber();
    }, []);

    const watchedSocial = watch('social');
    const watchedHasFanCard = watch('hasFanCard');

    const selectedPlatforms = useMemo(() => {
        return SOCIAL_PLATFORMS.filter((p) => watchedSocial?.[p.key]).map((p) => p.label);
    }, [watchedSocial]);

    const onSubmit = (values) => {
        setIsSubmitting(true);

        const followedPlatforms = selectedPlatforms.length > 0
            ? selectedPlatforms.join(', ')
            : 'None selected';

        const message =
            `🎉 New Giveaway Entry!\n\n` +
            `👤 Full Name: ${values.fullName}\n` +
            `📧 Email: ${values.email}\n` +
            `📞 Phone: ${values.phone}\n` +
            `🌍 Country: ${values.country}\n` +
            `🏠 Address: ${values.address}\n` +
            `📣 Heard about us via: ${values.heardAboutUs}\n` +
            `✅ Follows us on: ${followedPlatforms}\n` +
            `🎴 Has fan card: ${values.hasFanCard === 'yes' ? 'Yes ✅' : 'No ❌'}\n` +
            `⏳ Fan for: ${values.fanDuration}\n\n` +
            `🏆 Giveaway: ${giveaway?.title || 'Giveaway'}\n` +
            `💰 Prize: $${giveaway?.prizeAmount?.toLocaleString() || '20,000'}`;

        window.open(
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
            '_blank'
        );

        setFormSnapshot(values);
        setShowConfetti(true);
        setIsSubmitted(true);
        setIsSubmitting(false);
    };

    const handleClose = () => {
        reset();
        setShowConfetti(false);
        setIsSubmitted(false);
        setFormSnapshot(null);
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
                            onClick={handleClose}
                        >
                            <motion.div
                                animate={{ y: [0, -12, 0] }}
                                transition={{ duration: 0.6, repeat: 2 }}
                                className="text-6xl mb-5"
                            >
                                🎉
                            </motion.div>
                            <h2 className="text-3xl font-black text-white mb-2">You're In!</h2>
                            <p className="text-gray-400 mb-4">
                                Your entry has been sent via WhatsApp. Good luck!
                            </p>
                            <p className="text-green-400 font-bold mb-4">
                                ✅ WhatsApp opened with your entry details.
                            </p>
                            {formSnapshot?.hasFanCard === 'yes' && (
                                <p className="text-yellow-400 font-bold mb-4 text-sm">
                                    📎 Don't forget to send your fan card photo in the WhatsApp chat!
                                </p>
                            )}
                            <p className="text-xl font-black bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                                ${giveaway?.prizeAmount?.toLocaleString() || '20,000'} waiting for you
                            </p>
                            <p className="text-xs text-gray-500 mt-4">Click anywhere to close</p>
                        </motion.div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[11px] uppercase tracking-widest font-bold text-red-500 mb-3">
                                    Free Entry
                                </span>
                                <h2 className="text-2xl md:text-3xl font-black text-white">Be a Lucky Winner</h2>
                                <p className="text-gray-400 text-sm mt-1">
                                    Claim your chance at{' '}
                                    <span className="font-bold text-white">
                                        ${giveaway?.prizeAmount?.toLocaleString() || '20,000'}
                                    </span>{' '}
                                    in cash rewards.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                                {/* 1. Full Name */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                                    <input
                                        {...register('fullName', {
                                            required: 'Full name is required',
                                            minLength: { value: 2, message: 'Name must be at least 2 characters' },
                                        })}
                                        className={inputClass}
                                        placeholder="e.g. John Doe"
                                    />
                                    {errors.fullName && <p className="text-red-400 text-xs mt-1.5">{errors.fullName.message}</p>}
                                </div>

                                {/* 2. Email */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                                    <input
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                                        })}
                                        type="email"
                                        className={inputClass}
                                        placeholder="you@example.com"
                                    />
                                    {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
                                </div>

                                {/* 3. Phone */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                                    <input
                                        {...register('phone', {
                                            required: 'Phone number is required',
                                            minLength: { value: 7, message: 'Phone number looks too short' },
                                        })}
                                        type="tel"
                                        className={inputClass}
                                        placeholder="e.g. +1 555 123 4567"
                                    />
                                    {errors.phone && <p className="text-red-400 text-xs mt-1.5">{errors.phone.message}</p>}
                                </div>

                                {/* 4. Country */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Country</label>
                                    <div className="relative">
                                        <select
                                            {...register('country', { required: 'Please select your country' })}
                                            className={`${inputClass} appearance-none cursor-pointer pr-10`}
                                            defaultValue=""
                                        >
                                            <option value="" disabled className="bg-slate-900 text-gray-400">Select your country...</option>
                                            {COUNTRIES.map((c) => (
                                                <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    {errors.country && <p className="text-red-400 text-xs mt-1.5">{errors.country.message}</p>}
                                </div>

                                {/* 5. Address */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Home Address</label>
                                    <textarea
                                        {...register('address', {
                                            required: 'Address is required',
                                            minLength: { value: 5, message: 'Address is too short' },
                                        })}
                                        className={`${inputClass} min-h-[92px] resize-y`}
                                        placeholder="Street address, building, apt, etc."
                                    />
                                    {errors.address && <p className="text-red-400 text-xs mt-1.5">{errors.address.message}</p>}
                                </div>

                                {/* 6. Where did you hear about us */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Where did you hear about us?</label>
                                    <div className="relative">
                                        <select
                                            {...register('heardAboutUs', { required: 'Please select an option' })}
                                            className={`${inputClass} appearance-none cursor-pointer pr-10`}
                                            defaultValue=""
                                        >
                                            <option value="" disabled className="bg-slate-900 text-gray-400">Select...</option>
                                            {HEARD_ABOUT_US_OPTIONS.map((opt) => (
                                                <option key={opt} value={opt} className="bg-slate-900 text-white">{opt}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    {errors.heardAboutUs && <p className="text-red-400 text-xs mt-1.5">{errors.heardAboutUs.message}</p>}
                                </div>

                                {/* 7. Follow us on social media */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        Follow us on social media
                                    </label>
                                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 grid grid-cols-2 gap-3">
                                        {SOCIAL_PLATFORMS.map((platform) => (
                                            <label key={platform.key} className="flex items-center gap-2 text-sm text-white/90 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    {...register(`social.${platform.key}`)}
                                                    className="accent-red-500 w-4 h-4"
                                                />
                                                {platform.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* 8. Do you have a fan card */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        Do you have a fan card?
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 text-sm text-white/90 cursor-pointer">
                                            <input
                                                type="radio"
                                                {...register('hasFanCard', { required: 'Please select yes or no' })}
                                                value="yes"
                                                className="accent-red-500 w-4 h-4"
                                            />
                                            Yes
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-white/90 cursor-pointer">
                                            <input
                                                type="radio"
                                                {...register('hasFanCard', { required: 'Please select yes or no' })}
                                                value="no"
                                                className="accent-red-500 w-4 h-4"
                                            />
                                            No
                                        </label>
                                    </div>
                                    {errors.hasFanCard && <p className="text-red-400 text-xs mt-1.5">{errors.hasFanCard.message}</p>}

                                    {watchedHasFanCard === 'yes' && (
                                        <div className="mt-3">
                                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                Upload your fan card photo
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                {...register('fanCardPhoto', {
                                                    required: 'Please upload your fan card photo',
                                                })}
                                                className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-red-500/20 file:text-red-400 hover:file:bg-red-500/30 cursor-pointer outline-none transition-all duration-200"
                                            />
                                            {errors.fanCardPhoto && <p className="text-red-400 text-xs mt-1.5">{errors.fanCardPhoto.message}</p>}
                                            <p className="text-gray-500 text-xs mt-1.5">
                                                📎 After submitting, please also send this photo directly in the WhatsApp chat.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* 9. How long have you been a fan */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">How long have you been a fan?</label>
                                    <div className="relative">
                                        <select
                                            {...register('fanDuration', { required: 'Please select how long you have been a fan' })}
                                            className={`${inputClass} appearance-none cursor-pointer pr-10`}
                                            defaultValue=""
                                        >
                                            <option value="" disabled className="bg-slate-900 text-gray-400">Select...</option>
                                            {FAN_DURATION_OPTIONS.map((opt) => (
                                                <option key={opt} value={opt} className="bg-slate-900 text-white">{opt}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    {errors.fanDuration && <p className="text-red-400 text-xs mt-1.5">{errors.fanDuration.message}</p>}
                                </div>

                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                    disabled={isSubmitting}
                                    className={`w-full py-4 rounded-2xl text-base font-bold shadow-xl transition-all duration-200 mt-2 ${isSubmitting
                                        ? 'bg-white/50 text-black/70 cursor-not-allowed'
                                        : 'bg-white text-black hover:bg-gray-100'
                                        }`}
                                >
                                    {isSubmitting ? 'Opening WhatsApp...' : 'Claim My Reward →'}
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