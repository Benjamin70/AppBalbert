import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Providers
import { TenantProvider } from './context/TenantContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ShopLayout from './layouts/ShopLayout';

// Components
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

// Pages - Auth
import Login from './pages/Login';
import Register from './pages/Register';

// Pages - User
import Home from './pages/user/Home';
import Booking from './pages/user/Booking';
import MyAppointments from './pages/user/MyAppointments';
import ServicesPage from './pages/user/Services';
import BarbersPage from './pages/user/Barbers';

// Pages - Admin
import Dashboard from './pages/admin/Dashboard';
import Barbers from './pages/admin/Barbers';
import AdminAppointments from './pages/admin/Appointments';
import AdminServices from './pages/admin/Services';
import AdminClients from './pages/admin/Clients';
import Inventory from './pages/admin/Inventory';
import Analytics from './pages/admin/Analytics';
import Reviews from './pages/admin/Reviews';
import Loyalty from './pages/admin/Loyalty';
import Gallery from './pages/admin/Gallery';
import GiftCards from './pages/admin/GiftCards';
import AdminSettings from './pages/admin/Settings';

// Pages - SaaS
import LandingPage from './pages/saas/LandingPage';
import RegisterBusiness from './pages/saas/RegisterBusiness';
import Pricing from './pages/saas/Pricing';

// Utils
import { initializeDemoData } from './utils/demoData';

// Initialize demo data on first load
initializeDemoData();

function App() {
  return (
    <BrowserRouter>
      <TenantProvider>
        <AuthProvider>
          <DataProvider>
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--color-secondary, #1A1A2E)',
                  color: '#F8F9FA',
                  border: '1px solid rgba(212, 165, 116, 0.2)',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#F8F9FA',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#F8F9FA',
                  },
                },
              }}
            />

            <Routes>
              {/* ============ SaaS Routes (sin shop) ============ */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/registrar-negocio" element={<RegisterBusiness />} />
              <Route path="/precios" element={<Pricing />} />

              {/* ============ Auth Routes ============ */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/registro"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              {/* ============ Shop Routes (con MainLayout) ============ */}
              {/* Ruta temporal para demo (sin slug) */}
              <Route element={<MainLayout />}>
                <Route path="/inicio" element={<Home />} />
                <Route path="/servicios" element={<ServicesPage />} />
                <Route path="/barberos" element={<BarbersPage />} />
                <Route
                  path="/reservar"
                  element={
                    <ProtectedRoute>
                      <Booking />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mis-citas"
                  element={
                    <ProtectedRoute>
                      <MyAppointments />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* ============ Dynamic Shop Routes (/s/:shopSlug) ============ */}
              <Route path="/s/:shopSlug" element={<ShopLayout />}>
                <Route index element={<Home />} />
                <Route path="servicios" element={<ServicesPage />} />
                <Route path="equipo" element={<BarbersPage />} />
                <Route
                  path="reservar"
                  element={
                    <ProtectedRoute>
                      <Booking />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="mis-citas"
                  element={
                    <ProtectedRoute>
                      <MyAppointments />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* ============ Admin Routes ============ */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="barberos" element={<Barbers />} />
                <Route path="citas" element={<AdminAppointments />} />
                <Route path="servicios" element={<AdminServices />} />
                <Route path="clientes" element={<AdminClients />} />
                {/* Phase 2 Routes */}
                <Route path="inventario" element={<Inventory />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="resenas" element={<Reviews />} />
                <Route path="fidelidad" element={<Loyalty />} />
                <Route path="galeria" element={<Gallery />} />
                <Route path="gift-cards" element={<GiftCards />} />
                {/* Phase 3 Routes */}
                <Route path="configuracion" element={<AdminSettings />} />
              </Route>

              {/* 404 - Redirect to landing */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </TenantProvider>
    </BrowserRouter>
  );
}

export default App;
