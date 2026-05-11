import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserLayout } from './layouts/UserLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { Homepage } from './pages/user/Homepage';
import { GiveawayDetailsPage } from './pages/user/GiveawayDetailsPage';
import { RulesPageContent } from './pages/user/RulesPage';
import { WinnersPage } from './pages/user/WinnersPage';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ApplicantsPage } from './pages/admin/ApplicantsPage';
import { AdminWinnersPage } from './pages/admin/AdminWinnersPage';
import { CreateGiveaway } from './pages/admin/CreateGiveaway';
import { EmailTemplateSettingsPage } from './pages/admin/EmailTemplateSettingsPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* User Routes */}
                <Route element={<UserLayout />}>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/giveaway/:id" element={<GiveawayDetailsPage />} />
                    <Route path="/winners" element={<WinnersPage />} />
                    <Route path="/rules" element={<RulesPageContent />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/applicants" element={<ApplicantsPage />} />
                    <Route path="/admin/winners" element={<AdminWinnersPage />} />
                    <Route path="/admin/email-template" element={<EmailTemplateSettingsPage />} />
                    <Route path="/admin/create" element={<CreateGiveaway />} />
                </Route>

                {/* Catch All */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
