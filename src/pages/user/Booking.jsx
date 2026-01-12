import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTenant } from '../../context/TenantContext';
import {
    Scissors,
    User,
    Calendar,
    Clock,
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    ChevronRight,
    ChevronLeft,
    AlertTriangle,
    CheckCircle,
    X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Booking() {
    const { user } = useAuth();
    const { barbers, services, addAppointment } = useData();
    const { currentShop, formatPrice } = useTenant();
    const shop = currentShop || { name: 'BeautyHub' };
    const navigate = useNavigate();

    // Estados del flujo de reserva
    const [step, setStep] = useState(1); // 1: Barbero, 2: Servicios, 3: Fecha/Hora, 4: Confirmación
    const [selectedBarber, setSelectedBarber] = useState(null);
    const [cart, setCart] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Calcular total del carrito
    const cartTotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cart]);

    const cartDuration = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.duration * item.quantity, 0);
    }, [cart]);

    // Generar fechas disponibles (próximos 30 días)
    const availableDates = useMemo(() => {
        const dates = [];
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dayOfWeek = date.getDay();

            // Verificar si está abierto ese día
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const schedule = shop.schedule[days[dayOfWeek]];

            if (schedule.open) {
                dates.push({
                    date: date.toISOString().split('T')[0],
                    display: date.toLocaleDateString('es-DO', { weekday: 'short', day: 'numeric', month: 'short' }),
                    dayName: date.toLocaleDateString('es-DO', { weekday: 'long' }),
                });
            }
        }

        return dates;
    }, [shop.schedule]);

    // Generar horarios disponibles
    const availableTimes = useMemo(() => {
        if (!selectedDate) return [];

        const date = new Date(selectedDate);
        const dayOfWeek = date.getDay();
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const schedule = shop.schedule[days[dayOfWeek]];

        if (!schedule.open) return [];

        const times = [];
        const [openHour, openMin] = schedule.open.split(':').map(Number);
        const [closeHour, closeMin] = schedule.close.split(':').map(Number);
        let currentHour = openHour;
        let currentMin = openMin;

        while (currentHour < closeHour || (currentHour === closeHour && currentMin < closeMin)) {
            const time = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
            times.push(time);
            currentMin += 30;
            if (currentMin >= 60) {
                currentHour++;
                currentMin = 0;
            }
        }

        return times;
    }, [selectedDate, shop.schedule]);

    // Agregar al carrito
    const addToCart = (service) => {
        const existing = cart.find(item => item.id === service.id);
        if (existing) {
            setCart(cart.map(item =>
                item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...service, quantity: 1 }]);
        }
        toast.success(`${service.name} agregado`);
    };

    // Actualizar cantidad
    const updateQuantity = (serviceId, delta) => {
        setCart(cart.map(item => {
            if (item.id === serviceId) {
                const newQuantity = item.quantity + delta;
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    // Remover del carrito
    const removeFromCart = (serviceId) => {
        setCart(cart.filter(item => item.id !== serviceId));
    };

    // Confirmar reserva
    const handleConfirmBooking = () => {
        const appointment = {
            userId: user.id,
            clientName: user.name,
            clientEmail: user.email,
            barberId: selectedBarber.id,
            barberName: selectedBarber.name,
            services: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
            date: selectedDate,
            time: selectedTime,
            duration: cartDuration,
            total: cartTotal,
        };

        addAppointment(appointment);

        toast.success(
            <div>
                <p className="font-semibold">¡Cita reservada!</p>
                <p className="text-sm">Recuerda llegar 5 minutos antes</p>
            </div>,
            { duration: 5000 }
        );

        navigate('/mis-citas');
    };

    // Renderizar paso actual
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-heading font-bold text-light mb-2">
                                Elige tu Barbero
                            </h2>
                            <p className="text-muted">Selecciona el profesional de tu preferencia</p>
                        </div>

                        {barbers.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {barbers.map((barber) => (
                                    <button
                                        key={barber.id}
                                        onClick={() => {
                                            setSelectedBarber(barber);
                                            setStep(2);
                                        }}
                                        className={`card p-6 text-left transition-all hover:border-primary/50 ${selectedBarber?.id === barber.id ? 'border-primary ring-2 ring-primary/20' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-2xl font-heading font-bold text-secondary-dark">
                                                    {barber.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-heading font-semibold text-light">{barber.name}</h3>
                                                <p className="text-sm text-primary">{barber.specialty || 'Barbero Profesional'}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="card p-12 text-center">
                                <User className="w-16 h-16 text-muted mx-auto mb-4" />
                                <p className="text-muted">No hay barberos disponibles en este momento</p>
                            </div>
                        )}
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-heading font-bold text-light mb-2">
                                Elige tus Servicios
                            </h2>
                            <p className="text-muted">Agrega los servicios que deseas al carrito</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {services.map((service) => {
                                const inCart = cart.find(item => item.id === service.id);

                                return (
                                    <div
                                        key={service.id}
                                        className={`menu-cart-item ${inCart ? 'selected' : ''}`}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-heading font-semibold text-light">{service.name}</h3>
                                                <span className="text-primary font-bold">{formatPrice(service.price)}</span>
                                            </div>
                                            <p className="text-sm text-muted mb-2">{service.description}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted">
                                                <Clock className="w-3 h-3" />
                                                {service.duration} min
                                            </div>
                                        </div>

                                        <div className="ml-4">
                                            {inCart ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(service.id, -1)}
                                                        className="p-2 bg-secondary rounded-lg hover:bg-error/20 transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-8 text-center font-semibold text-light">
                                                        {inCart.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(service.id, 1)}
                                                        className="p-2 bg-secondary rounded-lg hover:bg-primary/20 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => addToCart(service)}
                                                    className="p-3 bg-primary/20 text-primary rounded-lg hover:bg-primary hover:text-secondary-dark transition-all"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-heading font-bold text-light mb-2">
                                Elige Fecha y Hora
                            </h2>
                            <p className="text-muted">Selecciona cuándo te gustaría tu cita</p>
                        </div>

                        {/* Fechas */}
                        <div>
                            <label className="label-text mb-3 block">Fecha</label>
                            <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4">
                                {availableDates.slice(0, 14).map((dateObj) => (
                                    <button
                                        key={dateObj.date}
                                        onClick={() => {
                                            setSelectedDate(dateObj.date);
                                            setSelectedTime('');
                                        }}
                                        className={`flex-shrink-0 p-4 rounded-xl text-center transition-all min-w-[100px] ${selectedDate === dateObj.date
                                            ? 'bg-primary text-secondary-dark'
                                            : 'bg-secondary-light text-light hover:bg-primary/20'
                                            }`}
                                    >
                                        <div className="font-heading font-semibold">{dateObj.display}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Horarios */}
                        {selectedDate && (
                            <div>
                                <label className="label-text mb-3 block">Hora</label>
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                    {availableTimes.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`p-3 rounded-lg text-center transition-all ${selectedTime === time
                                                ? 'bg-primary text-secondary-dark'
                                                : 'bg-secondary-light text-light hover:bg-primary/20'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 4:
                return (
                    <div className="max-w-lg mx-auto space-y-6">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-success" />
                            </div>
                            <h2 className="text-2xl font-heading font-bold text-light mb-2">
                                Confirmar Reserva
                            </h2>
                            <p className="text-muted">Revisa los detalles de tu cita</p>
                        </div>

                        {/* Alerta de llegada */}
                        <div className="p-4 bg-warning/20 border border-warning/30 rounded-xl flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-warning">¡Importante!</p>
                                <p className="text-sm text-light/80">
                                    Debes llegar <span className="font-bold">5 minutos antes</span> de tu cita.
                                    De lo contrario, tu turno será cedido al final de la lista.
                                </p>
                            </div>
                        </div>

                        {/* Resumen */}
                        <div className="card p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted">Barbero</p>
                                    <p className="font-semibold text-light">{selectedBarber?.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted">Fecha y Hora</p>
                                    <p className="font-semibold text-light">
                                        {new Date(selectedDate).toLocaleDateString('es-DO', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long'
                                        })} a las {selectedTime}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted">Duración Total</p>
                                    <p className="font-semibold text-light">{cartDuration} minutos</p>
                                </div>
                            </div>

                            <div className="border-t border-primary/20 pt-4">
                                <p className="text-sm text-muted mb-2">Servicios:</p>
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm py-1">
                                        <span className="text-light">
                                            {item.name} x{item.quantity}
                                        </span>
                                        <span className="text-primary">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-primary/20 pt-4 flex justify-between items-center">
                                <span className="text-lg font-heading font-bold text-light">Total</span>
                                <span className="text-2xl font-heading font-bold text-primary">{formatPrice(cartTotal)}</span>
                            </div>
                        </div>

                        <button onClick={handleConfirmBooking} className="btn-primary w-full py-4 text-lg">
                            Confirmar Reserva
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen pb-32 md:pb-6">
            <div className="section-container section-padding">
                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mb-12">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex items-center">
                            <button
                                onClick={() => s < step && setStep(s)}
                                disabled={s > step}
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${s === step
                                    ? 'bg-primary text-secondary-dark'
                                    : s < step
                                        ? 'bg-success text-white cursor-pointer'
                                        : 'bg-secondary-light text-muted'
                                    }`}
                            >
                                {s < step ? <CheckCircle className="w-5 h-5" /> : s}
                            </button>
                            {s < 4 && (
                                <div className={`w-8 md:w-16 h-1 mx-1 rounded ${s < step ? 'bg-success' : 'bg-secondary-light'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                {renderStep()}

                {/* Navigation Buttons */}
                {step > 1 && step < 4 && (
                    <div className="flex justify-between mt-8">
                        <button onClick={() => setStep(step - 1)} className="btn-outline">
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            Anterior
                        </button>

                        {step === 2 && cart.length > 0 && (
                            <button onClick={() => setStep(3)} className="btn-primary">
                                Continuar
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </button>
                        )}

                        {step === 3 && selectedDate && selectedTime && (
                            <button onClick={() => setStep(4)} className="btn-primary">
                                Continuar
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Floating Cart (Mobile) */}
            {step === 2 && cart.length > 0 && (
                <>
                    {/* Cart Button */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="md:hidden fixed bottom-6 right-6 bg-primary text-secondary-dark p-4 rounded-full shadow-lg hover:bg-primary-light transition-all animate-pulse-glow z-40"
                    >
                        <ShoppingCart className="w-6 h-6" />
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white text-xs rounded-full flex items-center justify-center">
                            {cart.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                    </button>

                    {/* Cart Drawer */}
                    {isCartOpen && (
                        <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setIsCartOpen(false)}>
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-secondary rounded-t-3xl max-h-[70vh] overflow-y-auto animate-slide-up"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="sticky top-0 bg-secondary p-4 border-b border-primary/20 flex items-center justify-between">
                                    <h3 className="font-heading font-bold text-light flex items-center gap-2">
                                        <ShoppingCart className="w-5 h-5 text-primary" />
                                        Tu Carrito
                                    </h3>
                                    <button onClick={() => setIsCartOpen(false)} className="text-muted">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="p-4 space-y-3">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-3 bg-secondary-light rounded-xl">
                                            <div>
                                                <p className="font-medium text-light">{item.name}</p>
                                                <p className="text-sm text-primary">{formatPrice(item.price)}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="p-1 bg-secondary rounded"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-6 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="p-1 bg-secondary rounded"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-1 text-error"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="sticky bottom-0 bg-secondary p-4 border-t border-primary/20">
                                    <div className="flex justify-between mb-4">
                                        <span className="text-muted">Total:</span>
                                        <span className="text-xl font-bold text-primary">{formatPrice(cartTotal)}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            setStep(3);
                                        }}
                                        className="btn-primary w-full"
                                    >
                                        Continuar
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Desktop Cart Sidebar */}
            {step === 2 && (
                <div className="hidden md:block fixed top-24 right-6 w-80 card p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
                    <h3 className="font-heading font-bold text-light flex items-center gap-2 mb-4">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                        Tu Carrito
                    </h3>

                    {cart.length > 0 ? (
                        <>
                            <div className="space-y-3 mb-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-light truncate">{item.name}</p>
                                            <p className="text-sm text-primary">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                        <div className="flex items-center gap-1 ml-2">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-error/20 rounded">
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-5 text-center text-sm">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-primary/20 rounded">
                                                <Plus className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => removeFromCart(item.id)} className="p-1 text-error hover:bg-error/20 rounded ml-1">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-primary/20 pt-4 mb-4">
                                <div className="flex justify-between text-sm text-muted mb-1">
                                    <span>Duración:</span>
                                    <span>{cartDuration} min</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">Total:</span>
                                    <span className="text-xl font-bold text-primary">{formatPrice(cartTotal)}</span>
                                </div>
                            </div>

                            <button onClick={() => setStep(3)} className="btn-primary w-full">
                                Elegir Fecha
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </button>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <Scissors className="w-12 h-12 text-muted mx-auto mb-3" />
                            <p className="text-muted text-sm">Agrega servicios a tu carrito</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
