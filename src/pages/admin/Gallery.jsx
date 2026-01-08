import { useState, useRef } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';
import {
    Image,
    Plus,
    Trash2,
    X,
    Upload,
    User,
    Scissors
} from 'lucide-react';

export default function Gallery() {
    const { currentShop, updateShop } = useTenant();
    const { barbers, services } = useData();

    const [gallery, setGallery] = useState(currentShop?.gallery || []);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [filter, setFilter] = useState('all');
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        image: null,
        barberId: '',
        serviceId: '',
        description: ''
    });

    const saveGallery = (updatedGallery) => {
        setGallery(updatedGallery);
        updateShop(currentShop.id, { gallery: updatedGallery });
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('La imagen es muy grande (máx 5MB)');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData({ ...formData, image: e.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.image) {
            toast.error('Selecciona una imagen');
            return;
        }

        const barber = barbers.find(b => b.id === formData.barberId);
        const service = services.find(s => s.id === formData.serviceId);

        const newItem = {
            id: Date.now().toString(),
            image: formData.image,
            barberId: formData.barberId,
            barberName: barber?.name || '',
            serviceId: formData.serviceId,
            serviceName: service?.name || '',
            description: formData.description,
            createdAt: new Date().toISOString()
        };

        saveGallery([newItem, ...gallery]);
        toast.success('Imagen agregada a la galería');
        setShowModal(false);
        setFormData({ image: null, barberId: '', serviceId: '', description: '' });
    };

    const handleDelete = (id) => {
        if (confirm('¿Eliminar esta imagen?')) {
            saveGallery(gallery.filter(g => g.id !== id));
            toast.success('Imagen eliminada');
        }
    };

    const filteredGallery = gallery.filter(item => {
        if (filter === 'all') return true;
        if (filter.startsWith('barber_')) return item.barberId === filter.replace('barber_', '');
        if (filter.startsWith('service_')) return item.serviceId === filter.replace('service_', '');
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-light flex items-center gap-2">
                        <Image className="w-7 h-7 text-primary" />
                        Galería / Portafolio
                    </h1>
                    <p className="text-muted mt-1">Muestra tu mejor trabajo a los clientes</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Subir Imagen
                </button>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                            ? 'bg-primary text-secondary-dark'
                            : 'bg-secondary text-muted hover:text-light'
                        }`}
                >
                    Todos
                </button>
                {barbers.map(b => (
                    <button
                        key={b.id}
                        onClick={() => setFilter(`barber_${b.id}`)}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${filter === `barber_${b.id}`
                                ? 'bg-primary text-secondary-dark'
                                : 'bg-secondary text-muted hover:text-light'
                            }`}
                    >
                        <User className="w-4 h-4" />
                        {b.name}
                    </button>
                ))}
            </div>

            {/* Gallery Grid */}
            {filteredGallery.length === 0 ? (
                <div className="bg-secondary rounded-xl p-12 text-center">
                    <Image className="w-12 h-12 text-muted mx-auto mb-4" />
                    <h3 className="text-light font-semibold mb-2">Galería vacía</h3>
                    <p className="text-muted mb-4">Sube fotos de tus mejores trabajos para atraer clientes.</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        <Upload className="w-5 h-5" />
                        Subir Primera Imagen
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredGallery.map((item) => (
                        <div
                            key={item.id}
                            className="group relative aspect-square rounded-xl overflow-hidden bg-secondary cursor-pointer"
                            onClick={() => setSelectedImage(item)}
                        >
                            <img
                                src={item.image}
                                alt={item.description || 'Trabajo'}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    {item.barberName && (
                                        <p className="text-sm text-light/80 flex items-center gap-1">
                                            <User className="w-3 h-3" /> {item.barberName}
                                        </p>
                                    )}
                                    {item.serviceName && (
                                        <p className="text-sm text-light/80 flex items-center gap-1">
                                            <Scissors className="w-3 h-3" /> {item.serviceName}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(item.id);
                                }}
                                className="absolute top-2 right-2 p-2 bg-error/80 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-secondary rounded-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-primary/20">
                            <h2 className="text-xl font-bold text-light">Subir Imagen</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-secondary-light rounded-lg text-muted"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Image Upload */}
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                {formData.image ? (
                                    <div className="relative">
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-xl"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, image: null })}
                                            className="absolute top-2 right-2 p-2 bg-error rounded-lg text-white"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-48 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
                                    >
                                        <Upload className="w-8 h-8 text-muted" />
                                        <span className="text-muted">Click para seleccionar imagen</span>
                                    </button>
                                )}
                            </div>

                            {/* Barber Select */}
                            <div>
                                <label className="block text-sm text-muted mb-2">Empleado (opcional)</label>
                                <select
                                    value={formData.barberId}
                                    onChange={(e) => setFormData({ ...formData, barberId: e.target.value })}
                                    className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none"
                                >
                                    <option value="">Sin asignar</option>
                                    {barbers.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Service Select */}
                            <div>
                                <label className="block text-sm text-muted mb-2">Servicio (opcional)</label>
                                <select
                                    value={formData.serviceId}
                                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                    className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none"
                                >
                                    <option value="">Sin asignar</option>
                                    {services.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm text-muted mb-2">Descripción (opcional)</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none"
                                    placeholder="Ej: Fade con diseño"
                                />
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
                                    Subir Imagen
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-lg"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <img
                        src={selectedImage.image}
                        alt={selectedImage.description}
                        className="max-w-full max-h-[90vh] object-contain rounded-xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
