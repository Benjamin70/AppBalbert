import { createContext, useContext } from 'react';
import shopConfig from '../config/shopConfig';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
    // En el futuro, esto se cargará desde una API según el tenant
    const shop = shopConfig;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
        }).format(price);
    };

    const isOpenNow = () => {
        const now = new Date();
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = days[now.getDay()];
        const schedule = shop.schedule[today];

        if (!schedule.open || !schedule.close) return false;

        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [openHour, openMin] = schedule.open.split(':').map(Number);
        const [closeHour, closeMin] = schedule.close.split(':').map(Number);
        const openTime = openHour * 60 + openMin;
        const closeTime = closeHour * 60 + closeMin;

        return currentTime >= openTime && currentTime <= closeTime;
    };

    const getScheduleForDay = (day) => shop.schedule[day];

    const value = {
        shop,
        formatPrice,
        isOpenNow,
        getScheduleForDay,
    };

    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error('useShop debe usarse dentro de ShopProvider');
    }
    return context;
}
