/**
 * Sistema i18n básico - Internacionalización
 */

// Traducciones disponibles
const translations = {
    es: {
        // Navegación
        'nav.home': 'Inicio',
        'nav.services': 'Servicios',
        'nav.team': 'Equipo',
        'nav.booking': 'Reservar',
        'nav.myAppointments': 'Mis Citas',
        'nav.login': 'Iniciar Sesión',
        'nav.register': 'Registrarse',
        'nav.logout': 'Cerrar Sesión',
        'nav.admin': 'Administración',

        // Común
        'common.loading': 'Cargando...',
        'common.save': 'Guardar',
        'common.cancel': 'Cancelar',
        'common.delete': 'Eliminar',
        'common.edit': 'Editar',
        'common.add': 'Agregar',
        'common.search': 'Buscar',
        'common.filter': 'Filtrar',
        'common.all': 'Todos',
        'common.none': 'Ninguno',
        'common.yes': 'Sí',
        'common.no': 'No',
        'common.confirm': 'Confirmar',
        'common.back': 'Volver',
        'common.next': 'Siguiente',
        'common.previous': 'Anterior',

        // Citas
        'appointments.title': 'Citas',
        'appointments.new': 'Nueva Cita',
        'appointments.date': 'Fecha',
        'appointments.time': 'Hora',
        'appointments.status': 'Estado',
        'appointments.pending': 'Pendiente',
        'appointments.confirmed': 'Confirmada',
        'appointments.completed': 'Completada',
        'appointments.cancelled': 'Cancelada',
        'appointments.noAppointments': 'No hay citas',

        // Servicios
        'services.title': 'Servicios',
        'services.price': 'Precio',
        'services.duration': 'Duración',
        'services.minutes': 'minutos',

        // Empleados
        'employees.title': 'Empleados',
        'employees.specialty': 'Especialidad',
        'employees.commission': 'Comisión',

        // Clientes
        'clients.title': 'Clientes',
        'clients.name': 'Nombre',
        'clients.phone': 'Teléfono',
        'clients.email': 'Correo',

        // Admin
        'admin.dashboard': 'Dashboard',
        'admin.analytics': 'Analytics',
        'admin.inventory': 'Inventario',
        'admin.reviews': 'Reseñas',
        'admin.loyalty': 'Fidelidad',
        'admin.giftCards': 'Tarjetas de Regalo',
        'admin.gallery': 'Galería',
        'admin.settings': 'Configuración',

        // Mensajes
        'msg.success': '¡Éxito!',
        'msg.error': 'Error',
        'msg.saved': 'Guardado correctamente',
        'msg.deleted': 'Eliminado correctamente',
        'msg.confirmDelete': '¿Estás seguro de eliminar?',
    },

    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.services': 'Services',
        'nav.team': 'Team',
        'nav.booking': 'Book',
        'nav.myAppointments': 'My Appointments',
        'nav.login': 'Login',
        'nav.register': 'Register',
        'nav.logout': 'Logout',
        'nav.admin': 'Admin',

        // Common
        'common.loading': 'Loading...',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.add': 'Add',
        'common.search': 'Search',
        'common.filter': 'Filter',
        'common.all': 'All',
        'common.none': 'None',
        'common.yes': 'Yes',
        'common.no': 'No',
        'common.confirm': 'Confirm',
        'common.back': 'Back',
        'common.next': 'Next',
        'common.previous': 'Previous',

        // Appointments
        'appointments.title': 'Appointments',
        'appointments.new': 'New Appointment',
        'appointments.date': 'Date',
        'appointments.time': 'Time',
        'appointments.status': 'Status',
        'appointments.pending': 'Pending',
        'appointments.confirmed': 'Confirmed',
        'appointments.completed': 'Completed',
        'appointments.cancelled': 'Cancelled',
        'appointments.noAppointments': 'No appointments',

        // Services
        'services.title': 'Services',
        'services.price': 'Price',
        'services.duration': 'Duration',
        'services.minutes': 'minutes',

        // Employees
        'employees.title': 'Employees',
        'employees.specialty': 'Specialty',
        'employees.commission': 'Commission',

        // Clients
        'clients.title': 'Clients',
        'clients.name': 'Name',
        'clients.phone': 'Phone',
        'clients.email': 'Email',

        // Admin
        'admin.dashboard': 'Dashboard',
        'admin.analytics': 'Analytics',
        'admin.inventory': 'Inventory',
        'admin.reviews': 'Reviews',
        'admin.loyalty': 'Loyalty',
        'admin.giftCards': 'Gift Cards',
        'admin.gallery': 'Gallery',
        'admin.settings': 'Settings',

        // Messages
        'msg.success': 'Success!',
        'msg.error': 'Error',
        'msg.saved': 'Saved successfully',
        'msg.deleted': 'Deleted successfully',
        'msg.confirmDelete': 'Are you sure you want to delete?',
    },
};

// Idioma actual (guardado en localStorage)
const LANG_KEY = 'beautyhub_language';

/**
 * Obtiene el idioma actual
 * @returns {string} Código de idioma (es, en)
 */
export const getCurrentLanguage = () => {
    return localStorage.getItem(LANG_KEY) || 'es';
};

/**
 * Establece el idioma actual
 * @param {string} lang - Código de idioma
 */
export const setLanguage = (lang) => {
    if (translations[lang]) {
        localStorage.setItem(LANG_KEY, lang);
        // Disparar evento para que los componentes se actualicen
        window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
    }
};

/**
 * Traduce una clave
 * @param {string} key - Clave de traducción
 * @param {Object} params - Parámetros para interpolación
 * @returns {string} Texto traducido
 */
export const t = (key, params = {}) => {
    const lang = getCurrentLanguage();
    let text = translations[lang]?.[key] || translations['es']?.[key] || key;

    // Interpolación básica: {{variable}}
    Object.keys(params).forEach(param => {
        text = text.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
    });

    return text;
};

/**
 * Obtiene todas las traducciones del idioma actual
 * @returns {Object} Objeto con traducciones
 */
export const getAllTranslations = () => {
    const lang = getCurrentLanguage();
    return translations[lang] || translations['es'];
};

/**
 * Obtiene los idiomas disponibles
 * @returns {Array} Lista de idiomas
 */
export const getAvailableLanguages = () => [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
];

export default { t, getCurrentLanguage, setLanguage, getAvailableLanguages };
