import { create } from 'zustand';

import { addWinner as addWinnerService } from '../firebase/winners';
import { addGiveaway as addGiveawayService, updateGiveaway as updateGiveawayService, deleteGiveaway as deleteGiveawayService } from '../firebase/giveaways';



export const useGiveawayStore = create((set) => ({
    // Firestore is the single source of truth.
    // Initial state is empty; pages should show loading until subscriptions load.
    giveaways: [],
    socialLinks: { tiktok: '', telegram: '' },
    winners: [],
    entries: [],

    // Hydration actions
    setGiveaways: (giveaways) => set(() => ({ giveaways })),
    setWinners: (winners) => set(() => ({ winners })),

    // Giveaway actions
    addGiveaway: async (giveaway) => {
        const id = await addGiveawayService(giveaway);
        set((state) => ({
            giveaways: [...state.giveaways, { ...giveaway, id }],
        }));
        return id;
    },


    updateGiveaway: async (giveawayId, updates) => {
        console.log('Updating giveaway in store:', giveawayId, updates);
        await updateGiveawayService(giveawayId, updates);
        set((state) => ({
            giveaways: state.giveaways.map((g) => (g.id === giveawayId ? { ...g, ...updates } : g)),
        }));
        console.log('Giveaway updated successfully in store:', updates);
    },

    deleteGiveaway: async (id) => {
        // Keep UI responsive only after Firestore deletion succeeds
        await deleteGiveawayService(id);
        set((state) => ({
            giveaways: state.giveaways.filter((g) => String(g.id) !== String(id)),
            entries: state.entries.filter((e) => String(e.giveawayId) !== String(id)),
        }));
    },

    getGiveawayById: (id) => {
        const state = useGiveawayStore.getState();
        return state.giveaways.find((g) => String(g.id) === String(id));
    },

    // Social links (admin-configured)
    setSocialLinks: (links) => set((state) => ({
        socialLinks: { ...state.socialLinks, ...links }
    })),

    // Entry actions
    // NOTE: participant counting is handled in Firestore submitEntry (to prevent duplicates)
    // Only update local state if Firestore write succeeds.
    enterGiveaway: async (giveawayId, entry) => {
        const { submitEntry } = await import('../firebase/entries');
        // Firestore write (required to succeed before we touch local state)
        await submitEntry({
            giveawayId,
            fullName: entry.fullName,
            email: entry.email,
            country: entry.country,
            tasks: entry.tasks || {},
            payoutMethod: entry.payoutMethod,
            payoutDetails: entry.payoutDetails || {},
            favoriteSong: entry.favoriteSong || '',
            reasonForLiking: entry.reasonForLiking || '',
        });

        // If Firestore succeeded, add to local state for instant UI flow
        set((state) => ({
            entries: [...state.entries, { ...entry, giveawayId, id: Date.now() }]
        }));
    },


    // Winner actions
    addWinner: async ({ giveawayId, name, prize, giveawayTitle, date }) => {
        const id = await addWinnerService({ giveawayId, name, prize, giveawayTitle, date });
        set((state) => ({
            winners: [
                ...state.winners,
                { id, giveawayId, name, prize, giveawayTitle, date: date ?? new Date() },
            ]
        }));
    },

    // Legacy: random picker (kept but not used for persisted flow)
    pickWinner: (giveawayId) => set((state) => {
        const giveaway = state.giveaways.find((g) => String(g.id) === String(giveawayId));
        const giveawayEntries = state.entries.filter((e) => String(e.giveawayId) === String(giveawayId));

        if (giveawayEntries.length === 0) return state;

        const winner = giveawayEntries[Math.floor(Math.random() * giveawayEntries.length)];
        const newWinner = {
            id: Date.now(),
            name: winner.firstName,
            prize: `${giveaway.currency}${giveaway.prizeAmount}`,
            date: new Date(),
            giveawayTitle: giveaway.title
        };

        return { winners: [...state.winners, newWinner] };
    })
}));

