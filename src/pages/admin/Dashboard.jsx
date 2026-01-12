import { useData } from '../../context/DataContext';
import { useTenant } from '../../context/TenantContext';
import {
    Calendar,
    Users,
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';

export default function Dashboard() {
    const { barbers, appointments, getTodayAppointments } = useData();
    const { formatPrice } = useTenant();

    const todayAppointments = getTodayAppointments();

    // Calcular estadísticas
    const totalRevenue = appointments
        .filter(a => a.status === 'completada')
        .reduce((sum, a) => sum + (a.total || 0), 0);

    const pendingAppointments = appointments.filter(a => a.status === 'pendiente').length;
    const completedAppointments = appointments.filter(a => a.status === 'completada').length;

    const stats = [
        {
            label: 'Citas Hoy',
            value: todayAppointments.length,
            icon: Calendar,
            color: 'text-info',
            bgColor: 'bg-info/20'
        },
        {
            label: 'Barberos Activos',
            value: barbers.length,
            icon: Users,
            color: 'text-primary',
            bgColor: 'bg-primary/20'
        },
        {
            label: 'Citas Pendientes',
            value: pendingAppointments,
            icon: Clock,
            color: 'text-warning',
            bgColor: 'bg-warning/20'
        },
        {
            label: 'Ingresos Totales',
            value: formatPrice(totalRevenue),
            icon: DollarSign,
            color: 'text-success',
            bgColor: 'bg-success/20'
        },
    ];

    const getStatusBadge = (status) => {
        const badges = {
            pendiente: { icon: AlertCircle, color: 'text-warning bg-warning/20', label: 'Pendiente' },
            confirmada: { icon: CheckCircle, color: 'text-info bg-info/20', label: 'Confirmada' },
            completada: { icon: CheckCircle, color: 'text-success bg-success/20', label: 'Completada' },
            cancelada: { icon: XCircle, color: 'text-error bg-error/20', label: 'Cancelada' },
        };
        return badges[status] || badges.pendiente;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-heading font-bold text-light">Dashboard</h1>
                <p className="text-muted">Resumen general de la barbería</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <TrendingUp className="w-4 h-4 text-success" />
                        </div>
                        <div className="text-2xl font-heading font-bold text-light">{stat.value}</div>
                        <div className="text-sm text-muted">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Today's Appointments */}
            <div className="card">
                <div className="p-6 border-b border-primary/20">
                    <h2 className="text-lg font-heading font-semibold text-light flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Citas de Hoy
                    </h2>
                </div>

                {todayAppointments.length > 0 ? (
                    <div className="divide-y divide-primary/10">
                        {todayAppointments.map((appointment) => {
                            const status = getStatusBadge(appointment.status);
                            const barber = barbers.find(b => b.id === appointment.barberId);

                            return (
                                <div key={appointment.id} className="p-4 hover:bg-secondary-light/50 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                                <Clock className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-light">{appointment.clientName || 'Cliente'}</p>
                                                <p className="text-sm text-muted">
                                                    {appointment.time} - {barber?.name || 'Sin barbero'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                                                <status.icon className="w-3 h-3" />
                                                {status.label}
                                            </span>
                                            <span className="text-primary font-semibold">
                                                {formatPrice(appointment.total || 0)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <Calendar className="w-12 h-12 text-muted mx-auto mb-4" />
                        <p className="text-muted">No hay citas programadas para hoy</p>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card p-6">
                    <h3 className="font-heading font-semibold text-light mb-4">Acciones Rápidas</h3>
                    <div className="space-y-2">
                        <a href="/admin/barberos" className="block p-3 bg-secondary-light rounded-lg hover:bg-primary/20 transition-colors">
                            <span className="text-light">+ Agregar Barbero</span>
                        </a>
                        <a href="/admin/servicios" className="block p-3 bg-secondary-light rounded-lg hover:bg-primary/20 transition-colors">
                            <span className="text-light">+ Agregar Servicio</span>
                        </a>
                        <a href="/admin/citas" className="block p-3 bg-secondary-light rounded-lg hover:bg-primary/20 transition-colors">
                            <span className="text-light">Ver Todas las Citas</span>
                        </a>
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="font-heading font-semibold text-light mb-4">Barberos Activos</h3>
                    {barbers.length > 0 ? (
                        <div className="space-y-3">
                            {barbers.slice(0, 4).map((barber) => (
                                <div key={barber.id} className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-secondary-dark">
                                            {barber.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-light">{barber.name}</p>
                                        <p className="text-xs text-muted">{barber.specialty || 'Barbero'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted text-sm">No hay barberos registrados</p>
                    )}
                </div>
            </div>
        </div>
    );
}
