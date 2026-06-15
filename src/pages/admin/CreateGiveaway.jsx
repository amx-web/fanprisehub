import { CreateGiveawayForm } from '../../components/admin/CreateGiveawayForm';

export function CreateGiveaway() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <div className="max-w-4xl mx-auto px-4 py-24 pt-32">
                <h1 className="text-4xl font-bold text-white mb-8">Create Giveaway</h1>
                <CreateGiveawayForm />
            </div>
        </div>
    );
}

