import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTenant } from '../../context/TenantContext';
import toast from 'react-hot-toast';
import {
    Package,
    Plus,
    Search,
    Edit2,
    Trash2,
    AlertTriangle,
    X,
    DollarSign,
    Box
} from 'lucide-react';

export default function Inventory() {
    const { products, addProduct, updateProduct, deleteProduct } = useData();
    const { formatPrice } = useTenant();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: 'general',
        minStock: '5'
    });

    const categories = [
        { value: 'general', label: 'General' },
        { value: 'cabello', label: 'Productos para Cabello' },
        { value: 'barba', label: 'Productos para Barba' },
        { value: 'skincare', label: 'Cuidado de Piel' },
        { value: 'herramientas', label: 'Herramientas' },
        { value: 'accesorios', label: 'Accesorios' },
    ];

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lowStockProducts = products.filter(p => p.stock <= (p.minStock || 5));

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price.toString(),
                stock: product.stock.toString(),
                category: product.category || 'general',
                minStock: (product.minStock || 5).toString()
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                stock: '',
                category: 'general',
                minStock: '5'
            });
        }
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const productData = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            category: formData.category,
            minStock: parseInt(formData.minStock)
        };

        if (editingProduct) {
            updateProduct(editingProduct.id, productData);
            toast.success('Producto actualizado');
        } else {
            addProduct(productData);
            toast.success('Producto agregado');
        }

        setShowModal(false);
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            deleteProduct(id);
            toast.success('Producto eliminado');
        }
    };

    const updateStock = (id, newStock) => {
        updateProduct(id, { stock: Math.max(0, newStock) });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-light flex items-center gap-2">
                        <Package className="w-7 h-7 text-primary" />
                        Inventario
                    </h1>
                    <p className="text-muted mt-1">Gestiona tus productos y stock</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Agregar Producto
                </button>
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
                <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-warning">Stock Bajo</h3>
                        <p className="text-sm text-muted">
                            {lowStockProducts.length} producto(s) con stock bajo: {' '}
                            {lowStockProducts.map(p => p.name).join(', ')}
                        </p>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-secondary rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-light">{products.length}</p>
                            <p className="text-xs text-muted">Total Productos</p>
                        </div>
                    </div>
                </div>
                <div className="bg-secondary rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-success/20 rounded-lg">
                            <Box className="w-5 h-5 text-success" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-light">
                                {products.reduce((sum, p) => sum + p.stock, 0)}
                            </p>
                            <p className="text-xs text-muted">Unidades en Stock</p>
                        </div>
                    </div>
                </div>
                <div className="bg-secondary rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-warning/20 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-warning" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-light">{lowStockProducts.length}</p>
                            <p className="text-xs text-muted">Stock Bajo</p>
                        </div>
                    </div>
                </div>
                <div className="bg-secondary rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-info/20 rounded-lg">
                            <DollarSign className="w-5 h-5 text-info" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-light">
                                {formatPrice(products.reduce((sum, p) => sum + (p.price * p.stock), 0))}
                            </p>
                            <p className="text-xs text-muted">Valor Total</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-secondary border border-primary/20 rounded-xl text-light focus:border-primary focus:outline-none"
                />
            </div>

            {/* Products Table */}
            <div className="bg-secondary rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary-light">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-muted">Producto</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-muted">Categoría</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-muted">Precio</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-muted">Stock</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-muted">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/10">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-muted">
                                        No hay productos registrados
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-secondary-light/50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-light">{product.name}</p>
                                                <p className="text-sm text-muted">{product.description}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">
                                                {categories.find(c => c.value === product.category)?.label || product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-light font-medium">
                                            {formatPrice(product.price)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => updateStock(product.id, product.stock - 1)}
                                                    className="w-8 h-8 rounded-lg bg-secondary-light hover:bg-error/20 text-light hover:text-error transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className={`w-12 text-center font-bold ${product.stock <= (product.minStock || 5) ? 'text-warning' : 'text-light'
                                                    }`}>
                                                    {product.stock}
                                                </span>
                                                <button
                                                    onClick={() => updateStock(product.id, product.stock + 1)}
                                                    className="w-8 h-8 rounded-lg bg-secondary-light hover:bg-success/20 text-light hover:text-success transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(product)}
                                                    className="p-2 hover:bg-primary/20 rounded-lg text-muted hover:text-primary transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 hover:bg-error/20 rounded-lg text-muted hover:text-error transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-secondary rounded-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-primary/20">
                            <h2 className="text-xl font-bold text-light">
                                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-secondary-light rounded-lg text-muted"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm text-muted mb-2">Nombre *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-muted mb-2">Descripción</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none resize-none"
                                    rows="2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-muted mb-2">Categoría</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-muted mb-2">Precio (RD$) *</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted mb-2">Stock Inicial *</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-muted mb-2">Stock Mínimo (alerta)</label>
                                <input
                                    type="number"
                                    value={formData.minStock}
                                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                                    className="w-full bg-secondary-light border border-primary/20 rounded-xl px-4 py-3 text-light focus:border-primary focus:outline-none"
                                    min="0"
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
                                    {editingProduct ? 'Guardar Cambios' : 'Agregar Producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
