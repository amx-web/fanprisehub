import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { UserNavbar } from '../components/user/UserNavbar';
import { UserFooter } from '../components/user/UserFooter';

import { subscribeToGiveaways } from '../firebase/giveaways';
import { useGiveawayStore } from '../store/giveawayStore';

export function UserLayout() {
    const { setGiveaways } = useGiveawayStore();

    useEffect(() => {
        // Subscribe to giveaways from Firebase
        const unsubGiveaways = subscribeToGiveaways((data) => {
            setGiveaways(data);
        });

        // Cleanup subscription on unmount
        return () => {
            unsubGiveaways();
        };
    }, [setGiveaways]);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <UserNavbar />

            <main className="flex-1">
                <Outlet />
            </main>
            <UserFooter />
        </div>
    );
}

