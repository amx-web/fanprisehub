export const mockGiveaways = [
    {
        id: 1,
        title: "FanPrizeHub $20,000 Cash Giveaway",
        description: "Be part of the lucky winner and claim your reward today. This is your chance to change your life — seize it.",
        prizeAmount: 20000,
        currency: "$",
        image: "https://images.unsplash.com/photo-1579621970563-430f63602d4e?w=800&q=80",
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        participants: 8432,
        winnersCount: 1,
        status: "active",
        rules: [
            "Must be 18+ years old",
            "One entry per person",
            "Valid email and phone required",
            "No purchase necessary",
            "Winner will be contacted via email"
        ]
    }
];

export const mockWinners = [
    {
        id: 1,
        name: "Chidi A.",
        prize: "$20,000",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        giveawayTitle: "FanPrizeHub $20,000 Cash Giveaway"
    },
    {
        id: 2,
        name: "Ngozi E.",
        prize: "$20,000",
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        giveawayTitle: "FanPrizeHub $20,000 Cash Giveaway"
    },
    {
        id: 3,
        name: "Emeka O.",
        prize: "$20,000",
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        giveawayTitle: "FanPrizeHub $20,000 Cash Giveaway"
    },
    {
        id: 4,
        name: "Amaka B.",
        prize: "$20,000",
        date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        giveawayTitle: "FanPrizeHub $20,000 Cash Giveaway"
    },
    {
        id: 5,
        name: "Tunde F.",
        prize: "$20,000",
        date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        giveawayTitle: "FanPrizeHub $20,000 Cash Giveaway"
    }
];
