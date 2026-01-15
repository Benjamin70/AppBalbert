import { useData } from '../../context/DataContext';
import { useTenant } from '../../context/TenantContext';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    Calendar,
    Scissors,
    Clock
} from 'lucide-react';

export default function Analytics() {
    const { appointments, services, barbers } = useData();
    const { formatPrice, getEmployeeLabel } = useTenant();

    // Calcular estadísticas
    const completedAppointments = appointments.filter(a => a.status === 'completada');
    const thisMonth = new Date().toISOString().slice(0, 7);
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);

    const thisMonthAppts = completedAppointments.filter(a => a.date?.startsWith(thisMonth));
    const lastMonthAppts = completedAppointments.filter(a => a.date?.startsWith(lastMonth));

    const thisMonthRevenue = thisMonthAppts.reduce((sum, a) => sum + (a.total || 0), 0);
    const lastMonthRevenue = lastMonthAppts.reduce((sum, a) => sum + (a.total || 0), 0);

    const revenueChange = lastMonthRevenue > 0
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
        : 100;

    // Servicios más populares
    const serviceStats = {};
    completedAppointments.forEach(a => {
        if (a.services) {
            a.services.forEach(s => {
                if (!serviceStats[s.id]) {
                    serviceStats[s.id] = { ...s, count: 0, revenue: 0 };
                }
                serviceStats[s.id].count += 1;
                serviceStats[s.id].revenue += s.price || 0;
            });
        }
    });
    const topServices = Object.values(serviceStats)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Empleados por ingresos
    const barberStats = barbers.map(b => {
        const barberAppts = completedAppointments.filter(a => a.barberId === b.id);
        const revenue = barberAppts.reduce((sum, a) => sum + (a.total || 0), 0);
        const commission = revenue * (b.commission || 30) / 100;
        return {
            ...b,
            appointments: barberAppts.length,
            revenue,
            commission
        };
    }).sort((a, b) => b.revenue - a.revenue);

    // Citas por día de la semana
    const dayStats = [0, 0, 0, 0, 0, 0, 0]; // Dom-Sab
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    completedAppointments.forEach(a => {
        if (a.date) {
            const day = new Date(a.date).getDay();
            dayStats[day]++;
        }
    });
    const maxDayCount = Math.max(...dayStats, 1);

    // Promedio de citas por día
    const avgAppointmentsPerDay = thisMonthAppts.length > 0
        ? (thisMonthAppts.length / new Date().getDate()).toFixed(1)
        : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-heading font-bold text-light flex items-center gap-2">
                    <BarChart3 className="w-7 h-7 text-primary" />
                    Analytics
                </h1>
                <p className="text-muted mt-1">Estadísticas y reportes de tu negocio</p>
            </div>

            {/* Main Stats */}
            <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-secondary rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-success/20 rounded-xl">
                            <DollarSign className="w-6 h-6 text-success" />
                        </div>
                        <span className={`flex items-center gap-1 text-sm ${parseFloat(revenueChange) >= 0 ? 'text-success' : 'text-error'
                            }`}>
                            {parseFloat(revenueChange) >= 0 ? (
                                <TrendingUp className="w-4 h-4" />
                            ) : (
                                <TrendingDown className="w-4 h-4" />
                            )}
                            {revenueChange}%
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-light">{formatPrice(thisMonthRevenue)}</p>
                    <p className="text-sm text-muted">Ingresos este mes</p>
                </div>

                <div className="bg-secondary rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-primary/20 rounded-xl">
                            <Calendar className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-light">{thisMonthAppts.length}</p>
                    <p className="text-sm text-muted">Citas este mes</p>
                </div>

                <div className="bg-secondary rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-info/20 rounded-xl">
                            <Clock className="w-6 h-6 text-info" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-light">{avgAppointmentsPerDay}</p>
                    <p className="text-sm text-muted">Promedio citas/día</p>
                </div>

                <div className="bg-secondary rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-warning/20 rounded-xl">
                            <Users className="w-6 h-6 text-warning" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-light">{barbers.length}</p>
                    <p className="text-sm text-muted">{getEmployeeLabel()} activos</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Popular Services */}
                <div className="bg-secondary rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-light mb-6 flex items-center gap-2">
                        <Scissors className="w-5 h-5 text-primary" />
                        Servicios Más Populares
                    </h2>
                    {topServices.length === 0 ? (
                        <p className="text-muted text-center py-8">No hay datos aún</p>
                    ) : (
                        <div className="space-y-4">
                            {topServices.map((service, i) => (
                                <div key={service.id} className="flex items-center gap-4">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-amber-400 text-secondary-dark' :
                                            i === 1 ? 'bg-gray-400 text-secondary-dark' :
                                                i === 2 ? 'bg-amber-800 text-light' :
                                                    'bg-secondary-light text-muted'
                                        }`}>
                                        {i + 1}
                                    </span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-light font-medium">{service.name}</p>
                                            <span className="text-sm text-muted">{service.count} veces</span>
                                        </div>
                                        <div className="h-2 bg-secondary-light rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full"
                                                style={{ width: `${(service.count / topServices[0].count) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Days Chart */}
                <div className="bg-secondary rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-light mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Citas por Día
                    </h2>
                    <div className="flex items-end justify-between h-40 gap-2">
                        {dayStats.map((count, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div
                                    className="w-full bg-primary/80 rounded-t-lg transition-all hover:bg-primary"
                                    style={{ height: `${(count / maxDayCount) * 100}%`, minHeight: '4px' }}
                                />
                                <span className="text-xs text-muted">{dayNames[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Employee Stats */}
            <div className="bg-secondary rounded-xl overflow-hidden">
                <div className="p-6 border-b border-primary/20">
                    <h2 className="text-lg font-semibold text-light flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Rendimiento por {getEmployeeLabel(false)}
                    </h2>
                </div>

                {barberStats.length === 0 ? (
                    <div className="p-12 text-center text-muted">
                        No hay {getEmployeeLabel().toLowerCase()} registrados
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-secondary-light">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-muted">{getEmployeeLabel(false)}</th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-muted">Citas</th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-muted">Ingresos</th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-muted">Comisión (%)</th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-muted">A Pagar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/10">
                                {barberStats.map((barber) => (
                                    <tr key={barber.id} className="hover:bg-secondary-light/50">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-light">{barber.name}</p>
                                            <p className="text-sm text-muted">{barber.specialty}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center text-light">
                                            {barber.appointments}
                                        </td>
                                        <td className="px-6 py-4 text-center text-light font-medium">
                                            {formatPrice(barber.revenue)}
                                        </td>
                                        <td className="px-6 py-4 text-center text-muted">
                                            {barber.commission || 30}%
                                        </td>
                                        <td className="px-6 py-4 text-center text-success font-bold">
                                            {formatPrice(barber.commission)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
