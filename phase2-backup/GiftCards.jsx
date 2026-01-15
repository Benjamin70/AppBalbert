import { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import toast from 'react-hot-toast';
import {
    Gift,
    Plus,
    Search,
    Copy,
    Trash2,
    CheckCircle,
    XCircle,
    Calendar,
    X
} from 'lucide-react';

export default function GiftCards() {
    const { currentShop, updateShop, formatPrice } = useTenant();

    // Gift cards stored in shop config
    const [giftCards, setGiftCards] = useState(currentShop?.giftCards || []);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        value: '',
        expirationDays: '365'
    });

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 12; i++) {
            if (i > 0 && i % 4 === 0) code += '-';
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const saveGiftCards = (updatedCards) => {
        setGiftCards(updatedCards);
        updateShop(currentShop.id, { giftCards: updatedCards });
    };

    const handleCreate = (e) => {
        e.preventDefault();

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + parseInt(formData.expirationDays));

        const newCard = {
            id: Date.now().toString(),
            code: generateCode(),
            value: parseFloat(formData.value),
            balance: parseFloat(formData.value),
            expiresAt: expirationDate.toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            isActive: true,
            usedBy: null
        };

        saveGiftCards([...giftCards, newCard]);
        toast.success('Tarjeta de regalo creada');
        setShowModal(false);
        setFormData({ value: '', expirationDays: '365' });
    };

    const handleDeactivate = (id) => {
        const updated = giftCards.map(c =>
            c.id === id ? { ...c, isActive: false } : c
        );
        saveGiftCards(updated);
        toast.success('Tarjeta desactivada');
    };

    const handleDelete = (id) => {
        if (confirm('¿Eliminar esta tarjeta de regalo?')) {
            saveGiftCards(giftCards.filter(c => c.id !== id));
            toast.success('Tarjeta eliminada');
        }
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        toast.success('Código copiado');
    };

    const filteredCards = giftCards.filter(c =>
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeCards = giftCards.filter(c => c.isActive);
    const totalValue = activeCards.reduce((sum, c) => sum + c.balance, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-light flex items-center gap-2">
                        <Gift className="w-7 h-7 text-primary" />
                        Tarjetas de Regalo
                    </h1>
                    <p className="text-muted mt-1">Crea y gestiona tarjetas de regalo</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Tarjeta
                </button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-secondary rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/20 rounded-xl">
                            <Gift className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-light">{giftCards.length}</p>
                            <p className="text-sm text-muted">Total Creadas</p>
                        </div>
                    </div>
                </div>
                <div className="bg-secondary rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-success/20 rounded-xl">
                            <CheckCircle className="w-6 h-6 text-success" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-light">{activeCards.length}</p>
                            <p className="text-sm text-muted">Activas</p>
                        </div>
                    </div>
                </div>
                <div className="bg-secondary rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-warning/20 rounded-xl">
                            <Gift className="w-6 h-6 text-warning" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-light">{formatPrice(totalValue)}</p>
                            <p className="text-sm text-muted">Valor Pendiente</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                    type="text"
                    placeholder="Buscar por código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-secondary border border-primary/20 rounded-xl text-light focus:border-primary focus:outline-none"
                />
            </div>

            {/* Cards Grid */}
            {filteredCards.length === 0 ? (
                <div className="bg-secondary rounded-xl p-12 text-center">
                    <Gift className="w-12 h-12 text-muted mx-auto mb-4" />
                    <h3 className="text-light font-semibold mb-2">Sin tarjetas de regalo</h3>
                    <p className="text-muted">Crea tu primera tarjeta de regalo para empezar.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCards.map((card) => (
                        <div
                            key={card.id}
                            className={`bg-secondary rounded-xl p-6 border-2 ${card.isActive ? 'border-primary/30' : 'border-gray-600 opacity-60'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Gift className={`w-5 h-5 ${card.isActive ? 'text-primary' : 'text-gray-500'}`} />
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${card.isActive
                                            ? 'bg-success/20 text-success'
                                            : 'bg-gray-600 text-gray-400'
                                        }`}>
                                        {card.isActive ? 'Activa' : 'Inactiva'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {card.isActive && (
                                        <button
                                            onClick={() => handleDeactivate(card.id)}
                                            className="p-1.5 hover:bg-warning/20 rounded-lg text-muted hover:text-warning transition-colors"
                                            title="Desactivar"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(card.id)}
                                        className="p-1.5 hover:bg-error/20 rounded-lg text-muted hover:text-error transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div
                                className="bg-secondary-light rounded-lg p-3 mb-4 cursor-pointer hover:bg-secondary-light/70 transition-colors"
                                onClick={() => copyCode(card.code)}
                            >
                                <div className="flex items-center justify-between">
                                    <code className="text-lg font-mono text-primary tracking-wider">
                                        {card.code}
                                    </code>
                                    <Copy className="w-4 h-4 text-muted" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-2">
                                <span className="text-muted text-sm">Valor:</span>
                                <span className="text-light font-bold">{formatPrice(card.value)}</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-muted text-sm">Balance:</span>
                                <span className="text-success font-bold">{formatPrice(card.balance)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted text-sm flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Expira:
                                </span>
                                <span className="text-light text-sm">{card.expiresAt}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-secondary rounded-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-primary/20">
                            <h2 className="text-xl font-bold text-light">Nueva Tarjeta de Regalo</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-secondary-light rounded-lg text-muted"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm text-muted mb-2">Valor (RD$) *</label>
                                <input
                                    type="number"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                    className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none"
                                    min="1"
                                    required
                                    placeholder="Ej: 500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-muted mb-2">Días de Validez</label>
                                <select
                                    value={formData.expirationDays}
                                    onChange={(e) => setFormData({ ...formData, expirationDays: e.target.value })}
                                    className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none"
                                >
                                    <option value="30">30 días</option>
                                    <option value="90">90 días</option>
                                    <option value="180">6 meses</option>
                                    <option value="365">1 año</option>
                                    <option value="730">2 años</option>
                                </select>
                            </div>

                            <div className="bg-secondary-light rounded-xl p-4">
                                <p className="text-sm text-muted mb-1">Código generado automáticamente:</p>
                                <code className="text-primary font-mono">XXXX-XXXX-XXXX</code>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 border border-primary/20 rounded-xl text-light hover:bg-secondary-light transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn-primary"
                                >
                                    Crear Tarjeta
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
