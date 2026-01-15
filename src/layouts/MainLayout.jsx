import { Outlet, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import {
    Scissors,
    Menu,
    X,
    User,
    LogOut,
    Calendar,
    Phone,
    Instagram,
    Facebook,
    LayoutDashboard,
    Sparkles,
    ArrowLeft
} from 'lucide-react';
import { useState } from 'react';

export default function MainLayout() {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { currentShop, isOpenNow } = useTenant();
    const navigate = useNavigate();
    const { shopSlug } = useParams();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Fallback para shop si no hay currentShop
    const shop = currentShop || {
        name: 'BeautyHub',
        slogan: 'Tu negocio de belleza',
        phone: '',
        address: '',
        email: '',
        description: '',
        contact: {},
        social: {}
    };

    // Extraer shopSlug desde la URL directamente (más confiable que useParams en layouts)
    const pathParts = location.pathname.split('/');
    const urlShopSlug = pathParts[1] === 's' ? pathParts[2] : null;

    // Base path para navegación (si estamos en /s/:shopSlug, usar ese prefijo)
    const basePath = urlShopSlug ? `/s/${urlShopSlug}` : '';

    // Detectar si estamos en un contexto de shop dinámico
    const isInShopContext = location.pathname.startsWith('/s/');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Detectar si es un shop demo (usando URL o datos del shop)
    const isDemo = currentShop?.id === 'shop_demo' || currentShop?.slug === 'demo-barberia' || urlShopSlug === 'demo-barberia';

    return (
        <div className="min-h-screen flex flex-col gradient-dark">
            {/* Demo Banner - Only visible for demo shops */}
            {isDemo && !isAdmin && (
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 px-4">
                    <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-2">
                        <span className="text-sm font-medium flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Estás viendo un <strong>DEMO</strong> de BeautyHub
                        </span>
                        <div className="flex items-center gap-2">
                            <Link
                                to="/registrar-negocio"
                                className="px-4 py-1.5 bg-white text-amber-600 text-sm font-bold rounded-lg hover:bg-white/90 transition-colors"
                            >
                                Crear Mi Negocio
                            </Link>
                            <Link
                                to="/"
                                className="px-4 py-1.5 bg-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/30 transition-colors"
                            >
                                ← BeautyHub
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Banner - Only visible for admins */}
            {isAdmin && (
                <div className="bg-primary text-secondary-dark py-2 px-4">
                    <div className="section-container flex items-center justify-between">
                        <span className="text-sm font-medium">
                            👁️ Estás viendo el sitio como visitante
                        </span>
                        <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-1.5 bg-secondary text-light text-sm font-medium rounded-lg hover:bg-secondary-light transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Volver al Admin
                        </Link>
                    </div>
                </div>
            )}

            {/* Breadcrumb Navigation - Back to BeautyHub */}
            {isInShopContext && !isDemo && (
                <div className="bg-secondary-dark/50 border-b border-primary/10">
                    <div className="section-container py-2">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm text-light/60 hover:text-primary transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>BeautyHub</span>
                            <span className="text-light/40">|</span>
                            <span className="text-light/80">Explorando: {shop.name}</span>
                        </Link>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="sticky top-0 z-50 bg-secondary/95 backdrop-blur-md border-b border-primary/20">
                <div className="section-container">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link to={basePath || '/'} className="flex items-center gap-2 group">
                            <div className="p-2 bg-primary rounded-lg group-hover:animate-pulse-glow transition-all">
                                <Scissors className="w-6 h-6 text-secondary-dark" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-heading font-bold text-light">{shop.name}</h1>
                                <p className="text-xs text-primary">{shop.slogan || (isDemo ? 'Demo de BeautyHub' : '')}</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to={`${basePath}/`} className="btn-ghost">Inicio</Link>
                            <Link to={`${basePath}/servicios`} className="btn-ghost">Servicios</Link>
                            <Link to={`${basePath}/equipo`} className="btn-ghost">{shop.employeeLabel || 'Equipo'}</Link>

                            {isAuthenticated ? (
                                <div className="flex items-center gap-4">
                                    <Link to={`${basePath}/mis-citas`} className="btn-ghost flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Mis Citas
                                    </Link>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-secondary-light rounded-full">
                                        <User className="w-4 h-4 text-primary" />
                                        <span className="text-sm text-light">{user.name}</span>
                                    </div>
                                    <button onClick={handleLogout} className="btn-ghost text-error">
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : isDemo ? (
                                <div className="flex items-center gap-2">
                                    <Link to="/registrar-negocio" className="btn-primary">
                                        Crear Mi Negocio
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link to="/login" className="btn-ghost">Ingresar</Link>
                                </div>
                            )}
                        </nav>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-light hover:text-primary transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-secondary border-b border-primary/20 animate-slide-up">
                        <nav className="section-container py-4 flex flex-col gap-2">
                            <Link to={`${basePath}/`} className="btn-ghost justify-start" onClick={() => setMobileMenuOpen(false)}>
                                Inicio
                            </Link>
                            <Link to={`${basePath}/servicios`} className="btn-ghost justify-start" onClick={() => setMobileMenuOpen(false)}>
                                Servicios
                            </Link>
                            <Link to={`${basePath}/equipo`} className="btn-ghost justify-start" onClick={() => setMobileMenuOpen(false)}>
                                {shop.employeeLabel || 'Equipo'}
                            </Link>

                            <div className="border-t border-primary/20 my-2" />

                            {isAuthenticated ? (
                                <>
                                    <Link to={`${basePath}/mis-citas`} className="btn-ghost justify-start" onClick={() => setMobileMenuOpen(false)}>
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Mis Citas
                                    </Link>
                                    <div className="flex items-center gap-2 px-4 py-2">
                                        <User className="w-4 h-4 text-primary" />
                                        <span className="text-sm text-light">{user.name}</span>
                                    </div>
                                    <button onClick={handleLogout} className="btn-ghost justify-start text-error">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : isDemo ? (
                                <>
                                    <Link to="/registrar-negocio" className="btn-primary justify-center" onClick={() => setMobileMenuOpen(false)}>
                                        Crear Mi Negocio
                                    </Link>
                                    <Link to="/" className="btn-ghost justify-center text-amber-400" onClick={() => setMobileMenuOpen(false)}>
                                        ← Volver a BeautyHub
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="btn-ghost justify-start" onClick={() => setMobileMenuOpen(false)}>
                                        Ingresar
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            {/* Status Bar */}
            <div className={`py-2 text-center text-sm ${isOpenNow() ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                {isOpenNow() ? '🟢 Abierto ahora' : '🔴 Cerrado'}
                {shop.contact?.phone && (
                    <>
                        <span className="ml-2 text-light/60">|</span>
                        <a href={`tel:${shop.contact.phone}`} className="ml-2 hover:underline">
                            <Phone className="w-3 h-3 inline mr-1" />
                            {shop.contact.phone}
                        </a>
                    </>
                )}
            </div>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-secondary-dark border-t border-primary/20">
                <div className="section-container py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-primary rounded-lg">
                                    <Scissors className="w-5 h-5 text-secondary-dark" />
                                </div>
                                <h3 className="text-lg font-heading font-bold text-light">{shop.name}</h3>
                            </div>
                            <p className="text-muted text-sm">{shop.description}</p>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-heading font-semibold text-primary mb-4">Contacto</h4>
                            <ul className="space-y-2 text-sm text-muted">
                                <li>{shop.address}</li>
                                <li>
                                    <a href={`tel:${shop.phone}`} className="hover:text-primary transition-colors">
                                        {shop.phone}
                                    </a>
                                </li>
                                <li>
                                    <a href={`mailto:${shop.email}`} className="hover:text-primary transition-colors">
                                        {shop.email}
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Social */}
                        {(shop.social?.instagram || shop.social?.facebook) && (
                            <div>
                                <h4 className="font-heading font-semibold text-primary mb-4">Síguenos</h4>
                                <div className="flex gap-4">
                                    {shop.social?.instagram && (
                                        <a
                                            href={shop.social.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-secondary rounded-lg hover:bg-primary hover:text-secondary-dark transition-all"
                                        >
                                            <Instagram className="w-5 h-5" />
                                        </a>
                                    )}
                                    {shop.social?.facebook && (
                                        <a
                                            href={shop.social.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-secondary rounded-lg hover:bg-primary hover:text-secondary-dark transition-all"
                                        >
                                            <Facebook className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-8 border-t border-primary/10 text-center text-sm text-muted">
                        <p>© {new Date().getFullYear()} {shop.name}. Todos los derechos reservados.</p>
                        <p className="mt-2 flex items-center justify-center gap-1">
                            <span>Powered by</span>
                            <Link to="/" className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors">
                                <Sparkles className="w-4 h-4" />
                                BeautyHub
                            </Link>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
