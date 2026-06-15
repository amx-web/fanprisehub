import { motion } from 'framer-motion';
import { useGiveawayStore } from '../../store/giveawayStore';
import { WinnerCard } from '../../components/user/WinnerCard';

const DEMO_WINNERS = [
    { id: 'demo1', name: 'Sarah Johnson', prize: '$20,000 Cash', giveawayTitle: 'Mega Cash Giveaway', date: new Date('2026-06-10').toISOString() },
    { id: 'demo2', name: 'Michael Chen', prize: '$10,000 Cash', giveawayTitle: 'Fan Rewards Giveaway', date: new Date('2026-06-08').toISOString() },
    { id: 'demo3', name: 'Amara Okafor', prize: '$15,000 Cash', giveawayTitle: 'Exclusive Fan Prize', date: new Date('2026-06-06').toISOString() },
    { id: 'demo4', name: 'James Williams', prize: '$15,000 Cash', giveawayTitle: 'Mega Cash Giveaway', date: new Date('2026-06-05').toISOString() },
    { id: 'demo5', name: 'Fatima Al-Hassan', prize: '$10,000 Cash', giveawayTitle: 'Fan Rewards Giveaway', date: new Date('2026-06-04').toISOString() },
    { id: 'demo6', name: 'David Okonkwo', prize: '$20,000 Cash', giveawayTitle: 'Mega Cash Giveaway', date: new Date('2026-06-03').toISOString() },
    { id: 'demo7', name: 'Emily Rodriguez', prize: '$12,000 Cash', giveawayTitle: 'Exclusive Fan Prize', date: new Date('2026-06-02').toISOString() },
    { id: 'demo8', name: 'Kevin Mensah', prize: '$10,000 Cash', giveawayTitle: 'Fan Rewards Giveaway', date: new Date('2026-06-01').toISOString() },
    { id: 'demo9', name: 'Chloe Dupont', prize: '$20,000 Cash', giveawayTitle: 'Mega Cash Giveaway', date: new Date('2026-05-30').toISOString() },
    { id: 'demo10', name: 'Tariq Mahmoud', prize: '$10,000 Cash', giveawayTitle: 'Exclusive Fan Prize', date: new Date('2026-05-28').toISOString() },
    { id: 'demo11', name: 'Aisha Diallo', prize: '$20,000 Cash', giveawayTitle: 'Mega Cash Giveaway', date: new Date('2026-05-25').toISOString() },
    { id: 'demo12', name: 'Lucas Ferreira', prize: '$10,000 Cash', giveawayTitle: 'Fan Rewards Giveaway', date: new Date('2026-05-22').toISOString() },
    { id: 'demo13', name: 'Grace Kim', prize: '$20,000 Cash', giveawayTitle: 'Mega Cash Giveaway', date: new Date('2026-05-20').toISOString() },
];

const AUTO_WINNERS_POOL = [
    { name: 'Daniel Adeyemi', prize: '$20,000 Cash', giveawayTitle: 'Mega Cash Giveaway' },
    { name: 'Sophie Laurent', prize: '$15,000 Cash', giveawayTitle: 'Fan Rewards Giveaway' },
    { name: 'Omar Abdullah', prize: '$10,000 Cash', giveawayTitle: 'Exclusive Fan Prize' },
    { name: 'Priya Sharma', prize: '$20,000 Cash', giveawayTitle: 'Mega Cash Giveaway' },
    { name: 'Carlos Mendoza', prize: '$10,000 Cash', giveawayTitle: 'Fan Rewards Giveaway' },
    { name: 'Yuki Tanaka', prize: '$20,000 Cash', giveawayTitle: 'Mega Cash Giveaway' },
    { name: 'Blessing Nwosu', prize: '$12,000 Cash', giveawayTitle: 'Exclusive Fan Prize' },
    { name: 'Anna Kowalski', prize: '$20,000 Cash', giveawayTitle: 'Mega Cash Giveaway' },
    { name: 'Marcus Thompson', prize: '$10,000 Cash', giveawayTitle: 'Fan Rewards Giveaway' },
    { name: 'Leila Ahmadi', prize: '$20,000 Cash', giveawayTitle: 'Mega Cash Giveaway' },
];


export function WinnersPage() {
    const { winners, giveaways } = useGiveawayStore();

    const displayWinners = winners.length > 0 ? winners : DEMO_WINNERS;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <div className="max-w-6xl mx-auto px-4 py-24 pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-6xl font-black text-white mb-4">Winners</h1>
                    <p className="text-xl text-gray-400">Verified winners from recent giveaways</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayWinners.map((winner, idx) => (
                        <WinnerCard key={winner.id ?? idx} winner={winner} index={idx} />
                    ))}
                </div>
            </div>
        </div>
    );
}

