const endDate = new Date();
endDate.setDate(endDate.getDate() + 30); // 30 days from now

export const mockGiveaways = [
    {
        id: 'default-20k-giveaway',
        title: 'FanPrizeHub $20,000 Cash Giveaway',
        description: 'Join our exclusive giveaway for a chance to win $20,000 in cash! This is your opportunity to be one of our lucky winners.',
        prizeAmount: 20000,
        currency: '$',
        image: '/aVfQJ.jpg',
        startDate: new Date(),
        endDate: endDate,
        countdownTime: null, // Optional custom countdown time
        isActive: true, // Enable/disable the giveaway
        participants: 0,
        winnersCount: 2,
        status: 'active',
        rules: [
            'Must be 18+ years old',
            'One entry per person',
            'Valid email required',
            'Winners will be announced weekly'
        ],
        createdAt: new Date(),
        updatedAt: new Date()
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
