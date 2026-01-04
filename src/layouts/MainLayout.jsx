import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import {
    Scissors,
    Menu,
    X,
    User,
    LogOut,
    Calendar,
    Phone,
    Instagram,
    Facebook
} from 'lucide-react';
import { useState } from 'react';

export default function MainLayout() {
    const { user, logout, isAuthenticated } = useAuth();
    const { shop, isOpenNow } = useShop();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col gradient-dark">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-secondary/95 backdrop-blur-md border-b border-primary/20">
                <div className="section-container">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="p-2 bg-primary rounded-lg group-hover:animate-pulse-glow transition-all">
                                <Scissors className="w-6 h-6 text-secondary-dark" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-heading font-bold text-light">{shop.name}</h1>
                                <p className="text-xs text-primary">{shop.slogan}</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/" className="btn-ghost">Inicio</Link>
                            <Link to="/servicios" className="btn-ghost">Servicios</Link>
                            <Link to="/barberos" className="btn-ghost">Barberos</Link>

                            {isAuthenticated ? (
                                <div className="flex items-center gap-4">
                                    <Link to="/mis-citas" className="btn-ghost flex items-center gap-2">
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
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link to="/login" className="btn-ghost">Ingresar</Link>
                                    <Link to="/registro" className="btn-primary">Registrarse</Link>
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
                            <Link to="/" className="btn-ghost justify-start" onClick={() => setMobileMenuOpen(false)}>
                                Inicio
                            </Link>
                            <Link to="/servicios" className="btn-ghost justify-start" onClick={() => setMobileMenuOpen(false)}>
                                Servicios
                            </Link>
                            <Link to="/barberos" className="btn-ghost justify-start" onClick={() => setMobileMenuOpen(false)}>
                                Barberos
                            </Link>

                            <div className="border-t border-primary/20 my-2" />

                            {isAuthenticated ? (
                                <>
                                    <Link to="/mis-citas" className="btn-ghost justify-start" onClick={() => setMobileMenuOpen(false)}>
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
                            ) : (
                                <>
                                    <Link to="/login" className="btn-ghost justify-start" onClick={() => setMobileMenuOpen(false)}>
                                        Ingresar
                                    </Link>
                                    <Link to="/registro" className="btn-primary justify-center" onClick={() => setMobileMenuOpen(false)}>
                                        Registrarse
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
                <span className="ml-2 text-light/60">|</span>
                <a href={`tel:${shop.phone}`} className="ml-2 hover:underline">
                    <Phone className="w-3 h-3 inline mr-1" />
                    {shop.phone}
                </a>
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
                        <div>
                            <h4 className="font-heading font-semibold text-primary mb-4">Síguenos</h4>
                            <div className="flex gap-4">
                                <a
                                    href={shop.social.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-secondary rounded-lg hover:bg-primary hover:text-secondary-dark transition-all"
                                >
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a
                                    href={shop.social.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-secondary rounded-lg hover:bg-primary hover:text-secondary-dark transition-all"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-primary/10 text-center text-sm text-muted">
                        <p>© {new Date().getFullYear()} {shop.name}. Todos los derechos reservados.</p>
                        <p className="mt-1">Desarrollado con ❤️ por AppBalbert</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
