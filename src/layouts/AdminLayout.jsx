import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { useData } from '../context/DataContext';
import {
    Scissors,
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    LogOut,
    Menu,
    X,
    Bell
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const { shop } = useShop();
    const { getTodayAppointments } = useData();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const todayAppointments = getTodayAppointments();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { path: '/admin/barberos', icon: Users, label: 'Barberos' },
        { path: '/admin/citas', icon: Calendar, label: 'Citas' },
        { path: '/admin/servicios', icon: Settings, label: 'Servicios' },
    ];

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen flex bg-secondary-dark">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-secondary border-r border-primary/20">
                {/* Logo */}
                <div className="p-6 border-b border-primary/20">
                    <Link to="/admin" className="flex items-center gap-3">
                        <div className="p-2 bg-primary rounded-lg">
                            <Scissors className="w-6 h-6 text-secondary-dark" />
                        </div>
                        <div>
                            <h1 className="font-heading font-bold text-light">Admin</h1>
                            <p className="text-xs text-primary">{shop.name}</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path, item.exact)
                                    ? 'bg-primary text-secondary-dark'
                                    : 'text-muted hover:text-light hover:bg-secondary-light'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                            {item.label === 'Citas' && todayAppointments.length > 0 && (
                                <span className="ml-auto px-2 py-0.5 text-xs bg-error rounded-full text-white">
                                    {todayAppointments.length}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-primary/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-secondary-dark font-bold">
                                {user?.name?.charAt(0) || 'A'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-light">{user?.name}</p>
                            <p className="text-xs text-muted">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-secondary transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                {/* Same content as desktop sidebar */}
                <div className="p-6 border-b border-primary/20 flex items-center justify-between">
                    <Link to="/admin" className="flex items-center gap-3">
                        <div className="p-2 bg-primary rounded-lg">
                            <Scissors className="w-6 h-6 text-secondary-dark" />
                        </div>
                        <div>
                            <h1 className="font-heading font-bold text-light">Admin</h1>
                            <p className="text-xs text-primary">{shop.name}</p>
                        </div>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="text-muted hover:text-light">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path, item.exact)
                                    ? 'bg-primary text-secondary-dark'
                                    : 'text-muted hover:text-light hover:bg-secondary-light'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-primary/20">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-secondary/95 backdrop-blur-md border-b border-primary/20">
                    <div className="flex items-center justify-between px-4 md:px-6 h-16">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 text-muted hover:text-light transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <h2 className="text-lg font-heading font-semibold text-light">
                            Panel de Administración
                        </h2>

                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-muted hover:text-light transition-colors">
                                <Bell className="w-5 h-5" />
                                {todayAppointments.length > 0 && (
                                    <span className="absolute top-0 right-0 w-4 h-4 bg-error rounded-full text-xs text-white flex items-center justify-center">
                                        {todayAppointments.length}
                                    </span>
                                )}
                            </button>
                            <Link to="/" className="text-sm text-primary hover:underline">
                                Ver Sitio
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
