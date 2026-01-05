import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Providers
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ShopProvider } from './context/ShopContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

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

function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <AuthProvider>
          <DataProvider>
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1A1A2E',
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
              {/* Auth Routes */}
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

              {/* Public/User Routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
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
                {/* 404 - Keep inside MainLayout */}
                <Route path="*" element={<Home />} />
              </Route>

              {/* Admin Routes */}
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
              </Route>
            </Routes>
          </DataProvider>
        </AuthProvider>
      </ShopProvider>
    </BrowserRouter>
  );
}

export default App;
