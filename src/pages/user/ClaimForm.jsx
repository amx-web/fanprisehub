import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, Loader2, ChevronDown } from 'lucide-react';

const TELEGRAM_USERNAME = 'Fanprizehub';

const COUNTRIES = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina',
    'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
    'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin',
    'Bhutan', 'Bolivia', 'Botswana', 'Brazil', 'Bulgaria', 'Burkina Faso',
    'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Chad',
    'Chile', 'China', 'Colombia', 'Congo (Brazzaville)', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czechia', 'Denmark', 'Djibouti',
    'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
    'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Guatemala',
    'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary',
    'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
    'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati',
    'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia',
    'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi',
    'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico',
    'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique',
    'Myanmar', 'Namibia', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua',
    'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan',
    'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland',
    'Portugal', 'Qatar', 'Romania', 'Rwanda', 'Saudi Arabia', 'Senegal',
    'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia',
    'Somalia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan',
    'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tanzania', 'Thailand', 'Togo',
    'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Uganda', 'Ukraine',
    'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
    'Uzbekistan', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
];

const HEARD_ABOUT_US_OPTIONS = [
    'Instagram', 'TikTok', 'YouTube', 'Facebook', 'Twitter/X',
    'Friend/Family', 'Google Search', 'Other',
];

const SOCIAL_CHECKBOXES = [
    { key: 'Instagram', label: 'Instagram' },
    { key: 'TikTok', label: 'TikTok' },
    { key: 'YouTube', label: 'YouTube' },
    { key: 'Facebook', label: 'Facebook' },
];

const FAN_DURATION_OPTIONS = [
    'Less than 1 month', '1–6 months', '6–12 months', '1–3 years', '3+ years',
];

// FIX 1: Added w-full px-4 py-3 to input class so fields render properly
const inputClass =
    'w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 outline-none transition-all duration-200 text-sm';

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function isValidInternationalPhone(phone) {
    return /^\+\d{7,15}$/.test(String(phone).trim().replace(/\s+/g, ''));
}

