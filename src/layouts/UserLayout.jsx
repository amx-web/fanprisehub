import { Outlet } from 'react-router-dom';
import { UserNavbar } from '../components/user/UserNavbar';
import { UserFooter } from '../components/user/UserFooter';
import { TestimonialsPopup } from '../components/user/TestimonialsPopup';

export function UserLayout() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <TestimonialsPopup />
            <UserNavbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <UserFooter />
        </div>
    );
}

