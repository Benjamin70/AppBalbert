import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useShop } from '../../context/ShopContext';
import { Link } from 'react-router-dom';
import {
    Calendar,
    Clock,
    User,
    Scissors,
    CheckCircle,
    XCircle,
    AlertCircle,
    Plus
} from 'lucide-react';

export default function MyAppointments() {
    const { user } = useAuth();
    const { getAppointmentsByUser, barbers } = useData();
    const { formatPrice } = useShop();

    const appointments = getAppointmentsByUser(user?.id);

    // Ordenar por fecha (más recientes primero)
    const sortedAppointments = [...appointments].sort(
        (a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time)
    );

    const getStatusBadge = (status) => {
        const badges = {
            pendiente: { icon: AlertCircle, color: 'text-warning bg-warning/20', label: 'Pendiente' },
            confirmada: { icon: CheckCircle, color: 'text-info bg-info/20', label: 'Confirmada' },
            completada: { icon: CheckCircle, color: 'text-success bg-success/20', label: 'Completada' },
            cancelada: { icon: XCircle, color: 'text-error bg-error/20', label: 'Cancelada' },
        };
        return badges[status] || badges.pendiente;
    };

    const isUpcoming = (appointment) => {
        const appointmentDate = new Date(appointment.date + 'T' + appointment.time);
        return appointmentDate > new Date();
    };

    return (
        <div className="section-container section-padding">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-heading font-bold text-light">Mis Citas</h1>
                        <p className="text-muted">Historial y próximas citas</p>
                    </div>
                    <Link to="/reservar" className="btn-primary">
                        <Plus className="w-5 h-5 mr-2" />
                        Nueva Cita
                    </Link>
                </div>

                {/* Appointments List */}
                {sortedAppointments.length > 0 ? (
                    <div className="space-y-4">
                        {sortedAppointments.map((appointment) => {
                            const status = getStatusBadge(appointment.status);
                            const barber = barbers.find(b => b.id === appointment.barberId);
                            const upcoming = isUpcoming(appointment);

                            return (
                                <div
                                    key={appointment.id}
                                    className={`card p-6 ${upcoming ? 'border-primary/30' : 'opacity-75'}`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${upcoming ? 'bg-primary/20' : 'bg-secondary-light'
                                                }`}>
                                                <Calendar className={`w-6 h-6 ${upcoming ? 'text-primary' : 'text-muted'}`} />
                                            </div>
                                            <div>
                                                <p className="font-heading font-semibold text-light">
                                                    {new Date(appointment.date).toLocaleDateString('es-DO', {
                                                        weekday: 'long',
                                                        day: 'numeric',
                                                        month: 'long',
                                                    })}
                                                </p>
                                                <div className="flex items-center gap-4 text-sm text-muted mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {appointment.time}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-4 h-4" />
                                                        {barber?.name || appointment.barberName || 'Barbero'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                                                <status.icon className="w-3 h-3" />
                                                {status.label}
                                            </span>
                                            <span className="text-primary font-bold text-lg">
                                                {formatPrice(appointment.total || 0)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Services */}
                                    {appointment.services && appointment.services.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-primary/10">
                                            <p className="text-sm text-muted mb-2">Servicios:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {appointment.services.map((service, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-secondary-light rounded-full text-sm text-light flex items-center gap-1"
                                                    >
                                                        <Scissors className="w-3 h-3 text-primary" />
                                                        {service.name} {service.quantity > 1 && `x${service.quantity}`}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Reminder for upcoming */}
                                    {upcoming && appointment.status === 'pendiente' && (
                                        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                                            <p className="text-sm text-warning">
                                                ⚠️ Recuerda llegar 5 minutos antes de tu cita
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="card p-12 text-center">
                        <Calendar className="w-16 h-16 text-muted mx-auto mb-4" />
                        <h3 className="text-lg font-heading font-semibold text-light mb-2">
                            No tienes citas aún
                        </h3>
                        <p className="text-muted mb-6">
                            Reserva tu primera cita y disfruta de nuestros servicios
                        </p>
                        <Link to="/reservar" className="btn-primary">
                            <Plus className="w-5 h-5 mr-2" />
                            Reservar Ahora
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
