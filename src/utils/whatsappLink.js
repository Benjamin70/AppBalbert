/**
 * WhatsApp Utility - Genera enlaces y mensajes para WhatsApp
 */

/**
 * Formatea un número de teléfono para WhatsApp
 * @param {string} phone - Número de teléfono
 * @returns {string} Número formateado (solo dígitos)
 */
export const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return '';
    // Remover todo excepto dígitos
    let cleaned = phone.replace(/\D/g, '');
    // Si empieza con 809, 829, 849 (RD), agregar código de país
    if (/^(809|829|849)/.test(cleaned) && cleaned.length === 10) {
        cleaned = '1' + cleaned;
    }
    return cleaned;
};

/**
 * Genera un enlace de WhatsApp con mensaje
 * @param {string} phone - Número de teléfono
 * @param {string} message - Mensaje a enviar
 * @returns {string} URL de WhatsApp
 */
export const generateWhatsAppLink = (phone, message = '') => {
    const formattedPhone = formatPhoneForWhatsApp(phone);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedPhone}${message ? `?text=${encodedMessage}` : ''}`;
};

/**
 * Genera mensaje de recordatorio de cita
 * @param {Object} appointment - Datos de la cita
 * @param {Object} shop - Datos del negocio
 * @returns {string} Mensaje formateado
 */
export const generateAppointmentReminder = (appointment, shop = {}) => {
    const shopName = shop.name || 'Nuestro negocio';
    const date = appointment.date || 'fecha programada';
    const time = appointment.time || 'hora acordada';
    const services = appointment.services?.map(s => s.name).join(', ') || 'tu servicio';

    return `¡Hola ${appointment.clientName || 'estimado cliente'}! 👋

Te recordamos tu cita en *${shopName}*:

📅 Fecha: ${date}
⏰ Hora: ${time}
💇 Servicio(s): ${services}

¡Te esperamos! ✨

_Mensaje enviado desde ${shopName}_`;
};

/**
 * Genera mensaje de confirmación de cita
 * @param {Object} appointment - Datos de la cita
 * @param {Object} shop - Datos del negocio
 * @returns {string} Mensaje formateado
 */
export const generateAppointmentConfirmation = (appointment, shop = {}) => {
    const shopName = shop.name || 'Nuestro negocio';
    const date = appointment.date || 'fecha programada';
    const time = appointment.time || 'hora acordada';
    const services = appointment.services?.map(s => s.name).join(', ') || 'tu servicio';
    const total = appointment.total || 0;

    return `¡Gracias por reservar con nosotros! 🎉

Tu cita en *${shopName}* ha sido confirmada:

📅 Fecha: ${date}
⏰ Hora: ${time}
💇 Servicio(s): ${services}
💰 Total: RD$${total.toLocaleString()}

Si necesitas cancelar o reprogramar, contáctanos.

_${shopName}_`;
};

/**
 * Genera mensaje de bienvenida para nuevo cliente
 * @param {Object} shop - Datos del negocio
 * @returns {string} Mensaje formateado
 */
export const generateWelcomeMessage = (shop = {}) => {
    const shopName = shop.name || 'nuestro negocio';
    const phone = shop.contact?.phone || '';
    const address = shop.address || '';

    return `¡Bienvenido a *${shopName}*! 🌟

Estamos encantados de tenerte como cliente.

${address ? `📍 Ubicación: ${address}` : ''}
${phone ? `📞 Teléfono: ${phone}` : ''}

Reserva tu cita y descubre nuestros servicios.

¡Te esperamos! ✨`;
};

/**
 * Abre WhatsApp con el mensaje especificado
 * @param {string} phone - Número de teléfono
 * @param {string} message - Mensaje a enviar
 */
export const openWhatsApp = (phone, message = '') => {
    const link = generateWhatsAppLink(phone, message);
    window.open(link, '_blank');
};
