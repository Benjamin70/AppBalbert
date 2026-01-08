import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import MainLayout from './MainLayout';

/**
 * ShopLayout - Wrapper para rutas dinámicas de shop (/s/:shopSlug/*)
 * Se encarga de:
 * 1. Detectar el shop por slug de la URL
 * 2. Inyectar el tema correspondiente
 * 3. Renderizar el MainLayout con los datos del shop
 */
export default function ShopLayout() {
    const { shopSlug } = useParams();
    const { setShopBySlug, currentShop, loading } = useTenant();

    // Detectar y establecer el shop basado en el slug de la URL
    useEffect(() => {
        if (shopSlug) {
            setShopBySlug(shopSlug);
        }
    }, [shopSlug, setShopBySlug]);

    // Mostrar loading mientras se carga el shop
    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-secondary,#1A1A2E)] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[var(--color-primary,#D4A574)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/60">Cargando...</p>
                </div>
            </div>
        );
    }

    // Si no se encuentra el shop, mostrar error
    if (!currentShop && shopSlug) {
        return (
            <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                    <p className="text-white/60 mb-6">Negocio no encontrado</p>
                    <a
                        href="/"
                        className="bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors"
                    >
                        Volver al inicio
                    </a>
                </div>
            </div>
        );
    }

    // Renderizar MainLayout con el contexto del shop
    return <MainLayout />;
}
