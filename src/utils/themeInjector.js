/**
 * themeInjector.js - Utilidad para inyectar variables CSS dinámicas
 */

// Paletas predefinidas
export const colorPalettes = [
    { name: 'Dorado Clásico', primary: '#D4A574', secondary: '#1A1A2E', accent: '#C9956C' },
    { name: 'Rosa Elegante', primary: '#E91E8C', secondary: '#1A1A2E', accent: '#FF4D9D' },
    { name: 'Azul Moderno', primary: '#3B82F6', secondary: '#0F172A', accent: '#60A5FA' },
    { name: 'Verde Natural', primary: '#10B981', secondary: '#064E3B', accent: '#34D399' },
    { name: 'Morado Lujoso', primary: '#8B5CF6', secondary: '#1E1B4B', accent: '#A78BFA' },
    { name: 'Coral Vibrante', primary: '#F97316', secondary: '#1C1917', accent: '#FB923C' },
];

/**
 * Inyecta las variables CSS del tema en el documento
 * @param {Object} theme - Objeto con primary, secondary, accent
 */
export function injectTheme(theme) {
    if (!theme) return;

    const root = document.documentElement;

    // Colores principales
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent || theme.primary);

    // Variantes con opacidad
    root.style.setProperty('--color-primary-10', `${theme.primary}1A`);
    root.style.setProperty('--color-primary-20', `${theme.primary}33`);
    root.style.setProperty('--color-primary-50', `${theme.primary}80`);
}

/**
 * Genera un color más claro u oscuro
 * @param {string} hex - Color hexadecimal
 * @param {number} percent - Porcentaje (-100 a 100)
 */
export function adjustColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;

    return '#' + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
}

/**
 * Obtiene el color de texto apropiado (blanco o negro) según el fondo
 * @param {string} bgColor - Color de fondo hexadecimal
 */
export function getContrastColor(bgColor) {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
}

export default { injectTheme, adjustColor, getContrastColor, colorPalettes };
