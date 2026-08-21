import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserLayout } from './layouts/UserLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { TestimonialPopup } from './components/shared/TestimonialPopup';

const Homepage = React.lazy(() => import('./pages/user/Homepage').then(m => ({ default: m.Homepage })));
const GiveawayDetailsPage = React.lazy(() => import('./pages/user/GiveawayDetailsPage').then(m => ({ default: m.GiveawayDetailsPage })));
const RulesPageContent = React.lazy(() => import('./pages/user/RulesPage').then(m => ({ default: m.RulesPageContent })));
const WinnersPage = React.lazy(() => import('./pages/user/WinnersPage').then(m => ({ default: m.WinnersPage })));
const ClaimForm = React.lazy(() => import('./pages/user/ClaimForm').then(m => ({ default: m.ClaimForm })));
const TermsPage = React.lazy(() => import('./pages/user/TermsPage').then(m => ({ default: m.TermsPage })));

const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const ApplicantsPage = React.lazy(() => import('./pages/admin/ApplicantsPage').then(m => ({ default: m.ApplicantsPage })));
const AdminWinnersPage = React.lazy(() => import('./pages/admin/AdminWinnersPage').then(m => ({ default: m.AdminWinnersPage })));
const CreateGiveaway = React.lazy(() => import('./pages/admin/CreateGiveaway').then(m => ({ default: m.CreateGiveaway })));
const EmailTemplateSettingsPage = React.lazy(() => import('./pages/admin/EmailTemplateSettingsPage').then(m => ({ default: m.EmailTemplateSettingsPage })));
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));

function RequireAdmin({ children }) {
    const isAdmin = String(localStorage.getItem('isAdmin')) === 'true';
    return isAdmin ? children : <Navigate to="/admin/login" replace />;
}

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={
                <div className="min-h-screen bg-black flex items-center justify-center">
                    <div className="text-white text-xl font-bold">Loading...</div>
                </div>
            }>
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
            </Suspense>

            {/* Global popup shown on every page */}
            <TestimonialPopup />
        </BrowserRouter>
    );
}

export default App;