export function ClaimForm() {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formValuesSnapshot, setFormValuesSnapshot] = useState(null);
    const [countryQuery, setCountryQuery] = useState('');
    const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

    const filteredCountries = useMemo(() => {
        const q = countryQuery.trim().toLowerCase();
        if (!q) return COUNTRIES;
        return COUNTRIES.filter((c) => c.toLowerCase().includes(q));
    }, [countryQuery]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            country: '',
            address: '',
            heardAboutUs: '',
            social: { Instagram: false, TikTok: false, YouTube: false, Facebook: false },
            fanDuration: '',
        },
    });

    const watchedSocial = watch('social');

    // FIX 2: Removed setSubmitting(false) from inside onSubmit so loading state
    // stays visible while WhatsApp opens. setSubmitting(true) is now only set
    // here, not on the button's onClick, so it only triggers after validation passes.
    const onSubmit = (values) => {
        setSubmitting(true);

        const socialMedia = SOCIAL_CHECKBOXES
            .filter((x) => values.social?.[x.key])
            .map((x) => x.label);

        const message =
            `🎉 New Giveaway Entry!\n\n` +
            `👤 Full Name: ${values.fullName}\n` +
            `📧 Email: ${values.email}\n` +
            `📞 Phone: ${values.phone}\n` +
            `🌍 Country: ${values.country}\n` +
            `🏠 Address: ${values.address}\n` +
            `📣 Heard about us via: ${values.heardAboutUs}\n` +
            `✅ Follows us on: ${socialMedia.join(', ')}\n` +
            `⏳ Fan for: ${values.fanDuration}`;

        const encoded = encodeURIComponent(message);
        const telegramUsernameClean = String(TELEGRAM_USERNAME || '').replace(/^@/, '');
        const telegramUrl = `https://t.me/${telegramUsernameClean}?text=${encoded}`;
        console.log('[ClaimForm] TELEGRAM_USERNAME:', TELEGRAM_USERNAME);
        console.log('[ClaimForm] telegramUsernameClean:', telegramUsernameClean);
        console.log('[ClaimForm] telegramUrl:', telegramUrl);
        window.open(telegramUrl, '_blank');



        setFormValuesSnapshot({ ...values, socialMedia });
        setSuccess(true);
        setSubmitting(false);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-md p-8 text-center"
                >
                    <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-black text-white mb-3">Entry Submitted! ✅</h2>
                    <p className="text-gray-300 leading-relaxed">
                        Telegram has been opened with your details. Our team will be in touch soon!
                    </p>

                    <div className="mt-6 text-left bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-1.5">
                        <p className="text-sm text-gray-300">
                            <span className="text-white font-semibold">Name:</span> {formValuesSnapshot?.fullName}
                        </p>
                        <p className="text-sm text-gray-300">
                            <span className="text-white font-semibold">Country:</span> {formValuesSnapshot?.country}
                        </p>
                        <p className="text-sm text-gray-300">
                            <span className="text-white font-semibold">Follows:</span> {formValuesSnapshot?.socialMedia?.join(', ') || '—'}
                        </p>
                        <p className="text-sm text-gray-300">
                            <span className="text-white font-semibold">Fan for:</span> {formValuesSnapshot?.fanDuration || '—'}
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <div className="max-w-2xl mx-auto px-4 py-16 sm:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-md p-6 md:p-8"
                >
                    <div className="mb-6">
                        <h1 className="text-3xl md:text-4xl font-black text-white">Giveaway Entry</h1>
                        <p className="text-gray-400 mt-2">Fill in your details to enter the giveaway.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* 1. Full Name */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Full Name
                            </label>
                            <input
                                {...register('fullName', {
                                    required: 'Full Name is required',
                                    minLength: { value: 2, message: 'Full Name must be at least 2 characters' },
                                })}
                                className={inputClass}
                                placeholder="Enter your full name"
                            />
                            {errors.fullName && <p className="text-red-400 text-xs mt-1.5">{errors.fullName.message}</p>}
                        </div>

                        {/* 2. Email */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Email Address
                            </label>
                            <input
                                {...register('email', {
                                    required: 'Email Address is required',
                                    validate: (v) => isValidEmail(v) || 'Please enter a valid email address',
                                })}
                                className={inputClass}
                                placeholder="name@example.com"
                                inputMode="email"
                            />
                            {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
                        </div>

                        {/* 3. Phone */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Phone Number
                            </label>
                            <input
                                {...register('phone', {
                                    required: 'Phone Number is required',
                                    validate: (v) =>
                                        isValidInternationalPhone(v) ||
                                        'Enter a valid international phone number (e.g. +2348012345678)',
                                })}
                                className={inputClass}
                                placeholder="+234XXXXXXXXXX"
                                inputMode="tel"
                            />
                            {errors.phone && <p className="text-red-400 text-xs mt-1.5">{errors.phone.message}</p>}
                        </div>

                        {/* 4. Country — searchable dropdown */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Country
                            </label>
                            <div
                                className="relative"
                                onBlur={() => setTimeout(() => setCountryDropdownOpen(false), 150)}
                            >
                                <input
                                    value={countryQuery}
                                    onChange={(e) => {
                                        setCountryQuery(e.target.value);
                                        setCountryDropdownOpen(true);
                                        setValue('country', '', { shouldValidate: false });
                                    }}
                                    onFocus={() => setCountryDropdownOpen(true)}
                                    className={inputClass}
                                    placeholder="Search country..."
                                    autoComplete="off"
                                />
                                {countryDropdownOpen && (
                                    <div className="absolute z-20 left-0 right-0 mt-1 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-xl">
                                        <div className="max-h-56 overflow-y-auto">
                                            {filteredCountries.length === 0 ? (
                                                <div className="px-3 py-2 text-gray-400 text-sm">No results</div>
                                            ) : (
                                                filteredCountries.map((c) => (
                                                    <button
                                                        key={c}
                                                        type="button"
                                                        className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 transition"
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            setValue('country', c, { shouldValidate: true });
                                                            setCountryQuery(c);
                                                            setCountryDropdownOpen(false);
                                                        }}
                                                    >
                                                        {c}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <input
                                type="hidden"
                                {...register('country', { required: 'Please select your country' })}
                            />
                            {errors.country && <p className="text-red-400 text-xs mt-1.5">{errors.country.message}</p>}
                        </div>

                        {/* 5. Address */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Address
                            </label>
                            <textarea
                                {...register('address', {
                                    required: 'Address is required',
                                    minLength: { value: 5, message: 'Address must be at least 5 characters' },
                                })}
                                className={`${inputClass} min-h-[110px] resize-y`}
                                placeholder="Full home address"
                            />
                            {errors.address && <p className="text-red-400 text-xs mt-1.5">{errors.address.message}</p>}
                        </div>

                        {/* 6. Where did you hear about us */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Where did you hear about us?
                            </label>
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
                            <div className="grid grid-cols-2 gap-3">
                                {SOCIAL_CHECKBOXES.map((platform) => (
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
                            {/* FIX 3: Hidden field validates at least one social is checked */}
                            <input
                                type="hidden"
                                {...register('socialGroup', {
                                    validate: () => {
                                        const selected = SOCIAL_CHECKBOXES.filter((x) => watchedSocial?.[x.key]).length;
                                        return selected > 0 || 'Please follow at least one of our social platforms';
                                    },
                                })}
                            />
                            {errors.socialGroup && (
                                <p className="text-red-400 text-xs mt-1.5">{errors.socialGroup.message}</p>
                            )}
                        </div>

                        {/* 8. How long have you been a fan */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                How long have you been a fan?
                            </label>
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

                        {/* FIX 4: Removed onClick from button — setSubmitting now only fires
                            inside onSubmit, after validation passes */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: submitting ? 1 : 1.02 }}
                            whileTap={{ scale: submitting ? 1 : 0.98 }}
                            disabled={submitting}
                            className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 transition-all duration-200 disabled:bg-white/50 disabled:text-black/70 disabled:cursor-not-allowed shadow-xl mt-2 text-base"
                        >
                            {submitting ? (
                                <span className="inline-flex items-center gap-2 justify-center">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Opening Telegram...
                                </span>
                            ) : (
                                'Submit Entry →'
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}