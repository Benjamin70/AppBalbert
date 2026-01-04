import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useShop } from '../../context/ShopContext';
import {
    Calendar,
    Clock,
    User,
    CheckCircle,
    XCircle,
    AlertCircle,
    Filter,
    Search
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminAppointments() {
    const { appointments, barbers, updateAppointment } = useData();
    const { formatPrice } = useShop();
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    // Filtrar citas
    const filteredAppointments = appointments
        .filter(a => {
            if (filter !== 'all' && a.status !== filter) return false;
            if (dateFilter && a.date !== dateFilter) return false;
            if (search) {
                const searchLower = search.toLowerCase();
                const barber = barbers.find(b => b.id === a.barberId);
                return (
                    (a.clientName && a.clientName.toLowerCase().includes(searchLower)) ||
                    (barber?.name && barber.name.toLowerCase().includes(searchLower))
                );
            }
            return true;
        })
        .sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));

    const getStatusBadge = (status) => {
        const badges = {
            pendiente: { icon: AlertCircle, color: 'text-warning bg-warning/20', label: 'Pendiente' },
            confirmada: { icon: CheckCircle, color: 'text-info bg-info/20', label: 'Confirmada' },
            completada: { icon: CheckCircle, color: 'text-success bg-success/20', label: 'Completada' },
            cancelada: { icon: XCircle, color: 'text-error bg-error/20', label: 'Cancelada' },
        };
        return badges[status] || badges.pendiente;
    };

    const handleStatusChange = (appointmentId, newStatus) => {
        updateAppointment(appointmentId, { status: newStatus });
        toast.success(`Estado actualizado a "${newStatus}"`);
    };

    const statusOptions = [
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'confirmada', label: 'Confirmada' },
        { value: 'completada', label: 'Completada' },
        { value: 'cancelada', label: 'Cancelada' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-heading font-bold text-light">Citas</h1>
                <p className="text-muted">Gestiona todas las citas de la barbería</p>
            </div>

            {/* Filters */}
            <div className="card p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-12"
                            placeholder="Buscar por cliente o barbero..."
                        />
                    </div>

                    {/* Date Filter */}
                    <div>
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary text-secondary-dark' : 'bg-secondary-light text-muted hover:text-light'
                                }`}
                        >
                            Todas
                        </button>
                        <button
                            onClick={() => setFilter('pendiente')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'pendiente' ? 'bg-warning text-secondary-dark' : 'bg-secondary-light text-muted hover:text-light'
                                }`}
                        >
                            Pendientes
                        </button>
                        <button
                            onClick={() => setFilter('completada')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'completada' ? 'bg-success text-white' : 'bg-secondary-light text-muted hover:text-light'
                                }`}
                        >
                            Completadas
                        </button>
                    </div>
                </div>
            </div>

            {/* Appointments List */}
            {filteredAppointments.length > 0 ? (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-secondary-light">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-light">Cliente</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-light">Barbero</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-light">Fecha</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-light">Hora</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-light">Total</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-light">Estado</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-light">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/10">
                                {filteredAppointments.map((appointment) => {
                                    const status = getStatusBadge(appointment.status);
                                    const barber = barbers.find(b => b.id === appointment.barberId);

                                    return (
                                        <tr key={appointment.id} className="hover:bg-secondary-light/50 transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-light">{appointment.clientName || 'Cliente'}</p>
                                                        <p className="text-xs text-muted">{appointment.clientEmail}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-light">
                                                {barber?.name || appointment.barberName || '-'}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2 text-light">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    {new Date(appointment.date).toLocaleDateString('es-DO')}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2 text-light">
                                                    <Clock className="w-4 h-4 text-primary" />
                                                    {appointment.time}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="font-semibold text-primary">
                                                    {formatPrice(appointment.total || 0)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${status.color}`}>
                                                    <status.icon className="w-3 h-3" />
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <select
                                                    value={appointment.status}
                                                    onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                                                    className="bg-secondary border border-primary/20 rounded-lg px-3 py-1 text-sm text-light focus:outline-none focus:ring-2 focus:ring-primary"
                                                >
                                                    {statusOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="card p-12 text-center">
                    <Calendar className="w-16 h-16 text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-heading font-semibold text-light mb-2">
                        No hay citas
                    </h3>
                    <p className="text-muted">
                        {filter !== 'all' || dateFilter || search
                            ? 'No se encontraron citas con los filtros aplicados'
                            : 'Aún no hay citas registradas'}
                    </p>
                </div>
            )}
        </div>
    );
}
