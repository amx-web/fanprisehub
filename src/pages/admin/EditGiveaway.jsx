import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGiveawayStore } from '../../store/giveawayStore';


export function EditGiveaway() {
    const navigate = useNavigate();
    const { giveawayId } = useParams();
    const { getGiveawayById, updateGiveaway } = useGiveawayStore();

    const [giveaway, setGiveaway] = useState(null);
    const [title, setTitle] = useState('');
    const [prizeAmount, setPrizeAmount] = useState(0);
    const [endDate, setEndDate] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (giveawayId) {
            // Load the specific giveaway by ID
            const selectedGiveaway = getGiveawayById(giveawayId);
            if (selectedGiveaway) {
                setGiveaway(selectedGiveaway);
                setTitle(selectedGiveaway.title || '');
                setPrizeAmount(selectedGiveaway.prizeAmount || 0);

                // Format the date using native JavaScript
                const date = new Date(selectedGiveaway.endDate);
                const formattedDate = date.toISOString().split('T')[0];
                setEndDate(formattedDate);

                // Set isActive
                setIsActive(selectedGiveaway.isActive || false);
                console.log('Loaded giveaway for editing:', selectedGiveaway);
            }
        }
        setIsLoading(false);
    }, [giveawayId, getGiveawayById]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!giveaway) return;

        // Convert endDate from <input type="date"> (YYYY-MM-DD) to a Date/Timestamp
        // Do NOT send ISO strings to Firestore.
        const parsedEndDate = new Date(endDate);

        const updates = {
            title: title,
            prizeAmount: parseInt(prizeAmount),
            endDate: parsedEndDate,
            isActive: isActive,
        };


        console.log('Submitting updated giveaway:', updates);

        try {
            await updateGiveaway(giveaway.id, updates);
            console.log('Giveaway updated successfully!');
            navigate('/admin');
        } catch (error) {
            console.error('Failed to update giveaway:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!giveaway) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">Giveaway not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20"
            >
                <h1 className="text-3xl font-bold text-white mb-6">Edit Giveaway</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="prizeAmount" className="block text-sm font-medium text-gray-300 mb-1">
                            Prize Amount
                        </label>
                        <input
                            type="number"
                            id="prizeAmount"
                            value={prizeAmount}
                            onChange={(e) => setPrizeAmount(e.target.value)}
                            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                            min="0"
                        />
                    </div>




                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label htmlFor="isActive" className="block text-sm font-medium text-gray-300">
                            Active
                        </label>
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}