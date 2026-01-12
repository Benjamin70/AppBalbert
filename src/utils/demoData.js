/**
 * Demo Data Initializer
 * Crea datos de demostración para el shop demo
 */

const DEMO_SHOP_ID = 'shop_demo';

// Servicios demo
const demoServices = [
    { id: 'svc_demo_1', shopId: DEMO_SHOP_ID, name: 'Corte Clásico', price: 300, duration: 30, description: 'Corte tradicional con tijera y máquina' },
    { id: 'svc_demo_2', shopId: DEMO_SHOP_ID, name: 'Corte + Barba', price: 500, duration: 45, description: 'Corte completo con arreglo de barba profesional' },
    { id: 'svc_demo_3', shopId: DEMO_SHOP_ID, name: 'Afeitado Clásico', price: 250, duration: 30, description: 'Afeitado con navaja y toalla caliente' },
    { id: 'svc_demo_4', shopId: DEMO_SHOP_ID, name: 'Diseño de Cejas', price: 100, duration: 15, description: 'Perfilado y diseño de cejas' },
    { id: 'svc_demo_5', shopId: DEMO_SHOP_ID, name: 'Tratamiento Capilar', price: 400, duration: 40, description: 'Tratamiento nutritivo premium para el cabello' },
    { id: 'svc_demo_6', shopId: DEMO_SHOP_ID, name: 'Corte Infantil', price: 200, duration: 25, description: 'Corte especializado para niños' },
];

// Empleados demo
const demoEmployees = [
    {
        id: 'emp_demo_1',
        shopId: DEMO_SHOP_ID,
        name: 'Carlos Rodríguez',
        specialty: 'Cortes Clásicos',
        phone: '809-555-0001',
        email: 'carlos@demo.com',
        commission: 35,
        avatar: null,
        createdAt: '2025-01-01T10:00:00Z',
    },
    {
        id: 'emp_demo_2',
        shopId: DEMO_SHOP_ID,
        name: 'Miguel Santos',
        specialty: 'Barba y Afeitado',
        phone: '809-555-0002',
        email: 'miguel@demo.com',
        commission: 30,
        avatar: null,
        createdAt: '2025-01-01T10:00:00Z',
    },
];

// Usuario admin demo
const demoAdmin = {
    id: 'admin_demo',
    name: 'Admin Demo',
    email: 'admin@demo.com',
    password: 'demo123',
    phone: '809-555-0000',
    role: 'admin',
    shopId: DEMO_SHOP_ID,
    createdAt: '2025-01-01T10:00:00Z',
};

// Citas de ejemplo (completadas)
const generateDemoAppointments = () => {
    const today = new Date();
    const appointments = [];

    // Citas de los últimos 7 días
    for (let i = 1; i <= 5; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        appointments.push({
            id: `apt_demo_${i}`,
            shopId: DEMO_SHOP_ID,
            clientName: `Cliente Demo ${i}`,
            clientEmail: `cliente${i}@demo.com`,
            clientPhone: `809-555-100${i}`,
            barberId: i % 2 === 0 ? 'emp_demo_1' : 'emp_demo_2',
            services: [demoServices[i % demoServices.length]],
            date: dateStr,
            time: `${9 + i}:00`,
            status: 'completed',
            total: demoServices[i % demoServices.length].price,
            rating: 4 + (i % 2),
            review: i % 2 === 0 ? '¡Excelente servicio!' : null,
            createdAt: date.toISOString(),
        });
    }

    return appointments;
};

/**
 * Inicializa todos los datos demo
 */
export const initializeDemoData = () => {
    // Solo inicializar si no hay datos demo existentes
    const existingServices = JSON.parse(localStorage.getItem('beautyhub_services') || '[]');
    const hasDemoServices = existingServices.some(s => s.id?.startsWith('svc_demo_'));

    if (hasDemoServices) {
        console.log('Demo data already initialized');
        return false;
    }

    // Agregar servicios demo
    const allServices = [...existingServices, ...demoServices];
    localStorage.setItem('beautyhub_services', JSON.stringify(allServices));

    // Agregar empleados demo
    const existingEmployees = JSON.parse(localStorage.getItem('beautyhub_barbers') || '[]');
    const allEmployees = [...existingEmployees, ...demoEmployees];
    localStorage.setItem('beautyhub_barbers', JSON.stringify(allEmployees));

    // Agregar admin demo
    const existingUsers = JSON.parse(localStorage.getItem('beautyhub_users') || '[]');
    if (!existingUsers.some(u => u.email === 'admin@demo.com')) {
        existingUsers.push(demoAdmin);
        localStorage.setItem('beautyhub_users', JSON.stringify(existingUsers));
    }

    // Agregar citas demo
    const existingAppointments = JSON.parse(localStorage.getItem('beautyhub_appointments') || '[]');
    const demoAppointments = generateDemoAppointments();
    const allAppointments = [...existingAppointments, ...demoAppointments];
    localStorage.setItem('beautyhub_appointments', JSON.stringify(allAppointments));

    console.log('Demo data initialized successfully');
    return true;
};

/**
 * Verifica si los datos demo están inicializados
 */
export const isDemoDataInitialized = () => {
    const services = JSON.parse(localStorage.getItem('beautyhub_services') || '[]');
    return services.some(s => s.id?.startsWith('svc_demo_'));
};

export { DEMO_SHOP_ID, demoServices, demoEmployees, demoAdmin };
