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
    Gem
} from 'lucide-react';

export default function LandingPage() {
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
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-8 h-8 text-amber-400" />
                        <span className="text-2xl font-bold text-white">BeautyHub</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            Iniciar Sesión
                        </Link>
                        <Link
                            to="/registrar-negocio"
                            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-full font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/25"
                        >
                            Crear Mi Negocio
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">Tu sistema de reservas profesional</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
                        Digitaliza tu negocio de{' '}
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                            belleza
                        </span>
                    </h1>

                    <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
                        Gestiona reservas, clientes, empleados e inventario desde una sola plataforma.
                        Personaliza tu marca y empieza a crecer hoy.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/registrar-negocio"
                            className="group bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-2xl shadow-amber-500/30 flex items-center justify-center gap-2"
                        >
                            Comenzar Gratis
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/inicio"
                            className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all border border-white/20"
                        >
                            Ver Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Business Types */}
            <section className="py-16 px-4 border-t border-white/10">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-white/40 mb-8">Perfecto para cualquier negocio de belleza</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {businessTypes.map((type, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-full border border-white/10"
                            >
                                <span className="text-amber-400">{type.icon}</span>
                                <span className="text-white/80">{type.name}</span>
                            </div>
                        ))}
                        <div className="flex items-center gap-2 bg-amber-500/20 px-6 py-3 rounded-full border border-amber-500/30">
                            <span className="text-amber-400">+</span>
                            <span className="text-amber-400">Y mucho más...</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
                        Todo lo que necesitas
                    </h2>
                    <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
                        Herramientas profesionales para hacer crecer tu negocio
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-amber-500/50 transition-all group"
                            >
                                <div className="text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
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

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl p-12 text-center border border-amber-500/30">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        ¿Listo para empezar?
                    </h2>
                    <p className="text-white/60 mb-8 max-w-xl mx-auto">
                        Crea tu cuenta gratis en menos de 2 minutos. Sin tarjeta de crédito.
                    </p>
                    <ul className="flex flex-wrap justify-center gap-4 mb-8 text-white/80">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span>Plan gratuito disponible</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span>Configuración en minutos</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span>Soporte incluido</span>
                        </li>
                    </ul>
                    <Link
                        to="/registrar-negocio"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-2xl shadow-amber-500/30"
                    >
                        Crear Mi Negocio Gratis
                        <ChevronRight className="w-5 h-5" />
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
