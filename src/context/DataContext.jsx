import { createContext, useContext, useState, useEffect } from 'react';
import { useTenant } from './TenantContext';

const DataContext = createContext(null);

// Claves de localStorage
const BARBERS_KEY = 'beautyhub_barbers';
const SERVICES_KEY = 'beautyhub_services';
const APPOINTMENTS_KEY = 'beautyhub_appointments';
const USERS_KEY = 'beautyhub_users';
const PRODUCTS_KEY = 'beautyhub_products';

// Servicios predeterminados para el shop demo
const defaultServices = [
    { id: '1', shopId: 'shop_demo', name: 'Corte Clásico', price: 300, duration: 30, description: 'Corte tradicional con tijera y máquina' },
    { id: '2', shopId: 'shop_demo', name: 'Corte + Barba', price: 500, duration: 45, description: 'Corte completo con arreglo de barba' },
    { id: '3', shopId: 'shop_demo', name: 'Afeitado Clásico', price: 250, duration: 30, description: 'Afeitado con navaja y toalla caliente' },
    { id: '4', shopId: 'shop_demo', name: 'Diseño de Cejas', price: 100, duration: 15, description: 'Perfilado y diseño de cejas' },
    { id: '5', shopId: 'shop_demo', name: 'Tratamiento Capilar', price: 400, duration: 40, description: 'Tratamiento nutritivo para el cabello' },
    { id: '6', shopId: 'shop_demo', name: 'Corte Infantil', price: 200, duration: 25, description: 'Corte especializado para niños' },
];

