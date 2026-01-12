/**
 * Email Mock Utility - Simula el envío de emails
 * Los emails se guardan en localStorage para demostración
 */

const EMAIL_LOG_KEY = 'beautyhub_email_log';

/**
 * Obtiene el historial de emails "enviados"
 * @returns {Array} Lista de emails
 */
export const getEmailLog = () => {
    const log = localStorage.getItem(EMAIL_LOG_KEY);
    return log ? JSON.parse(log) : [];
};

/**
 * Guarda un email en el log
 * @param {Object} email - Email a guardar
 */
const saveEmailToLog = (email) => {
    const log = getEmailLog();
    log.unshift(email); // Más recientes primero
    // Limitar a 50 emails
    if (log.length > 50) log.pop();
    localStorage.setItem(EMAIL_LOG_KEY, JSON.stringify(log));
};

/**
 * Simula el envío de un email
 * @param {Object} options - Opciones del email
 * @returns {Promise} Promesa que resuelve con el resultado
 */
export const sendEmail = async ({ to, subject, body, type = 'general', shopId = null }) => {
    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 500));

    const email = {
        id: `email_${Date.now()}`,
        to,
        subject,
        body,
        type, // confirmation, reminder, welcome, etc.
        shopId,
        sentAt: new Date().toISOString(),
        status: 'sent', // sent, failed
    };

    saveEmailToLog(email);

    console.log(`📧 [MOCK] Email enviado a ${to}:`, subject);

    return { success: true, email };
};

/**
 * Envía email de confirmación de cita
 * @param {Object} appointment - Datos de la cita
 * @param {Object} shop - Datos del negocio
 * @returns {Promise}
 */
export const sendAppointmentConfirmation = async (appointment, shop = {}) => {
    const shopName = shop.name || 'Nuestro negocio';
    const services = appointment.services?.map(s => s.name).join(', ') || 'Servicio';

    return sendEmail({
        to: appointment.clientEmail || appointment.email,
        subject: `✅ Cita Confirmada - ${shopName}`,
        body: `
            <h2>¡Tu cita ha sido confirmada!</h2>
            <p>Hola ${appointment.clientName || 'Cliente'},</p>
            <p>Tu cita en <strong>${shopName}</strong> está confirmada:</p>
            <ul>
                <li><strong>Fecha:</strong> ${appointment.date}</li>
                <li><strong>Hora:</strong> ${appointment.time}</li>
                <li><strong>Servicio(s):</strong> ${services}</li>
                <li><strong>Total:</strong> RD$${(appointment.total || 0).toLocaleString()}</li>
            </ul>
            <p>¡Te esperamos!</p>
            <p><em>${shopName}</em></p>
        `,
        type: 'confirmation',
        shopId: shop.id,
    });
};

/**
 * Envía email de recordatorio de cita
 * @param {Object} appointment - Datos de la cita
 * @param {Object} shop - Datos del negocio
 * @returns {Promise}
 */
export const sendAppointmentReminder = async (appointment, shop = {}) => {
    const shopName = shop.name || 'Nuestro negocio';
    const services = appointment.services?.map(s => s.name).join(', ') || 'Servicio';

    return sendEmail({
        to: appointment.clientEmail || appointment.email,
        subject: `⏰ Recordatorio de Cita - ${shopName}`,
        body: `
            <h2>Recordatorio de tu cita</h2>
            <p>Hola ${appointment.clientName || 'Cliente'},</p>
            <p>Te recordamos que tienes una cita programada en <strong>${shopName}</strong>:</p>
            <ul>
                <li><strong>Fecha:</strong> ${appointment.date}</li>
                <li><strong>Hora:</strong> ${appointment.time}</li>
                <li><strong>Servicio(s):</strong> ${services}</li>
            </ul>
            <p>Si necesitas reprogramar, contáctanos con anticipación.</p>
            <p>¡Te esperamos!</p>
            <p><em>${shopName}</em></p>
        `,
        type: 'reminder',
        shopId: shop.id,
    });
};

/**
 * Envía email de bienvenida a nuevo usuario
 * @param {Object} user - Datos del usuario
 * @param {Object} shop - Datos del negocio
 * @returns {Promise}
 */
export const sendWelcomeEmail = async (user, shop = {}) => {
    const shopName = shop.name || 'BeautyHub';

    return sendEmail({
        to: user.email,
        subject: `🎉 ¡Bienvenido a ${shopName}!`,
        body: `
            <h2>¡Bienvenido a ${shopName}!</h2>
            <p>Hola ${user.name || 'Usuario'},</p>
            <p>Gracias por registrarte con nosotros.</p>
            <p>Ya puedes comenzar a reservar tus citas y disfrutar de nuestros servicios.</p>
            <p>¡Te esperamos pronto!</p>
            <p><em>El equipo de ${shopName}</em></p>
        `,
        type: 'welcome',
        shopId: shop.id,
    });
};

/**
 * Limpia el log de emails
 */
export const clearEmailLog = () => {
    localStorage.removeItem(EMAIL_LOG_KEY);
};
