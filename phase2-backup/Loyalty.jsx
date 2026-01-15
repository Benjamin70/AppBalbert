import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTenant } from '../../context/TenantContext';
import toast from 'react-hot-toast';
import {
    Gift,
    Settings,
    Users,
    Award,
    TrendingUp,
    Star,
    Edit2,
    Save
} from 'lucide-react';

export default function Loyalty() {
    const { appointments } = useData();
    const { currentShop, updateShop, formatPrice } = useTenant();

    // Configuración de fidelidad
    const [loyaltyConfig, setLoyaltyConfig] = useState({
        pointsPerVisit: currentShop?.loyaltyConfig?.pointsPerVisit || 10,
        pointsPerDollar: currentShop?.loyaltyConfig?.pointsPerDollar || 1,
        pointsForReward: currentShop?.loyaltyConfig?.pointsForReward || 100,
        rewardDescription: currentShop?.loyaltyConfig?.rewardDescription || 'Servicio gratis'
    });

    const [isEditing, setIsEditing] = useState(false);

    // Simular puntos de clientes (basado en citas completadas)
    const clientPoints = appointments
        .filter(a => a.status === 'completada')
        .reduce((acc, a) => {
            const clientId = a.userId || a.clientName;
            if (!acc[clientId]) {
                acc[clientId] = {
                    name: a.clientName || 'Cliente',
                    points: 0,
                    visits: 0,
                    totalSpent: 0
                };
            }
            acc[clientId].visits += 1;
            acc[clientId].totalSpent += a.total || 0;
            acc[clientId].points += loyaltyConfig.pointsPerVisit +
                Math.floor((a.total || 0) * loyaltyConfig.pointsPerDollar / 100);
            return acc;
        }, {});

    const clientList = Object.entries(clientPoints)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.points - a.points);

    const totalPointsIssued = clientList.reduce((sum, c) => sum + c.points, 0);
    const clientsWithReward = clientList.filter(c => c.points >= loyaltyConfig.pointsForReward).length;

    const handleSaveConfig = () => {
        updateShop(currentShop.id, { loyaltyConfig });
        toast.success('Configuración guardada');
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-light flex items-center gap-2">
                        <Gift className="w-7 h-7 text-primary" />
                        Sistema de Fidelidad
                    </h1>
                    <p className="text-muted mt-1">Recompensa a tus clientes frecuentes</p>
                </div>
            </div>

            {/* Config Card */}
            <div className="bg-secondary rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-light flex items-center gap-2">
                        <Settings className="w-5 h-5 text-primary" />
                        Configuración de Puntos
                    </h2>
                    {isEditing ? (
                        <button
                            onClick={handleSaveConfig}
                            className="btn-primary flex items-center gap-2 text-sm"
                        >
                            <Save className="w-4 h-4" />
                            Guardar
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                            Editar
                        </button>
                    )}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm text-muted mb-2">Puntos por Visita</label>
                        <input
                            type="number"
                            value={loyaltyConfig.pointsPerVisit}
                            onChange={(e) => setLoyaltyConfig({
                                ...loyaltyConfig,
                                pointsPerVisit: parseInt(e.target.value) || 0
                            })}
                            disabled={!isEditing}
                            className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-muted mb-2">Puntos por cada RD$100</label>
                        <input
                            type="number"
                            value={loyaltyConfig.pointsPerDollar}
                            onChange={(e) => setLoyaltyConfig({
                                ...loyaltyConfig,
                                pointsPerDollar: parseInt(e.target.value) || 0
                            })}
                            disabled={!isEditing}
                            className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-muted mb-2">Puntos para Recompensa</label>
                        <input
                            type="number"
                            value={loyaltyConfig.pointsForReward}
                            onChange={(e) => setLoyaltyConfig({
                                ...loyaltyConfig,
                                pointsForReward: parseInt(e.target.value) || 0
                            })}
                            disabled={!isEditing}
                            className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-muted mb-2">Descripción Recompensa</label>
                        <input
                            type="text"
                            value={loyaltyConfig.rewardDescription}
                            onChange={(e) => setLoyaltyConfig({
                                ...loyaltyConfig,
                                rewardDescription: e.target.value
                            })}
                            disabled={!isEditing}
                            className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none disabled:opacity-50"
                        />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-secondary rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/20 rounded-xl">
                            <Star className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-light">{totalPointsIssued}</p>
                            <p className="text-sm text-muted">Puntos Emitidos</p>
                        </div>
                    </div>
                </div>
                <div className="bg-secondary rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-success/20 rounded-xl">
                            <Users className="w-6 h-6 text-success" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-light">{clientList.length}</p>
                            <p className="text-sm text-muted">Clientes Participando</p>
                        </div>
                    </div>
                </div>
                <div className="bg-secondary rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-warning/20 rounded-xl">
                            <Award className="w-6 h-6 text-warning" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-light">{clientsWithReward}</p>
                            <p className="text-sm text-muted">Listos para Canjear</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-secondary rounded-xl overflow-hidden">
                <div className="p-6 border-b border-primary/20">
                    <h2 className="text-lg font-semibold text-light flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Ranking de Clientes
                    </h2>
                </div>

                {clientList.length === 0 ? (
                    <div className="p-12 text-center">
                        <Gift className="w-12 h-12 text-muted mx-auto mb-4" />
                        <h3 className="text-light font-semibold mb-2">Sin clientes aún</h3>
                        <p className="text-muted">
                            Los clientes acumularán puntos al completar citas.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-secondary-light">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-muted">#</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-muted">Cliente</th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-muted">Visitas</th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-muted">Total Gastado</th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-muted">Puntos</th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-muted">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/10">
                                {clientList.map((client, i) => (
                                    <tr key={client.id} className="hover:bg-secondary-light/50">
                                        <td className="px-6 py-4">
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${i === 0 ? 'bg-amber-400 text-secondary-dark' :
                                                    i === 1 ? 'bg-gray-400 text-secondary-dark' :
                                                        i === 2 ? 'bg-amber-800 text-light' :
                                                            'bg-secondary-light text-muted'
                                                }`}>
                                                {i + 1}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-light">{client.name}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center text-light">
                                            {client.visits}
                                        </td>
                                        <td className="px-6 py-4 text-center text-light">
                                            {formatPrice(client.totalSpent)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-bold text-primary">{client.points}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {client.points >= loyaltyConfig.pointsForReward ? (
                                                <span className="px-3 py-1 bg-success/20 text-success text-xs rounded-full">
                                                    🎁 Puede Canjear
                                                </span>
                                            ) : (
                                                <span className="text-xs text-muted">
                                                    Faltan {loyaltyConfig.pointsForReward - client.points} pts
                                                </span>
                                            )}
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
