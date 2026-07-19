import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserLayout } from './layouts/UserLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { Homepage } from './pages/user/Homepage';
import { GiveawayDetailsPage } from './pages/user/GiveawayDetailsPage';
import { RulesPageContent } from './pages/user/RulesPage';
import { WinnersPage } from './pages/user/WinnersPage';
import { ClaimForm } from './pages/user/ClaimForm';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ApplicantsPage } from './pages/admin/ApplicantsPage';
import { AdminWinnersPage } from './pages/admin/AdminWinnersPage';
import { CreateGiveaway } from './pages/admin/CreateGiveaway';
import { EmailTemplateSettingsPage } from './pages/admin/EmailTemplateSettingsPage';

import { AdminLogin } from './pages/admin/AdminLogin';
import { TestimonialPopup } from './components/shared/TestimonialPopup';
import { TermsPage } from './pages/user/TermsPage';

function RequireAdmin({ children }) {
    const isAdmin = String(localStorage.getItem('isAdmin')) === 'true';
    return isAdmin ? children : <Navigate to="/admin/login" replace />;
}





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
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/claim/:entryId" element={<ClaimForm />} />

                </Route>

                {/* Admin Login Route (public) */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <RequireAdmin>
                            <AdminLayout />
                        </RequireAdmin>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path="applicants" element={<ApplicantsPage />} />
                    <Route path="winners" element={<AdminWinnersPage />} />
                    <Route path="email-template" element={<EmailTemplateSettingsPage />} />
                    <Route path="create" element={<CreateGiveaway />} />
                </Route>





                {/* Catch All */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Global popup shown on every page */}
            <TestimonialPopup />
        </BrowserRouter>
    );
}

export default App;


