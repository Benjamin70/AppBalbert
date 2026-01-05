import { useState } from 'react';
import {
    Users,
    Mail,
    Phone,
    Calendar,
    Eye,
    EyeOff,
    Search,
    Lock
} from 'lucide-react';

export default function Clients() {
    const [showPasswords, setShowPasswords] = useState({});
    const [search, setSearch] = useState('');

    // Obtener usuarios del localStorage
    const getUsers = () => {
        const users = localStorage.getItem('app_balbert_users');
        return users ? JSON.parse(users) : [];
    };

    const users = getUsers();

    // Filtrar usuarios
    const filteredUsers = users.filter(user => {
        if (!search) return true;
        const searchLower = search.toLowerCase();
        return (
            user.name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.phone?.toLowerCase().includes(searchLower)
        );
    });

    const togglePassword = (userId) => {
        setShowPasswords(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-DO', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-light">Clientes</h1>
                    <p className="text-muted">Lista de usuarios registrados ({users.length} total)</p>
                </div>
            </div>

            {/* Search */}
            <div className="card p-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-12"
                        placeholder="Buscar por nombre, email o teléfono..."
                    />
                </div>
            </div>

            {/* Users List */}
            {filteredUsers.length > 0 ? (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-secondary-light">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-light">Cliente</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-light">Teléfono</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-light">Contraseña</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-light">Registrado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/10">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-secondary-light/50 transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-bold text-secondary-dark">
                                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-light">{user.name || 'Sin nombre'}</p>
                                                    <p className="text-xs text-muted flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2 text-light">
                                                <Phone className="w-4 h-4 text-primary" />
                                                {user.phone || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <Lock className="w-4 h-4 text-warning" />
                                                <span className="text-light font-mono text-sm">
                                                    {showPasswords[user.id] ? user.password : '••••••••'}
                                                </span>
                                                <button
                                                    onClick={() => togglePassword(user.id)}
                                                    className="p-1 text-muted hover:text-primary transition-colors"
                                                    title={showPasswords[user.id] ? 'Ocultar' : 'Mostrar'}
                                                >
                                                    {showPasswords[user.id] ? (
                                                        <EyeOff className="w-4 h-4" />
                                                    ) : (
                                                        <Eye className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2 text-muted text-sm">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(user.createdAt)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="card p-12 text-center">
                    <Users className="w-16 h-16 text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-heading font-semibold text-light mb-2">
                        {search ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                    </h3>
                    <p className="text-muted">
                        {search
                            ? 'Intenta con otro término de búsqueda'
                            : 'Los clientes aparecerán aquí cuando se registren'}
                    </p>
                </div>
            )}

            {/* Warning about passwords */}
            <div className="p-4 bg-warning/10 border border-warning/30 rounded-xl">
                <p className="text-sm text-warning">
                    ⚠️ <strong>Advertencia de seguridad:</strong> Las contraseñas se muestran sin encriptar solo para propósitos de desarrollo.
                    En producción, deberían estar hasheadas y no ser visibles.
                </p>
            </div>
        </div>
    );
}
