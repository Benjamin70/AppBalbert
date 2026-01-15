import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Sparkles,
    Palette,
    BarChart3,
    Users,
    Calendar,
    Star,
    ChevronRight,
    CheckCircle2,
    Scissors,
    Heart,
    Gem,
    ArrowRight,
    Menu,
    X
} from 'lucide-react';

export default function LandingPage() {
    const [shops, setShops] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const shopsData = JSON.parse(localStorage.getItem('beautyhub_shops') || '[]');
        // Filtrar el shop demo del directorio
        const realShops = shopsData.filter(shop => shop.id !== 'shop_demo' && shop.slug !== 'demo-barberia');
        setShops(realShops);
    }, []);
    const features = [
        {
            icon: <Palette className="w-8 h-8" />,
            title: 'Tu Marca, Tu Estilo',
            description: 'Logo generado automáticamente y colores personalizables para tu negocio'
        },
        {
            icon: <Calendar className="w-8 h-8" />,
            title: 'Reservas Online 24/7',
            description: 'Tus clientes pueden reservar en cualquier momento, desde cualquier lugar'
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: 'Gestión de Equipo',
            description: 'Administra tu personal con comisiones y horarios personalizados'
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: 'Reportes Inteligentes',
            description: 'Estadísticas de ingresos, servicios populares y más'
        },
        {
            icon: <Star className="w-8 h-8" />,
            title: 'Fidelización',
            description: 'Sistema de puntos para recompensar a tus clientes frecuentes'
        },
        {
            icon: <Heart className="w-8 h-8" />,
            title: 'Multi-Negocio',
            description: 'Barberías, Salones, Uñas, Spas y más - ¡Tú decides!'
        },
    ];

    const businessTypes = [
        { icon: <Scissors />, name: 'Barbería' },
        { icon: <Sparkles />, name: 'Salón de Belleza' },
        { icon: <Gem />, name: 'Estudio de Uñas' },
        { icon: <Heart />, name: 'Spa & Wellness' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e]">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-4 flex justify-between items-center">
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
                        <span className="text-lg md:text-2xl font-bold text-white">BeautyHub</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-2 md:gap-4">
                        <Link
                            to="/precios"
                            className="text-sm md:text-base text-white/60 hover:text-white transition-colors"
                        >
                            Precios
                        </Link>
                        <Link
                            to="/login"
                            className="text-sm md:text-base text-white/80 hover:text-white transition-colors"
                        >
                            Iniciar Sesión
                        </Link>
                        <Link
                            to="/registrar-negocio"
                            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full font-semibold text-sm md:text-base hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/25"
                        >
                            Crear Mi Negocio
                        </Link>
                    </div>

                    {/* Mobile Menu Button + CTA */}
                    <div className="md:hidden flex items-center gap-2">
                        <Link
                            to="/registrar-negocio"
                            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1.5 rounded-full font-semibold text-sm hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/25"
                        >
                            Crear Negocio
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-white hover:text-amber-400 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/10 animate-slide-up">
                        <div className="px-4 py-4 flex flex-col gap-3">
                            <Link
                                to="/precios"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-white/80 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
                            >
                                Precios
                            </Link>
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-white/80 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                to="/s/demo-barberia"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-white/80 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
                            >
                                Ver Demo
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-20 md:pt-32 pb-12 md:pb-20 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-4 md:mb-6">
                        <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-xs md:text-sm font-medium">Tu sistema de reservas profesional</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-4 md:mb-6 px-2">
                        Digitaliza tu negocio de{' '}
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                            belleza
                        </span>
                    </h1>

                    <p className="text-base md:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto mb-6 md:mb-10 px-4">
                        Gestiona reservas, clientes, empleados e inventario desde una sola plataforma.
                        Personaliza tu marca y empieza a crecer hoy.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
                        <Link
                            to="/registrar-negocio"
                            className="group bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-2xl shadow-amber-500/30 flex items-center justify-center gap-2"
                        >
                            Comenzar Gratis
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/s/demo-barberia"
                            className="bg-white/10 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-white/20 transition-all border border-white/20"
                        >
                            Ver Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Business Types */}
            <section className="py-12 md:py-16 px-4 border-t border-white/10">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-sm md:text-base text-white/40 mb-6 md:mb-8">Perfecto para cualquier negocio de belleza</p>
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                        {businessTypes.map((type, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 bg-white/5 px-4 md:px-6 py-2 md:py-3 rounded-full border border-white/10 text-sm md:text-base"
                            >
                                <span className="text-amber-400">{type.icon}</span>
                                <span className="text-white/80">{type.name}</span>
                            </div>
                        ))}
                        <div className="flex items-center gap-2 bg-amber-500/20 px-4 md:px-6 py-2 md:py-3 rounded-full border border-amber-500/30 text-sm md:text-base">
                            <span className="text-amber-400">+</span>
                            <span className="text-amber-400">Y mucho más...</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-12 md:py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-3 md:mb-4 px-4">
                        Todo lo que necesitas
                    </h2>
                    <p className="text-sm md:text-base text-white/60 text-center mb-8 md:mb-12 max-w-2xl mx-auto px-4">
                        Herramientas profesion ales para hacer crecer tu negocio
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="bg-white/5 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-white/10 hover:border-amber-500/50 transition-all group"
                            >
                                <div className="text-amber-400 mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-white/60">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Business Directory Section */}
            {shops.length > 0 && (
                <section className="py-12 md:py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-8 md:mb-12">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 px-4">
                                Descubre negocios cerca de ti
                            </h2>
                            <p className="text-sm md:text-base lg:text-lg text-white/60 max-w-2xl mx-auto px-4">
                                Explora nuestros negocios registrados y agenda tu próxima cita
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {shops.map((shop) => {
                                const getBusinessIcon = (type) => {
                                    switch (type) {
                                        case 'barberia': return <Scissors className="w-6 h-6" />;
                                        case 'salon': return <Sparkles className="w-6 h-6" />;
                                        case 'nails': return <Gem className="w-6 h-6" />;
                                        case 'spa': return <Heart className="w-6 h-6" />;
                                        default: return <Scissors className="w-6 h-6" />;
                                    }
                                };

                                const getBusinessLabel = (type) => {
                                    switch (type) {
                                        case 'barberia': return 'Barbería';
                                        case 'salon': return 'Salón de Belleza';
                                        case 'nails': return 'Estudio de Uñas';
                                        case 'spa': return 'Spa & Wellness';
                                        default: return 'Negocio';
                                    }
                                };

                                return (
                                    <div
                                        key={shop.id}
                                        className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/10 group"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            {shop.logo ? (
                                                <img
                                                    src={shop.logo}
                                                    alt={shop.name}
                                                    className="w-16 h-16 rounded-xl object-cover"
                                                />
                                            ) : (
                                                <div
                                                    className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl text-white"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${shop.theme?.primary || '#D4A574'}, ${shop.theme?.accent || '#E8C99B'})`
                                                    }}
                                                >
                                                    {shop.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                                                    {shop.name}
                                                </h3>
                                                <div className="flex items-center gap-1 text-amber-400 text-sm">
                                                    {getBusinessIcon(shop.businessType)}
                                                    <span>{getBusinessLabel(shop.businessType)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {shop.description && (
                                            <p className="text-white/60 text-sm mb-4 line-clamp-2">
                                                {shop.description}
                                            </p>
                                        )}

                                        <Link
                                            to={`/s/${shop.slug}`}
                                            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 px-4 py-3 rounded-xl font-semibold hover:from-amber-500 hover:to-orange-500 hover:text-white transition-all group-hover:shadow-lg"
                                        >
                                            Visitar negocio
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-12 md:py-20 px-4">
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl md:rounded-3xl p-6 md:p-12 text-center border border-amber-500/30">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                        ¿Listo para empezar?
                    </h2>
                    <p className="text-sm md:text-base text-white/60 mb-6 md:mb-8 max-w-xl mx-auto px-2">
                        Crea tu cuenta gratis en menos de 2 minutos. Sin tarjeta de crédito.
                    </p>
                    <ul className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6 md:mb-8 text-sm md:text-base text-white/80">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                            <span>Plan gratuito</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                            <span>Configuración rápida</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                            <span>Soporte incluido</span>
                        </li>
                    </ul>
                    <Link
                        to="/registrar-negocio"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 md:px-10 md:py-4 rounded-xl font-bold text-base md:text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-2xl shadow-amber-500/30"
                    >
                        <span className="hidden sm:inline">Crear Mi Negocio Gratis</span>
                        <span className="sm:hidden">Crear Gratis</span>
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-amber-400" />
                        <span className="text-lg font-bold text-white">BeautyHub</span>
                    </div>
                    <p className="text-white/40 text-sm">
                        © 2026 BeautyHub. Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}