export function DataProvider({ children }) {
    // Obtener shop actual del TenantContext
    const { currentShop } = useTenant();
    const shopId = currentShop?.id;

    // Estado global (todos los datos)
    const [allBarbers, setAllBarbers] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [allAppointments, setAllAppointments] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar datos al iniciar
    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        // Cargar barberos
        const storedBarbers = localStorage.getItem(BARBERS_KEY);
        setAllBarbers(storedBarbers ? JSON.parse(storedBarbers) : []);

        // Cargar servicios (o usar predeterminados)
        const storedServices = localStorage.getItem(SERVICES_KEY);
        if (storedServices) {
            setAllServices(JSON.parse(storedServices));
        } else {
            setAllServices(defaultServices);
            localStorage.setItem(SERVICES_KEY, JSON.stringify(defaultServices));
        }

        // Cargar citas
        const storedAppointments = localStorage.getItem(APPOINTMENTS_KEY);
        setAllAppointments(storedAppointments ? JSON.parse(storedAppointments) : []);

        // Cargar productos
        const storedProducts = localStorage.getItem(PRODUCTS_KEY);
        setAllProducts(storedProducts ? JSON.parse(storedProducts) : []);

        setLoading(false);
    };

    // ============ FILTRAR POR SHOP ACTUAL ============
    const barbers = allBarbers.filter(b => b.shopId === shopId);
    const services = allServices.filter(s => s.shopId === shopId);
    const appointments = allAppointments.filter(a => a.shopId === shopId);
    const products = allProducts.filter(p => p.shopId === shopId);

    // ============ BARBEROS/EMPLEADOS ============
    const addBarber = (barberData) => {
        const newBarber = {
            id: Date.now().toString(),
            shopId: shopId, // Vincular al shop actual
            commission: 30, // Comisión por defecto
            ...barberData,
            createdAt: new Date().toISOString(),
        };
        const updated = [...allBarbers, newBarber];
        setAllBarbers(updated);
        localStorage.setItem(BARBERS_KEY, JSON.stringify(updated));
        return newBarber;
    };

    const updateBarber = (id, barberData) => {
        const updated = allBarbers.map((b) =>
            b.id === id ? { ...b, ...barberData } : b
        );
        setAllBarbers(updated);
        localStorage.setItem(BARBERS_KEY, JSON.stringify(updated));
    };

    const deleteBarber = (id) => {
        const updated = allBarbers.filter((b) => b.id !== id);
        setAllBarbers(updated);
        localStorage.setItem(BARBERS_KEY, JSON.stringify(updated));
    };

    const getBarberById = (id) => allBarbers.find((b) => b.id === id);

    // ============ SERVICIOS ============
    const addService = (serviceData) => {
        const newService = {
            id: Date.now().toString(),
            shopId: shopId, // Vincular al shop actual
            ...serviceData,
        };
        const updated = [...allServices, newService];
        setAllServices(updated);
        localStorage.setItem(SERVICES_KEY, JSON.stringify(updated));
        return newService;
    };

    const updateService = (id, serviceData) => {
        const updated = allServices.map((s) =>
            s.id === id ? { ...s, ...serviceData } : s
        );
        setAllServices(updated);
        localStorage.setItem(SERVICES_KEY, JSON.stringify(updated));
    };

    const deleteService = (id) => {
        const updated = allServices.filter((s) => s.id !== id);
        setAllServices(updated);
        localStorage.setItem(SERVICES_KEY, JSON.stringify(updated));
    };

    // ============ PRODUCTOS/INVENTARIO ============
    const addProduct = (productData) => {
        const newProduct = {
            id: Date.now().toString(),
            shopId: shopId,
            stock: 0,
            ...productData,
            createdAt: new Date().toISOString(),
        };
        const updated = [...allProducts, newProduct];
        setAllProducts(updated);
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
        return newProduct;
    };

    const updateProduct = (id, productData) => {
        const updated = allProducts.map((p) =>
            p.id === id ? { ...p, ...productData } : p
        );
        setAllProducts(updated);
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    };

    const deleteProduct = (id) => {
        const updated = allProducts.filter((p) => p.id !== id);
        setAllProducts(updated);
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    };

    // ============ CITAS ============
    const addAppointment = (appointmentData) => {
        const newAppointment = {
            id: Date.now().toString(),
            shopId: shopId, // Vincular al shop actual
            ...appointmentData,
            status: 'pendiente',
            createdAt: new Date().toISOString(),
        };
        const updated = [...allAppointments, newAppointment];
        setAllAppointments(updated);
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
        return newAppointment;
    };

    const updateAppointment = (id, appointmentData) => {
        const updated = allAppointments.map((a) =>
            a.id === id ? { ...a, ...appointmentData } : a
        );
        setAllAppointments(updated);
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
    };

    const deleteAppointment = (id) => {
        const updated = allAppointments.filter((a) => a.id !== id);
        setAllAppointments(updated);
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
    };

    const getAppointmentsByDate = (date) => {
        return appointments.filter((a) => a.date === date);
    };

    const getAppointmentsByBarber = (barberId) => {
        return appointments.filter((a) => a.barberId === barberId);
    };

    const getAppointmentsByUser = (userId) => {
        return appointments.filter((a) => a.userId === userId);
    };

    const getTodayAppointments = () => {
        const today = new Date().toISOString().split('T')[0];
        return getAppointmentsByDate(today);
    };

    // ============ ESTADÍSTICAS ============
    const getStats = () => {
        const today = new Date().toISOString().split('T')[0];
        const thisMonth = new Date().toISOString().slice(0, 7);

        const todayAppts = appointments.filter(a => a.date === today);
        const monthAppts = appointments.filter(a => a.date?.startsWith(thisMonth));

        const totalRevenue = monthAppts.reduce((sum, a) => sum + (a.total || 0), 0);
        const pendingAppts = appointments.filter(a => a.status === 'pendiente');

        return {
            todayCount: todayAppts.length,
            monthCount: monthAppts.length,
            totalRevenue,
            pendingCount: pendingAppts.length,
            barbersCount: barbers.length,
            servicesCount: services.length,
            productsCount: products.length,
        };
    };

    const value = {
        // Data (filtrada por shop actual)
        barbers,
        services,
        appointments,
        products,
        loading,

        // Barbers/Empleados CRUD
        addBarber,
        updateBarber,
        deleteBarber,
        getBarberById,

        // Services CRUD
        addService,
        updateService,
        deleteService,

        // Products CRUD
        addProduct,
        updateProduct,
        deleteProduct,

        // Appointments CRUD
        addAppointment,
        updateAppointment,
        deleteAppointment,
        getAppointmentsByDate,
        getAppointmentsByBarber,
        getAppointmentsByUser,
        getTodayAppointments,

        // Stats
        getStats,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData debe usarse dentro de DataProvider');
    }
    return context;
}
