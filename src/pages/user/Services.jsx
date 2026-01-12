import { useData } from '../../context/DataContext';
import { useTenant } from '../../context/TenantContext';
import { Link, useLocation } from 'react-router-dom';
import {
    Scissors,
    Clock,
    DollarSign,
    Calendar,
    ChevronRight
} from 'lucide-react';

export default function ServicesPage() {
    const { services } = useData();
    const { formatPrice } = useTenant();
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
                        Nuestros <span className="text-gradient">Servicios</span>
                    </h1>
                    <p className="text-muted max-w-2xl mx-auto text-lg">
                        Ofrecemos una amplia gama de servicios de barbería con los más altos estándares de calidad
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="section-container py-16">
                {services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, index) => (
                            <div
                                key={service.id}
                                className="card p-6 group hover:border-primary/50 animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                                        <Scissors className="w-7 h-7 text-primary group-hover:text-secondary-dark" />
                                    </div>
                                    <span className="text-2xl font-heading font-bold text-primary">
                                        {formatPrice(service.price)}
                                    </span>
                                </div>

                                <h3 className="font-heading font-semibold text-light text-xl mb-2">
                                    {service.name}
                                </h3>
                                <p className="text-muted text-sm mb-4 leading-relaxed">
                                    {service.description || 'Servicio profesional de barbería'}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                                    <div className="flex items-center gap-2 text-sm text-muted">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <span>{service.duration} minutos</span>
                                    </div>
                                    <Link
                                        to={`${basePath}/reservar`}
                                        className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                                    >
                                        Reservar
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Scissors className="w-16 h-16 text-muted mx-auto mb-4" />
                        <p className="text-muted text-lg">No hay servicios disponibles en este momento</p>
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-primary to-accent py-16">
                <div className="section-container text-center">
                    <h2 className="text-3xl font-heading font-bold text-secondary-dark mb-4">
                        ¿Listo para tu próximo corte?
                    </h2>
                    <p className="text-secondary/80 mb-8 max-w-xl mx-auto">
                        Reserva tu cita ahora y disfruta de una experiencia premium
                    </p>
                    <Link
                        to={`${basePath}/reservar`}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-light font-semibold rounded-lg hover:bg-secondary-dark transition-all hover:shadow-xl"
                    >
                        <Calendar className="w-5 h-5" />
                        Reservar Ahora
                    </Link>
                </div>
            </section>
        </div>
    );
}
