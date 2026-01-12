import { useData } from '../../context/DataContext';
import { Link, useLocation } from 'react-router-dom';
import {
    Star,
    Calendar,
    Briefcase,
    Phone,
    ChevronRight
} from 'lucide-react';

export default function BarbersPage() {
    const { barbers } = useData();
    const location = useLocation();

    // Extraer basePath desde URL para mantener contexto del shop
    const pathParts = location.pathname.split('/');
    const basePath = pathParts[1] === 's' && pathParts[2] ? `/s/${pathParts[2]}` : '';

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-secondary-light/30 py-16 md:py-24">
                <div className="section-container text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-light mb-4">
                        Nuestro <span className="text-gradient">Equipo</span>
                    </h1>
                    <p className="text-muted max-w-2xl mx-auto text-lg">
                        Profesionales experimentados y apasionados por su trabajo, listos para darte el mejor servicio
                    </p>
                </div>
            </section>

            {/* Barbers Grid */}
            <section className="section-container py-16">
                {barbers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {barbers.map((barber, index) => (
                            <div
                                key={barber.id}
                                className="card p-8 text-center group hover:border-primary/50 animate-scale-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Avatar */}
                                <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-4xl font-heading font-bold text-secondary-dark">
                                        {barber.name.charAt(0)}
                                    </span>
                                </div>

                                {/* Info */}
                                <h3 className="font-heading font-bold text-light text-2xl mb-2">
                                    {barber.name}
                                </h3>
                                <p className="text-primary font-medium mb-4">
                                    {barber.specialty || 'Barbero Profesional'}
                                </p>

                                {/* Rating */}
                                <div className="flex items-center justify-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-warning fill-current" />
                                    ))}
                                </div>

                                {/* Details */}
                                <div className="space-y-2 text-sm text-muted mb-6">
                                    {barber.experience && (
                                        <div className="flex items-center justify-center gap-2">
                                            <Briefcase className="w-4 h-4 text-primary" />
                                            <span>{barber.experience} años de experiencia</span>
                                        </div>
                                    )}
                                    {barber.phone && (
                                        <div className="flex items-center justify-center gap-2">
                                            <Phone className="w-4 h-4 text-primary" />
                                            <span>{barber.phone}</span>
                                        </div>
                                    )}
                                </div>

                                {/* CTA */}
                                <Link
                                    to={`${basePath}/reservar`}
                                    className="btn-primary w-full"
                                >
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Reservar con {barber.name.split(' ')[0]}
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary-light flex items-center justify-center">
                            <span className="text-4xl">👤</span>
                        </div>
                        <h3 className="text-xl font-heading font-semibold text-light mb-2">
                            Próximamente
                        </h3>
                        <p className="text-muted text-lg mb-6">
                            Nuestro equipo se está preparando para atenderte
                        </p>
                        <Link to={basePath || '/'} className="btn-outline">
                            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                            Volver al Inicio
                        </Link>
                    </div>
                )}
            </section>

            {/* Join Team CTA (optional) */}
            <section className="bg-secondary-light/50 py-16">
                <div className="section-container text-center">
                    <h2 className="text-2xl font-heading font-bold text-light mb-4">
                        ¿Eres barbero profesional?
                    </h2>
                    <p className="text-muted mb-6 max-w-lg mx-auto">
                        Estamos siempre buscando talento. Contáctanos para formar parte de nuestro equipo.
                    </p>
                    <a
                        href="mailto:contacto@barberia.com"
                        className="btn-outline"
                    >
                        Contáctanos
                    </a>
                </div>
            </section>
        </div>
    );
}
