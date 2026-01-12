import { Link, useLocation } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
    Scissors,
    Calendar,
    Clock,
    Star,
    ChevronRight,
    Award,
    Users,
    CheckCircle
} from 'lucide-react';

export default function Home() {
    const { currentShop, formatPrice } = useTenant();
    const { barbers, services } = useData();
    const { isAuthenticated } = useAuth();

    // Fallback para shop
    const shop = currentShop || {
        name: 'BeautyHub',
        description: 'Tu negocio de belleza profesional'
    };

    // Extraer basePath desde URL para mantener contexto del shop
    const location = useLocation();
    const pathParts = location.pathname.split('/');
    const basePath = pathParts[1] === 's' && pathParts[2] ? `/s/${pathParts[2]}` : '';

    // Mostrar solo algunos servicios destacados
    const featuredServices = services.slice(0, 4);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A574' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="section-container section-padding relative">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-6 animate-fade-in">
                            <Star className="w-4 h-4 text-primary" />
                            <span className="text-sm text-primary font-medium">La mejor barbería de la ciudad</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-light mb-6 animate-slide-up">
                            Tu Estilo,{' '}
                            <span className="text-gradient">Nuestra Pasión</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-muted mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            {shop.description}. Reserva tu cita en segundos y disfruta de una experiencia premium.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <Link
                                to={isAuthenticated ? `${basePath}/reservar` : "/login"}
                                className="btn-primary px-8 py-4 text-lg w-full sm:w-auto"
                            >
                                <Calendar className="w-5 h-5 mr-2" />
                                Reservar Ahora
                            </Link>
                            <Link to={`${basePath}/servicios`} className="btn-outline px-8 py-4 text-lg w-full sm:w-auto">
                                Ver Servicios
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-heading font-bold text-primary">5+</div>
                                <div className="text-sm text-muted">Años de experiencia</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-heading font-bold text-primary">1000+</div>
                                <div className="text-sm text-muted">Clientes satisfechos</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-heading font-bold text-primary">4.9</div>
                                <div className="text-sm text-muted">Calificación</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Preview */}
            <section className="section-container section-padding">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-light mb-4">
                        Nuestros <span className="text-gradient">Servicios</span>
                    </h2>
                    <p className="text-muted max-w-2xl mx-auto">
                        Ofrecemos una amplia gama de servicios de barbería con los más altos estándares de calidad
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredServices.map((service, index) => (
                        <div
                            key={service.id}
                            className="card p-6 group hover:border-primary/50 animate-slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                                <Scissors className="w-6 h-6 text-primary group-hover:text-secondary-dark" />
                            </div>
                            <h3 className="font-heading font-semibold text-light text-lg mb-2">{service.name}</h3>
                            <p className="text-sm text-muted mb-4">{service.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-primary font-bold text-lg">{formatPrice(service.price)}</span>
                                <span className="text-sm text-muted flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {service.duration} min
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <Link to={`${basePath}/servicios`} className="btn-outline inline-flex items-center gap-2">
                        Ver todos los servicios
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* Barbers Preview */}
            {barbers.length > 0 && (
                <section className="bg-secondary-light/50 section-padding">
                    <div className="section-container">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-light mb-4">
                                Nuestro <span className="text-gradient">Equipo</span>
                            </h2>
                            <p className="text-muted max-w-2xl mx-auto">
                                Profesionales experimentados listos para darte el mejor servicio
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {barbers.slice(0, 3).map((barber, index) => (
                                <div
                                    key={barber.id}
                                    className="card p-6 text-center animate-scale-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                        <span className="text-3xl font-heading font-bold text-secondary-dark">
                                            {barber.name.charAt(0)}
                                        </span>
                                    </div>
                                    <h3 className="font-heading font-semibold text-light text-xl mb-1">{barber.name}</h3>
                                    <p className="text-primary text-sm mb-3">{barber.specialty || 'Barbero Profesional'}</p>
                                    <div className="flex items-center justify-center gap-1 text-warning">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-current" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {barbers.length > 3 && (
                            <div className="text-center mt-8">
                                <Link to={`${basePath}/equipo`} className="btn-outline inline-flex items-center gap-2">
                                    Ver todo el equipo
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Why Choose Us */}
            <section className="section-container section-padding">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-light mb-6">
                            ¿Por qué <span className="text-gradient">elegirnos</span>?
                        </h2>

                        <div className="space-y-6">
                            {[
                                { icon: Award, title: 'Calidad Premium', desc: 'Utilizamos productos de la más alta calidad para cuidar tu cabello y barba' },
                                { icon: Users, title: 'Profesionales Expertos', desc: 'Nuestro equipo está altamente capacitado y en constante actualización' },
                                { icon: Clock, title: 'Puntualidad', desc: 'Respetamos tu tiempo con un sistema de citas eficiente' },
                                { icon: CheckCircle, title: 'Satisfacción Garantizada', desc: 'Tu satisfacción es nuestra prioridad número uno' },
                            ].map((item, index) => (
                                <div key={index} className="flex gap-4 animate-slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                                        <item.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-semibold text-light mb-1">{item.title}</h3>
                                        <p className="text-sm text-muted">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center animate-float">
                            <Scissors className="w-32 h-32 text-primary/50" />
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/30 rounded-full blur-2xl" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/30 rounded-full blur-2xl" />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-primary to-accent section-padding">
                <div className="section-container text-center">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary-dark mb-4">
                        ¿Listo para un nuevo look?
                    </h2>
                    <p className="text-secondary/80 mb-8 max-w-xl mx-auto">
                        Reserva tu cita ahora y experimenta el servicio de barbería que mereces
                    </p>
                    <Link
                        to={isAuthenticated ? `${basePath}/reservar` : "/registro"}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-light font-semibold rounded-lg hover:bg-secondary-dark transition-all hover:shadow-xl"
                    >
                        <Calendar className="w-5 h-5" />
                        {isAuthenticated ? 'Reservar Cita' : 'Crear Cuenta Gratis'}
                    </Link>
                </div>
            </section>
        </div>
    );
}
