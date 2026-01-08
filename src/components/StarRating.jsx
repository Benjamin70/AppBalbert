import { Star } from 'lucide-react';

/**
 * StarRating - Componente reutilizable para mostrar/seleccionar estrellas
 * @param {number} rating - Puntuación actual (0-5)
 * @param {function} onRate - Callback al seleccionar (opcional, si es interactivo)
 * @param {string} size - Tamaño: 'sm', 'md', 'lg'
 * @param {boolean} showValue - Mostrar valor numérico
 */
export default function StarRating({
    rating = 0,
    onRate = null,
    size = 'md',
    showValue = false,
    count = 5
}) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const sizeClass = sizes[size] || sizes.md;
    const isInteractive = typeof onRate === 'function';

    return (
        <div className="flex items-center gap-1">
            {[...Array(count)].map((_, i) => {
                const starValue = i + 1;
                const isFilled = starValue <= rating;
                const isHalf = starValue - 0.5 <= rating && starValue > rating;

                return (
                    <button
                        key={i}
                        type="button"
                        onClick={() => isInteractive && onRate(starValue)}
                        disabled={!isInteractive}
                        className={`${isInteractive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
                    >
                        <Star
                            className={`${sizeClass} ${isFilled
                                    ? 'fill-amber-400 text-amber-400'
                                    : isHalf
                                        ? 'fill-amber-400/50 text-amber-400'
                                        : 'text-gray-500'
                                }`}
                        />
                    </button>
                );
            })}
            {showValue && (
                <span className="ml-2 text-sm text-muted">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
