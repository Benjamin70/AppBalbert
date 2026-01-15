import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTenant } from '../../context/TenantContext';
import StarRating from '../../components/StarRating';
import toast from 'react-hot-toast';
import {
    Star,
    Search,
    Trash2,
    User,
    Calendar,
    TrendingUp
} from 'lucide-react';

export default function Reviews() {
    const { appointments, barbers, getBarberById } = useData();
    const { getEmployeeLabel } = useTenant();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRating, setFilterRating] = useState('all');

    // Simular reviews basadas en citas completadas
    // En producción, esto sería una entidad separada
    const reviews = appointments
        .filter(a => a.status === 'completada' && a.rating)
        .map(a => ({
            id: a.id,
            clientName: a.clientName || 'Cliente',
            barberId: a.barberId,
            barberName: getBarberById(a.barberId)?.name || 'Desconocido',
            rating: a.rating,
            comment: a.reviewComment || '',
            date: a.date,
            services: a.services || []
        }));

    // Calcular estadísticas
    const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
        stars,
        count: reviews.filter(r => Math.floor(r.rating) === stars).length,
        percentage: reviews.length > 0
            ? (reviews.filter(r => Math.floor(r.rating) === stars).length / reviews.length) * 100
            : 0
    }));

    // Calcular promedio por empleado
    const barberRatings = barbers.map(b => {
        const barberReviews = reviews.filter(r => r.barberId === b.id);
        const avg = barberReviews.length > 0
            ? barberReviews.reduce((sum, r) => sum + r.rating, 0) / barberReviews.length
            : 0;
        return {
            ...b,
            avgRating: avg,
            reviewCount: barberReviews.length
        };
    }).sort((a, b) => b.avgRating - a.avgRating);

    const filteredReviews = reviews.filter(r => {
        const matchesSearch = r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.barberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.comment.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = filterRating === 'all' || Math.floor(r.rating) === parseInt(filterRating);
        return matchesSearch && matchesRating;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-heading font-bold text-light flex items-center gap-2">
                    <Star className="w-7 h-7 text-primary" />
                    Reseñas y Valoraciones
                </h1>
                <p className="text-muted mt-1">Opiniones de tus clientes</p>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Average Rating Card */}
                <div className="bg-secondary rounded-xl p-6">
                    <div className="text-center">
                        <p className="text-5xl font-bold text-primary mb-2">
                            {avgRating.toFixed(1)}
                        </p>
                        <StarRating rating={avgRating} size="lg" />
                        <p className="text-muted mt-2">{reviews.length} reseñas totales</p>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="bg-secondary rounded-xl p-6">
                    <h3 className="font-semibold text-light mb-4">Distribución</h3>
                    <div className="space-y-2">
                        {ratingDistribution.map(({ stars, count, percentage }) => (
                            <div key={stars} className="flex items-center gap-2">
                                <span className="text-sm text-muted w-8">{stars}★</span>
                                <div className="flex-1 h-2 bg-secondary-light rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-400 rounded-full transition-all"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-muted w-8">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Employees */}
                <div className="bg-secondary rounded-xl p-6">
                    <h3 className="font-semibold text-light mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-success" />
                        Top {getEmployeeLabel()}
                    </h3>
                    <div className="space-y-3">
                        {barberRatings.slice(0, 3).map((barber, i) => (
                            <div key={barber.id} className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-amber-400 text-secondary-dark' :
                                        i === 1 ? 'bg-gray-400 text-secondary-dark' :
                                            'bg-amber-800 text-light'
                                    }`}>
                                    {i + 1}
                                </span>
                                <div className="flex-1">
                                    <p className="text-light text-sm font-medium">{barber.name}</p>
                                    <div className="flex items-center gap-2">
                                        <StarRating rating={barber.avgRating} size="sm" />
                                        <span className="text-xs text-muted">({barber.reviewCount})</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {barberRatings.length === 0 && (
                            <p className="text-muted text-sm">No hay datos aún</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                        type="text"
                        placeholder="Buscar reseñas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-secondary border border-primary/20 rounded-xl text-light focus:border-primary focus:outline-none"
                    />
                </div>
                <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="px-4 py-3 bg-secondary border border-primary/20 rounded-xl text-light focus:border-primary focus:outline-none"
                >
                    <option value="all">Todas las estrellas</option>
                    <option value="5">5 estrellas</option>
                    <option value="4">4 estrellas</option>
                    <option value="3">3 estrellas</option>
                    <option value="2">2 estrellas</option>
                    <option value="1">1 estrella</option>
                </select>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {filteredReviews.length === 0 ? (
                    <div className="bg-secondary rounded-xl p-12 text-center">
                        <Star className="w-12 h-12 text-muted mx-auto mb-4" />
                        <h3 className="text-light font-semibold mb-2">Sin reseñas</h3>
                        <p className="text-muted">
                            Las reseñas aparecerán cuando los clientes califiquen sus citas completadas.
                        </p>
                    </div>
                ) : (
                    filteredReviews.map((review) => (
                        <div key={review.id} className="bg-secondary rounded-xl p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                        <User className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-semibold text-light">{review.clientName}</h3>
                                            <StarRating rating={review.rating} size="sm" />
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-muted mb-3">
                                            <span>{getEmployeeLabel(false)}: {review.barberName}</span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {review.date}
                                            </span>
                                        </div>
                                        {review.comment && (
                                            <p className="text-light/80">{review.comment}</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => toast.error('Función en desarrollo')}
                                    className="p-2 hover:bg-error/20 rounded-lg text-muted hover:text-error transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
