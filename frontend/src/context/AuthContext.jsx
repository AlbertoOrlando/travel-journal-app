import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

// Contesto Auth
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [loadingRegister, setLoadingRegister] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Caricamento utente da localStorage all'avvio
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
        setInitialLoading(false);
    }, []);

    // Funzione di login
    const login = async ({ email, password }) => {
        setLoadingLogin(true);

        // Validazioni base lato client
        if (!email.includes('@')) {
            setLoadingLogin(false);
            return { success: false, msg: 'Email non valida' };
        }
        if (!password || password.length < 4) {
            setLoadingLogin(false);
            return { success: false, msg: 'Password troppo corta' };
        }

        try {
            const { token, user: userPayload } = await api.login({ email, password });
            const userData = userPayload || { email };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);
            return { success: true };
        } catch (err) {
            return { success: false, msg: err.message || 'Email o password non corretti' };
        } finally {
            setLoadingLogin(false);
        }
    };

    // Funzione di registrazione
    const register = async ({ username, email, password }) => {
        setLoadingRegister(true);

        // Validazioni base lato client
        if (!username || username.length < 3) {
            setLoadingRegister(false);
            return { success: false, msg: 'Username troppo corto' };
        }
        if (!email.includes('@')) {
            setLoadingRegister(false);
            return { success: false, msg: 'Email non valida' };
        }
        if (!password || password.length < 4) {
            setLoadingRegister(false);
            return { success: false, msg: 'Password troppo corta' };
        }

        try {
            const { token, user: userPayload } = await api.register({ username, email, password });
            const newUser = userPayload || { username, email };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            localStorage.setItem('token', token);
            return { success: true };
        } catch (err) {
            return { success: false, msg: err.message || 'Errore di registrazione' };
        } finally {
            setLoadingRegister(false);
        }
    };

    // Logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                loadingLogin,
                loadingRegister,
                initialLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizzato
export const useAuth = () => useContext(AuthContext);
