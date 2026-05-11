import { create } from 'zustand';
import { mockGiveaways, mockWinners } from '../data/mockData';

export const useGiveawayStore = create((set) => ({
    giveaways: mockGiveaways,
    socialLinks: { tiktok: '', telegram: '' },
    winners: mockWinners,
    entries: [],

    // Giveaway actions
    addGiveaway: (giveaway) => set((state) => ({
        giveaways: [...state.giveaways, { ...giveaway, id: Date.now() }]
    })),

    updateGiveaway: (id, updates) => set((state) => ({
        giveaways: state.giveaways.map(g => g.id === id ? { ...g, ...updates } : g)
    })),

    deleteGiveaway: (id) => set((state) => ({
        giveaways: state.giveaways.filter(g => g.id !== id)
    })),

    getGiveawayById: (id) => {
        const state = useGiveawayStore.getState();
        return state.giveaways.find(g => g.id === parseInt(id));
    },

    // Social links (admin-configured)
    setSocialLinks: (links) => set((state) => ({
        socialLinks: { ...state.socialLinks, ...links }
    })),

    // Entry actions
    enterGiveaway: (giveawayId, entry) => set((state) => ({
        entries: [...state.entries, { ...entry, giveawayId, id: Date.now() }]
    })),

    // Winner actions
    pickWinner: (giveawayId) => set((state) => {
        const giveaway = state.giveaways.find(g => g.id === giveawayId);
        const giveawayEntries = state.entries.filter(e => e.giveawayId === giveawayId);

        if (giveawayEntries.length === 0) return state;

        const winner = giveawayEntries[Math.floor(Math.random() * giveawayEntries.length)];
        const newWinner = {
            id: Date.now(),
            name: winner.firstName,
            prize: `${giveaway.currency}${giveaway.prizeAmount}`,
            date: new Date(),
            giveawayTitle: giveaway.title
        };

        return {
            winners: [...state.winners, newWinner]
        };
    })
}));
