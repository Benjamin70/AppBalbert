import { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import QRCode from '../../components/QRCode';
import { getCurrentLanguage, setLanguage, getAvailableLanguages } from '../../utils/i18n';
import toast from 'react-hot-toast';
import {
    Settings as SettingsIcon,
    QrCode,
    Globe,
    Palette,
    Bell,
    Save,
    Store,
    Clock,
    Phone,
    MapPin
} from 'lucide-react';

export default function Settings() {
    const { currentShop, updateShop } = useTenant();
    const [activeTab, setActiveTab] = useState('general');
    const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

    const [shopSettings, setShopSettings] = useState({
        name: currentShop?.name || '',
        description: currentShop?.description || '',
        phone: currentShop?.contact?.phone || '',
        whatsapp: currentShop?.contact?.whatsapp || '',
        email: currentShop?.contact?.email || '',
        address: currentShop?.address || '',
    });

    const [schedule, setSchedule] = useState(currentShop?.schedule || {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '09:00', close: '14:00' },
        sunday: { open: null, close: null },
    });

    const dayNames = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
    };

    const handleSaveGeneral = () => {
        updateShop(currentShop.id, {
            name: shopSettings.name,
            description: shopSettings.description,
            contact: {
                phone: shopSettings.phone,
                whatsapp: shopSettings.whatsapp,
                email: shopSettings.email,
            },
            address: shopSettings.address,
        });
        toast.success('Configuración guardada');
    };

    const handleSaveSchedule = () => {
        updateShop(currentShop.id, { schedule });
        toast.success('Horario guardado');
    };

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setCurrentLang(lang);
        toast.success(`Idioma cambiado a ${lang === 'es' ? 'Español' : 'English'}`);
    };

    const toggleDayOpen = (day) => {
        setSchedule(prev => ({
            ...prev,
            [day]: prev[day].open === null
                ? { open: '09:00', close: '18:00' }
                : { open: null, close: null }
        }));
    };

    const shopUrl = `${window.location.origin}/s/${currentShop?.slug || ''}`;

    const tabs = [
        { id: 'general', label: 'General', icon: Store },
        { id: 'schedule', label: 'Horario', icon: Clock },
        { id: 'qr', label: 'Código QR', icon: QrCode },
        { id: 'language', label: 'Idioma', icon: Globe },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-heading font-bold text-light flex items-center gap-2">
                    <SettingsIcon className="w-7 h-7 text-primary" />
                    Configuración
                </h1>
                <p className="text-muted mt-1">Personaliza tu negocio</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${activeTab === tab.id
                                ? 'bg-primary text-secondary-dark'
                                : 'bg-secondary text-muted hover:text-light'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-secondary rounded-xl p-6">

                {/* General Settings */}
                {activeTab === 'general' && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-light flex items-center gap-2">
                            <Store className="w-5 h-5 text-primary" />
                            Información del Negocio
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-muted mb-2">Nombre del Negocio</label>
                                <input
                                    type="text"
                                    value={shopSettings.name}
                                    onChange={(e) => setShopSettings({ ...shopSettings, name: e.target.value })}
                                    className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-muted mb-2">Correo Electrónico</label>
                                <input
                                    type="email"
                                    value={shopSettings.email}
                                    onChange={(e) => setShopSettings({ ...shopSettings, email: e.target.value })}
                                    className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-muted mb-2">Descripción</label>
                            <textarea
                                value={shopSettings.description}
                                onChange={(e) => setShopSettings({ ...shopSettings, description: e.target.value })}
                                className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none resize-none"
                                rows="3"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-muted mb-2 flex items-center gap-1">
                                    <Phone className="w-4 h-4" /> Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={shopSettings.phone}
                                    onChange={(e) => setShopSettings({ ...shopSettings, phone: e.target.value })}
                                    className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-muted mb-2">WhatsApp</label>
                                <input
                                    type="tel"
                                    value={shopSettings.whatsapp}
                                    onChange={(e) => setShopSettings({ ...shopSettings, whatsapp: e.target.value })}
                                    className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-muted mb-2 flex items-center gap-1">
                                <MapPin className="w-4 h-4" /> Dirección
                            </label>
                            <input
                                type="text"
                                value={shopSettings.address}
                                onChange={(e) => setShopSettings({ ...shopSettings, address: e.target.value })}
                                className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none"
                            />
                        </div>

                        <button
                            onClick={handleSaveGeneral}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Guardar Cambios
                        </button>
                    </div>
                )}

                {/* Schedule Settings */}
                {activeTab === 'schedule' && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-light flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            Horario de Atención
                        </h2>

                        <div className="space-y-3">
                            {Object.entries(dayNames).map(([day, label]) => (
                                <div key={day} className="flex items-center gap-4 p-4 bg-secondary-light rounded-xl">
                                    <button
                                        onClick={() => toggleDayOpen(day)}
                                        className={`w-24 text-left font-medium ${schedule[day].open !== null ? 'text-light' : 'text-muted'
                                            }`}
                                    >
                                        {label}
                                    </button>

                                    {schedule[day].open !== null ? (
                                        <div className="flex items-center gap-2 flex-1">
                                            <input
                                                type="time"
                                                value={schedule[day].open || ''}
                                                onChange={(e) => setSchedule({
                                                    ...schedule,
                                                    [day]: { ...schedule[day], open: e.target.value }
                                                })}
                                                className="bg-secondary border border-primary/20 rounded-lg px-3 py-2 text-light"
                                            />
                                            <span className="text-muted">a</span>
                                            <input
                                                type="time"
                                                value={schedule[day].close || ''}
                                                onChange={(e) => setSchedule({
                                                    ...schedule,
                                                    [day]: { ...schedule[day], close: e.target.value }
                                                })}
                                                className="bg-secondary border border-primary/20 rounded-lg px-3 py-2 text-light"
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-muted italic">Cerrado</span>
                                    )}

                                    <button
                                        onClick={() => toggleDayOpen(day)}
                                        className={`px-3 py-1 rounded-lg text-sm ${schedule[day].open !== null
                                                ? 'bg-success/20 text-success'
                                                : 'bg-error/20 text-error'
                                            }`}
                                    >
                                        {schedule[day].open !== null ? 'Abierto' : 'Cerrado'}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleSaveSchedule}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Guardar Horario
                        </button>
                    </div>
                )}

                {/* QR Code */}
                {activeTab === 'qr' && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-light flex items-center gap-2">
                            <QrCode className="w-5 h-5 text-primary" />
                            Código QR de tu Negocio
                        </h2>

                        <p className="text-muted">
                            Imprime este código QR para que tus clientes puedan acceder fácilmente a tu página de reservas.
                        </p>

                        <div className="flex flex-col items-center gap-4 p-8 bg-secondary-light rounded-xl">
                            <QRCode
                                value={shopUrl}
                                size={200}
                                downloadName={`qr-${currentShop?.slug || 'negocio'}`}
                            />
                            <div className="text-center">
                                <p className="text-light font-medium">{currentShop?.name}</p>
                                <p className="text-muted text-sm break-all">{shopUrl}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Language Settings */}
                {activeTab === 'language' && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-light flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary" />
                            Idioma de la Aplicación
                        </h2>

                        <p className="text-muted">
                            Selecciona el idioma de la interfaz de administración.
                        </p>

                        <div className="grid grid-cols-2 gap-4 max-w-md">
                            {getAvailableLanguages().map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`p-4 rounded-xl border-2 transition-all ${currentLang === lang.code
                                            ? 'border-primary bg-primary/20'
                                            : 'border-primary/20 hover:border-primary/40'
                                        }`}
                                >
                                    <span className="text-3xl mb-2 block">{lang.flag}</span>
                                    <span className="text-light font-medium">{lang.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
