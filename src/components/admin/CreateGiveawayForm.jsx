import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useGiveawayStore } from '../../store/giveawayStore';
import { useState } from 'react';

export function CreateGiveawayForm() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { addGiveaway } = useGiveawayStore();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const onSubmit = (data) => {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + parseInt(data.durationDays));

        addGiveaway({
            title: data.title,
            description: data.description,
            prizeAmount: parseInt(data.prizeAmount),
            currency: data.currency,
            image: data.image || 'https://images.unsplash.com/photo-1579621970563-430f63602d4e?w=800&q=80',
            endDate,
            participants: 0,
            winnersCount: parseInt(data.winnersCount),
            status: 'active',
            rules: data.rules?.split('\n').filter(r => r.trim()) || []
        });

        setIsSubmitted(true);
        reset();

        setTimeout(() => setIsSubmitted(false), 3000);
    };

    return (
        <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-500/30 rounded-2xl p-8"
        >
            <h2 className="text-3xl font-bold text-white mb-8">Create New Giveaway</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Giveaway Title</label>
                    <input
                        {...register('title', { required: 'Title is required' })}
                        className="w-full px-4 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                        placeholder="e.g., Summer Cash Blast €500"
                    />
                    {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                </div>

                {/* Prize Amount */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Prize Amount</label>
                    <div className="flex gap-2">
                        <select
                            {...register('currency')}
                            defaultValue="€"
                            className="px-3 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 outline-none"
                        >
                            <option value="€">€</option>
                            <option value="$">$</option>
                            <option value="£">£</option>
                        </select>
                        <input
                            {...register('prizeAmount', { required: 'Prize amount is required' })}
                            type="number"
                            className="flex-1 px-4 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                            placeholder="500"
                        />
                    </div>
                    {errors.prizeAmount && <p className="text-red-400 text-xs mt-1">{errors.prizeAmount.message}</p>}
                </div>
            </div>

            {/* Description */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                    {...register('description', { required: 'Description is required' })}
                    className="w-full px-4 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition resize-none"
                    placeholder="Describe the giveaway..."
                    rows="4"
                />
                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Duration */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Duration (days)</label>
                    <input
                        {...register('durationDays', { required: 'Duration is required' })}
                        type="number"
                        className="w-full px-4 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                        placeholder="7"
                        defaultValue="7"
                    />
                </div>

                {/* Winners Count */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Number of Winners</label>
                    <input
                        {...register('winnersCount', { required: 'Winners count is required' })}
                        type="number"
                        className="w-full px-4 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                        placeholder="1"
                        defaultValue="1"
                    />
                </div>
            </div>

            {/* Image URL */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL (Optional)</label>
                <input
                    {...register('image')}
                    className="w-full px-4 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                    placeholder="https://..."
                />
            </div>

            {/* Rules */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Rules (one per line)</label>
                <textarea
                    {...register('rules')}
                    className="w-full px-4 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition resize-none"
                    placeholder="Must be 18+ years old&#10;One entry per person&#10;Valid email required"
                    rows="4"
                />
            </div>

            {/* Status */}
            {isSubmitted && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 text-sm"
                >
                    ✅ Giveaway created successfully!
                </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all"
            >
                Create Giveaway
            </motion.button>
        </motion.form>
    );
}
