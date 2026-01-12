import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTenant } from '../../context/TenantContext';
import {
    Scissors,
    Plus,
    Edit2,
    Trash2,
    X,
    DollarSign,
    Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Services() {
    const { services, addService, updateService, deleteService } = useData();
    const { formatPrice } = useTenant();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
    });

    const resetForm = () => {
        setFormData({ name: '', description: '', price: '', duration: '' });
        setEditingService(null);
    };

    const openModal = (service = null) => {
        if (service) {
            setEditingService(service);
            setFormData({
                name: service.name,
                description: service.description || '',
                price: service.price.toString(),
                duration: service.duration.toString(),
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

        if (!formData.price || parseFloat(formData.price) <= 0) {
            toast.error('El precio debe ser mayor a 0');
            return;
        }

        if (!formData.duration || parseInt(formData.duration) <= 0) {
            toast.error('La duración debe ser mayor a 0');
            return;
        }

        const serviceData = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: parseFloat(formData.price),
            duration: parseInt(formData.duration),
        };

        if (editingService) {
            updateService(editingService.id, serviceData);
            toast.success('Servicio actualizado exitosamente');
        } else {
            addService(serviceData);
            toast.success('Servicio agregado exitosamente');
        }

        closeModal();
    };

    const handleDelete = (service) => {
        if (confirm(`¿Estás seguro de eliminar "${service.name}"?`)) {
            deleteService(service.id);
            toast.success('Servicio eliminado');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-light">Servicios</h1>
                    <p className="text-muted">Gestiona los servicios de la barbería</p>
                </div>
                <button onClick={() => openModal()} className="btn-primary">
                    <Plus className="w-5 h-5 mr-2" />
                    Agregar Servicio
                </button>
            </div>

            {/* Services Grid */}
            {services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="card p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                                    <Scissors className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(service)}
                                        className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service)}
                                        className="p-2 text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-heading font-semibold text-light text-lg mb-2">{service.name}</h3>
                            <p className="text-sm text-muted mb-4 line-clamp-2">{service.description || 'Sin descripción'}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                                <div className="flex items-center gap-2 text-primary">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="font-bold text-lg">{formatPrice(service.price)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted">
                                    <Clock className="w-4 h-4" />
                                    {service.duration} min
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card p-12 text-center">
                    <Scissors className="w-16 h-16 text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-heading font-semibold text-light mb-2">
                        No hay servicios registrados
                    </h3>
                    <p className="text-muted mb-6">
                        Comienza agregando los servicios de tu barbería
                    </p>
                    <button onClick={() => openModal()} className="btn-primary">
                        <Plus className="w-5 h-5 mr-2" />
                        Agregar Primer Servicio
                    </button>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-secondary rounded-2xl w-full max-w-md animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b border-primary/20">
                            <h2 className="text-xl font-heading font-bold text-light">
                                {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
                            </h2>
                            <button onClick={closeModal} className="text-muted hover:text-light transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="label-text">Nombre del Servicio *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field"
                                    placeholder="Ej: Corte Clásico"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label-text">Descripción</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-field resize-none"
                                    rows={3}
                                    placeholder="Descripción del servicio..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label-text">Precio (RD$) *</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="input-field pl-12"
                                            placeholder="300"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label-text">Duración (min) *</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                                        <input
                                            type="number"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="input-field pl-12"
                                            placeholder="30"
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="btn-outline flex-1">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editingService ? 'Actualizar' : 'Agregar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
