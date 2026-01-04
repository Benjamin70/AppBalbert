import { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
    Users,
    Plus,
    Edit2,
    Trash2,
    X,
    User,
    Briefcase,
    Phone,
    Star
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Barbers() {
    const { barbers, addBarber, updateBarber, deleteBarber } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBarber, setEditingBarber] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        specialty: '',
        phone: '',
        experience: '',
    });

    const resetForm = () => {
        setFormData({ name: '', specialty: '', phone: '', experience: '' });
        setEditingBarber(null);
    };

    const openModal = (barber = null) => {
        if (barber) {
            setEditingBarber(barber);
            setFormData({
                name: barber.name,
                specialty: barber.specialty || '',
                phone: barber.phone || '',
                experience: barber.experience || '',
            });
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('El nombre es requerido');
            return;
        }

        if (editingBarber) {
            updateBarber(editingBarber.id, formData);
            toast.success('Barbero actualizado exitosamente');
        } else {
            addBarber(formData);
            toast.success('Barbero agregado exitosamente');
        }

        closeModal();
    };

    const handleDelete = (barber) => {
        if (confirm(`¿Estás seguro de eliminar a ${barber.name}?`)) {
            deleteBarber(barber.id);
            toast.success('Barbero eliminado');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-light">Barberos</h1>
                    <p className="text-muted">Gestiona el equipo de barberos</p>
                </div>
                <button onClick={() => openModal()} className="btn-primary">
                    <Plus className="w-5 h-5 mr-2" />
                    Agregar Barbero
                </button>
            </div>

            {/* Barbers Grid */}
            {barbers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {barbers.map((barber) => (
                        <div key={barber.id} className="card p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                    <span className="text-2xl font-heading font-bold text-secondary-dark">
                                        {barber.name.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(barber)}
                                        className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(barber)}
                                        className="p-2 text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-heading font-semibold text-light text-lg mb-1">{barber.name}</h3>
                            <p className="text-primary text-sm mb-3">{barber.specialty || 'Barbero Profesional'}</p>

                            <div className="space-y-2 text-sm text-muted">
                                {barber.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        {barber.phone}
                                    </div>
                                )}
                                {barber.experience && (
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        {barber.experience} años de experiencia
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-primary/10 flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-warning fill-current" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card p-12 text-center">
                    <Users className="w-16 h-16 text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-heading font-semibold text-light mb-2">
                        No hay barberos registrados
                    </h3>
                    <p className="text-muted mb-6">
                        Comienza agregando a los miembros de tu equipo
                    </p>
                    <button onClick={() => openModal()} className="btn-primary">
                        <Plus className="w-5 h-5 mr-2" />
                        Agregar Primer Barbero
                    </button>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-secondary rounded-2xl w-full max-w-md animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b border-primary/20">
                            <h2 className="text-xl font-heading font-bold text-light">
                                {editingBarber ? 'Editar Barbero' : 'Nuevo Barbero'}
                            </h2>
                            <button onClick={closeModal} className="text-muted hover:text-light transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="label-text">Nombre *</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field pl-12"
                                        placeholder="Nombre del barbero"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label-text">Especialidad</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                                    <input
                                        type="text"
                                        value={formData.specialty}
                                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                        className="input-field pl-12"
                                        placeholder="Ej: Cortes clásicos, Diseños"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label-text">Teléfono</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="input-field pl-12"
                                        placeholder="+1 809-555-0123"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label-text">Años de Experiencia</label>
                                <input
                                    type="number"
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    className="input-field"
                                    placeholder="5"
                                    min="0"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="btn-outline flex-1">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editingBarber ? 'Actualizar' : 'Agregar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
