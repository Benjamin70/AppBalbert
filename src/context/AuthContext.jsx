import { createContext, useContext, useState, useEffect } from 'react';
import shopConfig from '../config/shopConfig';

const AuthContext = createContext(null);

// Constantes de localStorage
const USERS_KEY = 'app_balbert_users';
const CURRENT_USER_KEY = 'app_balbert_current_user';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cargar usuario actual al iniciar
    useEffect(() => {
        const storedUser = localStorage.getItem(CURRENT_USER_KEY);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Obtener usuarios registrados
    const getUsers = () => {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    };

    // Guardar usuarios
    const saveUsers = (users) => {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    };

    // Iniciar sesión
    const login = (email, password) => {
        // Verificar si es admin
        if (
            email === shopConfig.adminCredentials.email &&
            password === shopConfig.adminCredentials.password
        ) {
            const adminUser = {
                id: 'admin',
                email: email,
                name: 'Administrador',
                role: 'admin',
            };
            setUser(adminUser);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
            return { success: true, user: adminUser };
        }

        // Verificar usuarios registrados
        const users = getUsers();
        const foundUser = users.find(
            (u) => u.email === email && u.password === password
        );

        if (foundUser) {
            const { password: _, ...userWithoutPassword } = foundUser;
            setUser(userWithoutPassword);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
            return { success: true, user: userWithoutPassword };
        }

        return { success: false, error: 'Credenciales incorrectas' };
    };

    // Registrar usuario
    const register = (userData) => {
        const users = getUsers();

        // Verificar si el email ya existe
        if (users.some((u) => u.email === userData.email)) {
            return { success: false, error: 'Este correo ya está registrado' };
        }

        const newUser = {
            id: Date.now().toString(),
            ...userData,
            role: 'user',
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        saveUsers(users);

        // Auto login después de registro
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

        return { success: true, user: userWithoutPassword };
    };

    // Cerrar sesión
    const logout = () => {
        setUser(null);
        localStorage.removeItem(CURRENT_USER_KEY);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
}
