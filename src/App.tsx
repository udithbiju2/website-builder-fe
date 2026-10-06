import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "./auth/AuthProvider.tsx";
import { GuestOnly, RequireAuth } from "./auth/RouteGuards.tsx";
import BuilderRoute from "./features/builder/BuilderRoute.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import ClientLayout from "./layouts/ClientLayout.tsx";
import PublicLayout from "./layouts/PublicLayout.tsx";
import AllWebsitesPage from "./pages/admin/AllWebsitesPage.tsx";
import ClientFormPage from "./pages/admin/ClientFormPage.tsx";
import ClientsPage from "./pages/admin/ClientsPage.tsx";
import EmailSettingsPage from "./pages/admin/EmailSettingsPage.tsx";
import SectionLibraryPage from "./pages/admin/SectionLibraryPage.tsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.tsx";
import SignupPage from "./pages/auth/SignupPage.tsx";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage.tsx";
import DashboardPage from "./pages/client/DashboardPage.tsx";
import MediaLibraryPage from "./pages/media/MediaLibraryPage.tsx";
import LandingPage from "./pages/public/LandingPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import CreateWebsitePage from "./pages/websites/CreateWebsitePage.tsx";
import WebsitePreviewPage from "./pages/websites/WebsitePreviewPage.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route element={<GuestOnly />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
          </Route>
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />

          <Route element={<RequireAuth roles={["CLIENT"]} />}>
            <Route element={<ClientLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="media" element={<MediaLibraryPage />} />
            </Route>
          </Route>

          <Route element={<RequireAuth roles={["CLIENT", "SUPER_ADMIN"]} />}>
            <Route path="websites/new" element={<CreateWebsitePage />} />
            <Route path="websites/:id/preview" element={<WebsitePreviewPage />} />
            <Route path="websites/:id/edit" element={<BuilderRoute />} />
          </Route>

          <Route element={<RequireAuth roles={["SUPER_ADMIN"]} />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<ClientsPage />} />
              <Route path="clients/new" element={<ClientFormPage />} />
              <Route path="clients/:id" element={<ClientFormPage />} />
              <Route path="websites" element={<AllWebsitesPage />} />
              <Route path="sections" element={<SectionLibraryPage />} />
              <Route path="media" element={<MediaLibraryPage />} />
              <Route path="settings/email" element={<EmailSettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
