import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import toast from 'react-hot-toast';
import {
    Sparkles,
    ChevronRight,
    ChevronLeft,
    User,
    Building2,
    Palette,
    Check,
    Scissors,
    Gem,
    Heart,
    Star,
    ImagePlus
} from 'lucide-react';

// Paletas de colores predefinidas
const colorPalettes = [
    { name: 'Dorado Clásico', primary: '#D4A574', secondary: '#1A1A2E', accent: '#C9956C' },
    { name: 'Rosa Elegante', primary: '#E91E8C', secondary: '#1A1A2E', accent: '#FF4D9D' },
    { name: 'Azul Moderno', primary: '#3B82F6', secondary: '#0F172A', accent: '#60A5FA' },
    { name: 'Verde Natural', primary: '#10B981', secondary: '#064E3B', accent: '#34D399' },
    { name: 'Morado Lujoso', primary: '#8B5CF6', secondary: '#1E1B4B', accent: '#A78BFA' },
    { name: 'Coral Vibrante', primary: '#F97316', secondary: '#1C1917', accent: '#FB923C' },
];

// Íconos para tipos de negocio
const businessIcons = {
    barberia: Scissors,
    salon: Sparkles,
    unas: Gem,
    spa: Heart,
    otro: Star,
};

export default function RegisterBusiness() {
    const navigate = useNavigate();
    const { createShop, generateSlug } = useTenant();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Paso 1: Admin
        ownerName: '',
        ownerEmail: '',
        ownerPassword: '',
        ownerPhone: '',
        // Paso 2: Negocio
        businessName: '',
        businessType: '',
        customBusinessType: '',
        employeeLabel: '',
        employeeLabelSingular: '',
        description: '',
        phone: '',
        address: '',
        // Paso 3: Branding
        selectedPalette: 0,
        customColors: null,
        logo: null,
    });

    const updateForm = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        // Validaciones por paso
        if (step === 1) {
            if (!formData.ownerName || !formData.ownerEmail || !formData.ownerPassword) {
                toast.error('Por favor completa todos los campos');
                return;
            }
        }
        if (step === 2) {
            if (!formData.businessName || !formData.businessType) {
                toast.error('Por favor indica el nombre y tipo de negocio');
                return;
            }
        }
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    // Generar logo simple con Canvas
    const generateLogo = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');

        const palette = colorPalettes[formData.selectedPalette];

        // Fondo circular
        ctx.fillStyle = palette.primary;
        ctx.beginPath();
        ctx.arc(100, 100, 90, 0, Math.PI * 2);
        ctx.fill();

        // Iniciales del negocio
        const initials = formData.businessName
            .split(' ')
            .map(word => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, 100, 100);

        const logoDataUrl = canvas.toDataURL('image/png');
        updateForm('logo', logoDataUrl);
        toast.success('¡Logo generado!');
    };

    // Subir logo personalizado
    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                updateForm('logo', e.target.result);
                toast.success('Logo cargado');
            };
            reader.readAsDataURL(file);
        }
    };

    // Finalizar registro
    const handleSubmit = () => {
        const palette = colorPalettes[formData.selectedPalette];

        const newShop = createShop({
            name: formData.businessName,
            businessType: formData.businessType === 'otro'
                ? formData.customBusinessType
                : formData.businessType,
            employeeLabel: formData.employeeLabel || 'Empleados',
            employeeLabelSingular: formData.employeeLabelSingular || 'Empleado',
            description: formData.description,
            logo: formData.logo,
            theme: formData.customColors || palette,
            contact: {
                phone: formData.phone,
                whatsapp: formData.phone?.replace(/\D/g, ''),
                email: formData.ownerEmail,
            },
            address: formData.address,
            schedule: {
                monday: { open: '09:00', close: '18:00' },
                tuesday: { open: '09:00', close: '18:00' },
                wednesday: { open: '09:00', close: '18:00' },
                thursday: { open: '09:00', close: '18:00' },
                friday: { open: '09:00', close: '18:00' },
                saturday: { open: '09:00', close: '14:00' },
                sunday: { open: null, close: null },
            },
            ownerId: `owner_${Date.now()}`,
        });

        // ============ GENERAR DATOS DE DEMOSTRACIÓN ============
        const timestamp = Date.now();

        // Servicios de ejemplo según tipo de negocio
        const demoServices = getDemoServices(formData.businessType, newShop.id, timestamp);
        const existingServices = JSON.parse(localStorage.getItem('beautyhub_services') || '[]');
        localStorage.setItem('beautyhub_services', JSON.stringify([...existingServices, ...demoServices]));

        // Empleado de ejemplo
        const demoEmployee = {
            id: `emp_${timestamp}`,
            shopId: newShop.id,
            name: formData.ownerName,
            specialty: formData.businessType === 'otro' ? 'Profesional' : formData.businessType,
            phone: formData.ownerPhone || '',
            email: formData.ownerEmail,
            commission: 30,
            avatar: formData.logo,
            createdAt: new Date().toISOString(),
        };
        const existingBarbers = JSON.parse(localStorage.getItem('beautyhub_barbers') || '[]');
        localStorage.setItem('beautyhub_barbers', JSON.stringify([...existingBarbers, demoEmployee]));

        // Guardar admin en localStorage
        const admins = JSON.parse(localStorage.getItem('beautyhub_users') || '[]');
        const newAdmin = {
            id: `owner_${timestamp}`,
            name: formData.ownerName,
            email: formData.ownerEmail,
            password: formData.ownerPassword,
            phone: formData.ownerPhone,
            role: 'admin',
            shopId: newShop.id,
            createdAt: new Date().toISOString(),
        };
        admins.push(newAdmin);
        localStorage.setItem('beautyhub_users', JSON.stringify(admins));

        // También guardar en la lista de usuarios del sistema legacy
        const legacyUsers = JSON.parse(localStorage.getItem('app_balbert_users') || '[]');
        legacyUsers.push(newAdmin);
        localStorage.setItem('app_balbert_users', JSON.stringify(legacyUsers));

        // Auto-login del nuevo admin
        const { password: _, ...userWithoutPassword } = newAdmin;
        localStorage.setItem('app_balbert_current_user', JSON.stringify(userWithoutPassword));

        toast.success('¡Negocio creado exitosamente!');

        // Redirigir al panel de administración
        setTimeout(() => {
            window.location.href = '/admin';
        }, 100);
    };

    // Función para generar servicios demo según tipo de negocio
    const getDemoServices = (businessType, shopId, timestamp) => {
        const baseServices = {
            'Barbería': [
                { name: 'Corte Clásico', price: 300, duration: 30, description: 'Corte tradicional con tijera y máquina' },
                { name: 'Corte + Barba', price: 500, duration: 45, description: 'Corte completo con arreglo de barba' },
                { name: 'Afeitado Clásico', price: 250, duration: 30, description: 'Afeitado con navaja y toalla caliente' },
                { name: 'Diseño de Cejas', price: 100, duration: 15, description: 'Perfilado y diseño de cejas' },
            ],
            'Salón de Belleza': [
                { name: 'Corte de Cabello', price: 400, duration: 45, description: 'Corte estilizado profesional' },
                { name: 'Tinte Completo', price: 1500, duration: 120, description: 'Coloración completa del cabello' },
                { name: 'Mechas/Highlights', price: 2000, duration: 150, description: 'Mechas o reflejos' },
                { name: 'Peinado', price: 800, duration: 60, description: 'Peinado para evento especial' },
            ],
            'Estudio de Uñas': [
                { name: 'Manicure Clásico', price: 350, duration: 45, description: 'Manicure tradicional' },
                { name: 'Pedicure Spa', price: 500, duration: 60, description: 'Pedicure con tratamiento spa' },
                { name: 'Uñas Acrílicas', price: 1200, duration: 90, description: 'Aplicación de uñas acrílicas' },
                { name: 'Gelish', price: 600, duration: 45, description: 'Esmaltado permanente gelish' },
            ],
            'Spa & Wellness': [
                { name: 'Masaje Relajante', price: 1500, duration: 60, description: 'Masaje corporal relajante' },
                { name: 'Facial Hidratante', price: 1200, duration: 45, description: 'Tratamiento facial hidratante' },
                { name: 'Exfoliación Corporal', price: 1000, duration: 45, description: 'Exfoliación de cuerpo completo' },
                { name: 'Aromaterapia', price: 800, duration: 30, description: 'Sesión de aromaterapia' },
            ],
        };

        const services = baseServices[businessType] || [
            { name: 'Servicio 1', price: 500, duration: 30, description: 'Descripción del servicio' },
            { name: 'Servicio 2', price: 800, duration: 45, description: 'Descripción del servicio' },
            { name: 'Servicio 3', price: 1000, duration: 60, description: 'Descripción del servicio' },
        ];

        return services.map((s, i) => ({
            id: `svc_${timestamp}_${i}`,
            shopId,
            ...s,
            createdAt: new Date().toISOString(),
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-8 h-8 text-amber-400" />
                        <span className="text-2xl font-bold text-white">BeautyHub</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Crea tu Negocio
                    </h1>
                    <p className="text-white/60">
                        Paso {step} de 3
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3].map(s => (
                        <div
                            key={s}
                            className={`h-2 flex-1 rounded-full transition-all ${s <= step ? 'bg-amber-500' : 'bg-white/20'
                                }`}
                        />
                    ))}
                </div>

                {/* Form Card */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">

                    {/* PASO 1: Datos del Dueño */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                    <User className="w-6 h-6 text-amber-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Tu Información</h2>
                                    <p className="text-white/60 text-sm">Datos del propietario o administrador</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-white/80 mb-2">Nombre Completo *</label>
                                <input
                                    type="text"
                                    value={formData.ownerName}
                                    onChange={(e) => updateForm('ownerName', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                                    placeholder="Tu nombre"
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 mb-2">Correo Electrónico *</label>
                                <input
                                    type="email"
                                    value={formData.ownerEmail}
                                    onChange={(e) => updateForm('ownerEmail', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 mb-2">Contraseña *</label>
                                <input
                                    type="password"
                                    value={formData.ownerPassword}
                                    onChange={(e) => updateForm('ownerPassword', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 mb-2">Teléfono</label>
                                <input
                                    type="tel"
                                    value={formData.ownerPhone}
                                    onChange={(e) => updateForm('ownerPhone', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                                    placeholder="809-555-1234"
                                />
                            </div>
                        </div>
                    )}

                    {/* PASO 2: Datos del Negocio */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-amber-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Tu Negocio</h2>
                                    <p className="text-white/60 text-sm">Información de tu establecimiento</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-white/80 mb-2">Nombre del Negocio *</label>
                                <input
                                    type="text"
                                    value={formData.businessName}
                                    onChange={(e) => updateForm('businessName', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                                    placeholder="Ej: Barbería Premium"
                                />
                                {formData.businessName && (
                                    <p className="text-white/40 text-sm mt-1">
                                        URL: beautyhub.com/s/{generateSlug(formData.businessName)}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-white/80 mb-3">Tipo de Negocio *</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: 'Barbería', icon: Scissors },
                                        { value: 'Salón de Belleza', icon: Sparkles },
                                        { value: 'Estudio de Uñas', icon: Gem },
                                        { value: 'Spa & Wellness', icon: Heart },
                                    ].map(type => (
                                        <button
                                            key={type.value}
                                            onClick={() => {
                                                updateForm('businessType', type.value);
                                                // Sugerir etiqueta de empleados
                                                if (type.value === 'Barbería') {
                                                    updateForm('employeeLabel', 'Barberos');
                                                    updateForm('employeeLabelSingular', 'Barbero');
                                                } else if (type.value === 'Salón de Belleza') {
                                                    updateForm('employeeLabel', 'Estilistas');
                                                    updateForm('employeeLabelSingular', 'Estilista');
                                                } else if (type.value === 'Estudio de Uñas') {
                                                    updateForm('employeeLabel', 'Técnicas');
                                                    updateForm('employeeLabelSingular', 'Técnica');
                                                } else if (type.value === 'Spa & Wellness') {
                                                    updateForm('employeeLabel', 'Terapeutas');
                                                    updateForm('employeeLabelSingular', 'Terapeuta');
                                                }
                                            }}
                                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${formData.businessType === type.value
                                                ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                                : 'bg-white/5 border-white/20 text-white/80 hover:border-white/40'
                                                }`}
                                        >
                                            <type.icon className="w-5 h-5" />
                                            <span>{type.value}</span>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => updateForm('businessType', 'otro')}
                                    className={`w-full mt-3 p-3 rounded-xl border text-center transition-all ${formData.businessType === 'otro'
                                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                        : 'bg-white/5 border-white/20 text-white/60 hover:border-white/40'
                                        }`}
                                >
                                    Otro tipo de negocio...
                                </button>
                                {formData.businessType === 'otro' && (
                                    <input
                                        type="text"
                                        value={formData.customBusinessType}
                                        onChange={(e) => updateForm('customBusinessType', e.target.value)}
                                        className="w-full mt-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                                        placeholder="Especifica el tipo de negocio"
                                    />
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white/80 mb-2">¿Cómo llamas a tu equipo?</label>
                                    <input
                                        type="text"
                                        value={formData.employeeLabel}
                                        onChange={(e) => updateForm('employeeLabel', e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                                        placeholder="Ej: Estilistas"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/80 mb-2">Singular</label>
                                    <input
                                        type="text"
                                        value={formData.employeeLabelSingular}
                                        onChange={(e) => updateForm('employeeLabelSingular', e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                                        placeholder="Ej: Estilista"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white/80 mb-2">Teléfono del Negocio</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => updateForm('phone', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                                    placeholder="809-555-5678"
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 mb-2">Dirección</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => updateForm('address', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                                    placeholder="Calle, Número, Ciudad"
                                />
                            </div>
                        </div>
                    )}

                    {/* PASO 3: Branding */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                    <Palette className="w-6 h-6 text-amber-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Tu Marca</h2>
                                    <p className="text-white/60 text-sm">Logo y colores de tu negocio</p>
                                </div>
                            </div>

                            {/* Logo */}
                            <div>
                                <label className="block text-white/80 mb-3">Logo</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                                        {formData.logo ? (
                                            <img
                                                src={formData.logo}
                                                alt="Logo"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <ImagePlus className="w-8 h-8 text-white/40" />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={generateLogo}
                                            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Generar Logo
                                        </button>
                                        <label className="px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors cursor-pointer text-center">
                                            Subir Imagen
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Colores */}
                            <div>
                                <label className="block text-white/80 mb-3">Paleta de Colores</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {colorPalettes.map((palette, i) => (
                                        <button
                                            key={i}
                                            onClick={() => updateForm('selectedPalette', i)}
                                            className={`p-4 rounded-xl border transition-all ${formData.selectedPalette === i
                                                ? 'border-amber-500 bg-white/10'
                                                : 'border-white/20 hover:border-white/40'
                                                }`}
                                        >
                                            <div className="flex gap-2 mb-2">
                                                <div
                                                    className="w-8 h-8 rounded-full"
                                                    style={{ backgroundColor: palette.primary }}
                                                />
                                                <div
                                                    className="w-8 h-8 rounded-full"
                                                    style={{ backgroundColor: palette.secondary }}
                                                />
                                            </div>
                                            <span className="text-white/80 text-sm">{palette.name}</span>
                                            {formData.selectedPalette === i && (
                                                <Check className="inline-block ml-2 w-4 h-4 text-amber-400" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Preview */}
                            <div
                                className="p-6 rounded-xl border border-white/20"
                                style={{
                                    background: `linear-gradient(135deg, ${colorPalettes[formData.selectedPalette].secondary}ee, ${colorPalettes[formData.selectedPalette].secondary})`
                                }}
                            >
                                <p className="text-white/60 text-sm mb-2">Vista previa:</p>
                                <div className="flex items-center gap-3">
                                    {formData.logo && (
                                        <img src={formData.logo} alt="" className="w-12 h-12 rounded-xl" />
                                    )}
                                    <div>
                                        <h3
                                            className="font-bold text-lg"
                                            style={{ color: colorPalettes[formData.selectedPalette].primary }}
                                        >
                                            {formData.businessName || 'Tu Negocio'}
                                        </h3>
                                        <p className="text-white/60 text-sm">
                                            {formData.businessType || 'Tipo de negocio'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                        {step > 1 ? (
                            <button
                                onClick={prevStep}
                                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                Anterior
                            </button>
                        ) : (
                            <div />
                        )}

                        {step < 3 ? (
                            <button
                                onClick={nextStep}
                                className="flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors"
                            >
                                Siguiente
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/30"
                            >
                                <Check className="w-5 h-5" />
                                Crear Mi Negocio
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
