import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TenantContext = createContext(null);

// Clave de localStorage para shops
const SHOPS_KEY = 'beautyhub_shops';

// Shop demo por defecto (migración de datos existentes)
const defaultShop = {
    id: 'shop_demo',
    slug: 'demo-barberia',
    name: 'Ricky Stylo',
    businessType: 'Barbería',
    employeeLabel: 'Barberos',
    employeeLabelSingular: 'Barbero',
    description: 'Tu barbería de confianza',
    logo: null,
    theme: {
        primary: '#D4A574',
        secondary: '#1A1A2E',
        accent: '#C9956C',
    },
    contact: {
        phone: '809-555-1234',
        whatsapp: '8095551234',
        email: 'info@rickystylo.com',
    },
    address: 'Calle Principal #123, Santo Domingo',
    schedule: {
        monday: { open: '09:00', close: '20:00' },
        tuesday: { open: '09:00', close: '20:00' },
        wednesday: { open: '09:00', close: '20:00' },
        thursday: { open: '09:00', close: '20:00' },
        friday: { open: '09:00', close: '21:00' },
        saturday: { open: '08:00', close: '18:00' },
        sunday: { open: null, close: null },
    },
    subscription: 'free',
    createdAt: new Date().toISOString(),
    ownerId: 'admin_1',
};

export function TenantProvider({ children }) {
    const [shops, setShops] = useState([]);
    const [currentShop, setCurrentShop] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cargar shops al iniciar
    useEffect(() => {
        loadShops();
    }, []);

    // Establecer shop por defecto cuando se cargan
    useEffect(() => {
        if (shops.length > 0 && !currentShop) {
            // Intentar cargar de sessionStorage
            const savedShopId = sessionStorage.getItem('currentShopId');
            if (savedShopId) {
                const shop = shops.find(s => s.id === savedShopId);
                if (shop) {
                    setCurrentShop(shop);
                    injectTheme(shop.theme);
                    return;
                }
            }
            // Default: primer shop
            setCurrentShop(shops[0]);
            injectTheme(shops[0].theme);
        }
    }, [shops]);

    const loadShops = () => {
        const stored = localStorage.getItem(SHOPS_KEY);
        if (stored) {
            const parsedShops = JSON.parse(stored);
            if (parsedShops.length === 0) {
                const initialShops = [defaultShop];
                setShops(initialShops);
                localStorage.setItem(SHOPS_KEY, JSON.stringify(initialShops));
            } else {
                setShops(parsedShops);
            }
        } else {
            const initialShops = [defaultShop];
            setShops(initialShops);
            localStorage.setItem(SHOPS_KEY, JSON.stringify(initialShops));
        }
        setLoading(false);
    };

    // Cambiar shop por slug (llamado desde componentes con acceso a useParams)
    const setShopBySlug = useCallback((slug) => {
        const shop = shops.find(s => s.slug === slug);
        if (shop) {
            setCurrentShop(shop);
            sessionStorage.setItem('currentShopId', shop.id);
            injectTheme(shop.theme);
        }
    }, [shops]);

    // Inyectar CSS variables del tema
    const injectTheme = (theme) => {
        if (!theme) return;
        const root = document.documentElement;
        root.style.setProperty('--color-primary', theme.primary);
        root.style.setProperty('--color-secondary', theme.secondary);
        root.style.setProperty('--color-accent', theme.accent || theme.primary);
    };

    // ============ CRUD de Shops ============
    const createShop = (shopData) => {
        const newShop = {
            id: `shop_${Date.now()}`,
            slug: generateSlug(shopData.name),
            ...shopData,
            subscription: 'free',
            createdAt: new Date().toISOString(),
        };
        const updatedShops = [...shops, newShop];
        setShops(updatedShops);
        localStorage.setItem(SHOPS_KEY, JSON.stringify(updatedShops));

        // Establecer como shop actual
        setCurrentShop(newShop);
        sessionStorage.setItem('currentShopId', newShop.id);
        injectTheme(newShop.theme);

        return newShop;
    };

    const updateShop = (shopId, shopData) => {
        const updatedShops = shops.map(s =>
            s.id === shopId ? { ...s, ...shopData } : s
        );
        setShops(updatedShops);
        localStorage.setItem(SHOPS_KEY, JSON.stringify(updatedShops));

        if (currentShop?.id === shopId) {
            const updated = updatedShops.find(s => s.id === shopId);
            setCurrentShop(updated);
            if (updated.theme) injectTheme(updated.theme);
        }
    };

    const deleteShop = (shopId) => {
        const updatedShops = shops.filter(s => s.id !== shopId);
        setShops(updatedShops);
        localStorage.setItem(SHOPS_KEY, JSON.stringify(updatedShops));
    };

    const getShopById = (id) => shops.find(s => s.id === id);
    const getShopBySlug = (slug) => shops.find(s => s.slug === slug);

    const switchShop = (shopId) => {
        const shop = shops.find(s => s.id === shopId);
        if (shop) {
            setCurrentShop(shop);
            sessionStorage.setItem('currentShopId', shopId);
            injectTheme(shop.theme);
        }
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const getEmployeeLabel = (plural = true) => {
        if (!currentShop) return plural ? 'Empleados' : 'Empleado';
        return plural ? currentShop.employeeLabel : currentShop.employeeLabelSingular;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
        }).format(price);
    };

    const isOpenNow = () => {
        if (!currentShop?.schedule) return false;
        const now = new Date();
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = days[now.getDay()];
        const schedule = currentShop.schedule[today];

        if (!schedule?.open || !schedule?.close) return false;

        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [openHour, openMin] = schedule.open.split(':').map(Number);
        const [closeHour, closeMin] = schedule.close.split(':').map(Number);
        const openTime = openHour * 60 + openMin;
        const closeTime = closeHour * 60 + closeMin;

        return currentTime >= openTime && currentTime <= closeTime;
    };

    const value = {
        shops,
        currentShop,
        loading,
        createShop,
        updateShop,
        deleteShop,
        getShopById,
        getShopBySlug,
        switchShop,
        setShopBySlug,
        getEmployeeLabel,
        formatPrice,
        isOpenNow,
        injectTheme,
        generateSlug,
    };

    return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
    const context = useContext(TenantContext);
    if (!context) {
        throw new Error('useTenant debe usarse dentro de TenantProvider');
    }
    return context;
}

export { TenantContext };
