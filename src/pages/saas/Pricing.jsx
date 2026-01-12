import { Link } from 'react-router-dom';
import {
    Sparkles,
    Check,
    X,
    Zap,
    Crown,
    Building2,
    ArrowLeft
} from 'lucide-react';

const plans = [
    {
        id: 'free',
        name: 'Gratis',
        price: 0,
        period: 'siempre',
        description: 'Perfecto para empezar',
        icon: Sparkles,
        color: 'text-gray-400',
        bgColor: 'bg-gray-400/20',
        features: [
            { name: '1 ubicación', included: true },
            { name: 'Hasta 3 empleados', included: true },
            { name: 'Reservas ilimitadas', included: true },
            { name: 'Calendario básico', included: true },
            { name: 'Reportes básicos', included: false },
            { name: 'Tema personalizado', included: false },
            { name: 'WhatsApp integrado', included: false },
            { name: 'Soporte prioritario', included: false },
        ],
        cta: 'Plan Actual',
        popular: false,
    },
    {
        id: 'basic',
        name: 'Básico',
        price: 499,
        period: '/mes',
        description: 'Para negocios en crecimiento',
        icon: Zap,
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/20',
        features: [
            { name: '1 ubicación', included: true },
            { name: 'Hasta 10 empleados', included: true },
            { name: 'Reservas ilimitadas', included: true },
            { name: 'Calendario avanzado', included: true },
            { name: 'Reportes completos', included: true },
            { name: 'Tema personalizado', included: true },
            { name: 'WhatsApp integrado', included: false },
            { name: 'Soporte prioritario', included: false },
        ],
        cta: 'Comenzar Prueba',
        popular: false,
    },
    {
        id: 'pro',
        name: 'Profesional',
        price: 999,
        period: '/mes',
        description: 'Todo lo que necesitas',
        icon: Crown,
        color: 'text-amber-400',
        bgColor: 'bg-amber-400/20',
        features: [
            { name: 'Ubicaciones ilimitadas', included: true },
            { name: 'Empleados ilimitados', included: true },
            { name: 'Reservas ilimitadas', included: true },
            { name: 'Calendario avanzado', included: true },
            { name: 'Reportes completos', included: true },
            { name: 'Tema personalizado', included: true },
            { name: 'WhatsApp integrado', included: true },
            { name: 'Soporte prioritario', included: true },
        ],
        cta: 'Comenzar Prueba',
        popular: true,
    },
    {
        id: 'enterprise',
        name: 'Empresa',
        price: null,
        period: '',
        description: 'Solución a medida',
        icon: Building2,
        color: 'text-purple-400',
        bgColor: 'bg-purple-400/20',
        features: [
            { name: 'Todo de Profesional', included: true },
            { name: 'API personalizada', included: true },
            { name: 'Integraciones custom', included: true },
            { name: 'Onboarding dedicado', included: true },
            { name: 'SLA garantizado', included: true },
            { name: 'Manager de cuenta', included: true },
            { name: 'Facturación anual', included: true },
            { name: 'White-label', included: true },
        ],
        cta: 'Contactar Ventas',
        popular: false,
    },
];

export default function Pricing() {
    const handleSelectPlan = (planId) => {
        // Simular selección de plan
        alert(`¡Plan "${planId}" seleccionado! (Simulación - No se realizó ningún cargo)`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Back Link */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al inicio
                </Link>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-8 h-8 text-amber-400" />
                        <span className="text-2xl font-bold text-white">BeautyHub</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Planes y Precios
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        Elige el plan perfecto para tu negocio. Todos incluyen 14 días de prueba gratis.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white/5 backdrop-blur-sm rounded-2xl border p-6 flex flex-col ${plan.popular
                                    ? 'border-amber-500 shadow-lg shadow-amber-500/20'
                                    : 'border-white/10'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                                    MÁS POPULAR
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="text-center mb-6">
                                <div className={`w-12 h-12 ${plan.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                                    <plan.icon className={`w-6 h-6 ${plan.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                                <p className="text-white/60 text-sm">{plan.description}</p>
                            </div>

                            {/* Price */}
                            <div className="text-center mb-6">
                                {plan.price !== null ? (
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-white/60">RD$</span>
                                        <span className="text-4xl font-bold text-white">{plan.price.toLocaleString()}</span>
                                        <span className="text-white/60">{plan.period}</span>
                                    </div>
                                ) : (
                                    <div className="text-2xl font-bold text-white">Personalizado</div>
                                )}
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-6 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        {feature.included ? (
                                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                                        ) : (
                                            <X className="w-5 h-5 text-white/30 flex-shrink-0" />
                                        )}
                                        <span className={feature.included ? 'text-white/80' : 'text-white/40'}>
                                            {feature.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <button
                                onClick={() => handleSelectPlan(plan.id)}
                                className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.popular
                                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                                        : plan.id === 'free'
                                            ? 'bg-white/10 text-white/60 cursor-default'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                                disabled={plan.id === 'free'}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

                {/* FAQ or Additional Info */}
                <div className="mt-16 text-center">
                    <p className="text-white/60 mb-4">
                        ¿Tienes preguntas? <a href="#" className="text-amber-400 hover:underline">Contáctanos</a>
                    </p>
                    <p className="text-white/40 text-sm">
                        Todos los precios están en pesos dominicanos (RD$). Impuestos no incluidos.
                    </p>
                </div>
            </div>
        </div>
    );
}
