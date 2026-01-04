import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(null);

// Claves de localStorage
const BARBERS_KEY = 'app_balbert_barbers';
const SERVICES_KEY = 'app_balbert_services';
const APPOINTMENTS_KEY = 'app_balbert_appointments';

// Servicios predeterminados
const defaultServices = [
    { id: '1', name: 'Corte Clásico', price: 300, duration: 30, description: 'Corte tradicional con tijera y máquina' },
    { id: '2', name: 'Corte + Barba', price: 500, duration: 45, description: 'Corte completo con arreglo de barba' },
    { id: '3', name: 'Afeitado Clásico', price: 250, duration: 30, description: 'Afeitado con navaja y toalla caliente' },
    { id: '4', name: 'Diseño de Cejas', price: 100, duration: 15, description: 'Perfilado y diseño de cejas' },
    { id: '5', name: 'Tratamiento Capilar', price: 400, duration: 40, description: 'Tratamiento nutritivo para el cabello' },
    { id: '6', name: 'Corte Infantil', price: 200, duration: 25, description: 'Corte especializado para niños' },
];

export function DataProvider({ children }) {
    const [barbers, setBarbers] = useState([]);
    const [services, setServices] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar datos al iniciar
    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        // Cargar barberos
        const storedBarbers = localStorage.getItem(BARBERS_KEY);
        setBarbers(storedBarbers ? JSON.parse(storedBarbers) : []);

        // Cargar servicios (o usar predeterminados)
        const storedServices = localStorage.getItem(SERVICES_KEY);
        if (storedServices) {
            setServices(JSON.parse(storedServices));
        } else {
            setServices(defaultServices);
            localStorage.setItem(SERVICES_KEY, JSON.stringify(defaultServices));
        }

        // Cargar citas
        const storedAppointments = localStorage.getItem(APPOINTMENTS_KEY);
        setAppointments(storedAppointments ? JSON.parse(storedAppointments) : []);

        setLoading(false);
    };

    // ============ BARBEROS ============
    const addBarber = (barberData) => {
        const newBarber = {
            id: Date.now().toString(),
            ...barberData,
            createdAt: new Date().toISOString(),
        };
        const updatedBarbers = [...barbers, newBarber];
        setBarbers(updatedBarbers);
        localStorage.setItem(BARBERS_KEY, JSON.stringify(updatedBarbers));
        return newBarber;
    };

    const updateBarber = (id, barberData) => {
        const updatedBarbers = barbers.map((b) =>
            b.id === id ? { ...b, ...barberData } : b
        );
        setBarbers(updatedBarbers);
        localStorage.setItem(BARBERS_KEY, JSON.stringify(updatedBarbers));
    };

    const deleteBarber = (id) => {
        const updatedBarbers = barbers.filter((b) => b.id !== id);
        setBarbers(updatedBarbers);
        localStorage.setItem(BARBERS_KEY, JSON.stringify(updatedBarbers));
    };

    const getBarberById = (id) => barbers.find((b) => b.id === id);

    // ============ SERVICIOS ============
    const addService = (serviceData) => {
        const newService = {
            id: Date.now().toString(),
            ...serviceData,
        };
        const updatedServices = [...services, newService];
        setServices(updatedServices);
        localStorage.setItem(SERVICES_KEY, JSON.stringify(updatedServices));
        return newService;
    };

    const updateService = (id, serviceData) => {
        const updatedServices = services.map((s) =>
            s.id === id ? { ...s, ...serviceData } : s
        );
        setServices(updatedServices);
        localStorage.setItem(SERVICES_KEY, JSON.stringify(updatedServices));
    };

    const deleteService = (id) => {
        const updatedServices = services.filter((s) => s.id !== id);
        setServices(updatedServices);
        localStorage.setItem(SERVICES_KEY, JSON.stringify(updatedServices));
    };

    // ============ CITAS ============
    const addAppointment = (appointmentData) => {
        const newAppointment = {
            id: Date.now().toString(),
            ...appointmentData,
            status: 'pendiente',
            createdAt: new Date().toISOString(),
        };
        const updatedAppointments = [...appointments, newAppointment];
        setAppointments(updatedAppointments);
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updatedAppointments));
        return newAppointment;
    };

    const updateAppointment = (id, appointmentData) => {
        const updatedAppointments = appointments.map((a) =>
            a.id === id ? { ...a, ...appointmentData } : a
        );
        setAppointments(updatedAppointments);
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updatedAppointments));
    };

    const deleteAppointment = (id) => {
        const updatedAppointments = appointments.filter((a) => a.id !== id);
        setAppointments(updatedAppointments);
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updatedAppointments));
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

    const value = {
        // Data
        barbers,
        services,
        appointments,
        loading,

        // Barbers CRUD
        addBarber,
        updateBarber,
        deleteBarber,
        getBarberById,

        // Services CRUD
        addService,
        updateService,
        deleteService,

        // Appointments CRUD
        addAppointment,
        updateAppointment,
        deleteAppointment,
        getAppointmentsByDate,
        getAppointmentsByBarber,
        getAppointmentsByUser,
        getTodayAppointments,
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
