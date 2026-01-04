// Configuración de la tienda - Multi-Tenancy Ready
// Este archivo puede ser reemplazado por una API call en el futuro

const shopConfig = {
    // Información básica de la barbería
    name: "Ricky Stylo",
    slogan: "Tu estilo, nuestra pasión",
    description: "La mejor barbería de la ciudad con los mejores profesionales",

    // Contacto
    phone: "+1 809-555-0123",
    email: "contacto@rickystylo.com",
    address: "Calle Principal #123, Santo Domingo",

    // Horario de atención
    schedule: {
        monday: { open: "09:00", close: "20:00" },
        tuesday: { open: "09:00", close: "20:00" },
        wednesday: { open: "09:00", close: "20:00" },
        thursday: { open: "09:00", close: "20:00" },
        friday: { open: "09:00", close: "21:00" },
        saturday: { open: "08:00", close: "18:00" },
        sunday: { open: null, close: null }, // Cerrado
    },

    // Redes sociales
    social: {
        instagram: "https://instagram.com/rickystylo",
        facebook: "https://facebook.com/rickystylo",
        whatsapp: "+18095550123",
    },

    // Configuración de citas
    appointmentSettings: {
        minAdvanceMinutes: 30, // Mínimo 30 min de anticipación
        maxAdvanceDays: 30, // Máximo 30 días de anticipación
        slotDurationMinutes: 30, // Duración de cada slot
        earlyArrivalMinutes: 5, // Advertencia: llegar 5 min antes
    },

    // Credenciales de admin (esto se movería a backend en producción)
    adminCredentials: {
        email: "admin@barberia.com",
        password: "123456",
    },
};

export default shopConfig;
