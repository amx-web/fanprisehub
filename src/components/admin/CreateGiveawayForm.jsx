import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useGiveawayStore } from '../../store/giveawayStore';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseClient';


export function CreateGiveawayForm() {
    const { addGiveaway } = useGiveawayStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            title: '',
            currency: '€',
            prizeAmount: 20000,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            winnersCount: 2,
            participants: 0,
            image: '',
        },
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageError, setImageError] = useState('');


    const onSubmit = async (data) => {
        try {
            setSubmitting(true);
            setImageError('');

            let uploadedImageUrl = '';
            if (imageFile) {
                setUploadingImage(true);
                try {
                    // Deterministic path per upload
                    const fileExt = imageFile.name?.split('.').pop() || 'png';
                    const safeName = (imageFile.name || 'image').replace(/[^a-zA-Z0-9._-]/g, '_');
                    const path = `giveaway-images/${Date.now()}-${safeName}.${fileExt}`;
                    const storageRef = ref(storage, path);

                    const snapshot = await uploadBytes(storageRef, imageFile, {
                        contentType: imageFile.type || 'application/octet-stream',
                    });
                    uploadedImageUrl = await getDownloadURL(snapshot.ref);
                } catch (e) {
                    console.error('[Storage] Failed to upload giveaway image:', e);
                    setImageError('Image upload failed. Please try again.');
                    setSubmitting(false);
                    setUploadingImage(false);
                    return;
                } finally {
                    setUploadingImage(false);
                }
            }

            const payload = {
                title: data.title.trim(),
                currency: data.currency,
                prizeAmount: Number(data.prizeAmount),
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                winnersCount: parseInt(data.winnersCount, 10),
                participants: parseInt(data.participants, 10),
                status: 'active',
                isActive: true,
                // If uploaded, use the download URL. Otherwise fallback to preview/data.image.
                image: uploadedImageUrl || imagePreview || data.image || '',
            };

            await addGiveaway(payload);


            setIsSubmitted(true);
            reset({
                title: '',
                currency: '€',
                prizeAmount: 20000,
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
                winnersCount: 2,
                participants: 0,
                image: '',
            });
            setImageFile(null);
            setImagePreview('');
            setImageError('');

            setTimeout(() => setIsSubmitted(false), 3000);

        } catch (e) {
            console.error('CreateGiveawayForm: failed to create giveaway', e);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-500/30 rounded-2xl p-8"
        >
            <h2 className="text-3xl font-bold text-white mb-8">Create Giveaway</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Giveaway Title</label>
                    <input
                        {...register('title', { required: 'Title is required' })}
                        type="text"
                        className="w-full px-4 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                        placeholder="e.g., Summer Prize Draw"
                    />
                    {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                    <select
                        {...register('currency', { required: 'Currency is required' })}
                        className="w-full px-4 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                    >
                        <option value="€">€</option>
                        <option value="$">$</option>
                        <option value="£">£</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Prize Amount</label>
                    <input
                        {...register('prizeAmount', {
                            required: 'Prize amount is required',
                            valueAsNumber: true,
                            min: { value: 0, message: 'Prize amount must be >= 0' },
                        })}
                        type="number"
                        className="w-full px-4 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                        placeholder="20000"
                    />
                    {errors.prizeAmount && (
                        <p className="text-red-400 text-xs mt-1">{errors.prizeAmount.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Giveaway Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                        }}
                        className="w-full px-4 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                    />

                    {imagePreview ? (
                        <div className="mt-3 p-3 bg-slate-700/50 border border-purple-500/20 rounded-lg">
                            <p className="text-xs text-gray-400 mb-2">Preview:</p>
                            <img src={imagePreview} alt="Giveaway preview" className="w-full h-32 object-cover rounded-lg" />
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500 mt-2">Upload an image (stored as preview URL unless you add storage upload).</p>
                    )}

                    {/* Keep existing image URL field if you want to paste a URL */}
                    <input
                        {...register('image')}
                        type="hidden"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                    <input
                        {...register('startDate', { required: 'Start date is required' })}
                        type="date"
                        className="w-full px-4 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                    />
                    {errors.startDate && <p className="text-red-400 text-xs mt-1">{errors.startDate.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                    <input
                        {...register('endDate', { required: 'End date is required' })}
                        type="date"
                        className="w-full px-4 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                    />
                    {errors.endDate && <p className="text-red-400 text-xs mt-1">{errors.endDate.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Number of Winners</label>
                    <input
                        {...register('winnersCount', {
                            required: 'Winners count is required',
                            valueAsNumber: true,
                            min: { value: 1, message: 'Winners must be >= 1' },
                        })}
                        type="number"
                        className="w-full px-4 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                        placeholder="2"
                        min="1"
                    />
                    {errors.winnersCount && <p className="text-red-400 text-xs mt-1">{errors.winnersCount.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Number of Participants</label>
                    <input
                        {...register('participants', {
                            required: 'Participants count is required',
                            valueAsNumber: true,
                            min: { value: 0, message: 'Participants must be >= 0' },
                        })}
                        type="number"
                        className="w-full px-4 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                        placeholder="0"
                        min="0"
                    />
                    {errors.participants && <p className="text-red-400 text-xs mt-1">{errors.participants.message}</p>}
                </div>
            </div>

            {isSubmitted && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 text-sm"
                >
                    ✅ Giveaway created successfully!
                </motion.div>
            )}

            <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {submitting ? 'Creating...' : 'Create Giveaway'}
            </motion.button>
        </motion.form>
    );
}

