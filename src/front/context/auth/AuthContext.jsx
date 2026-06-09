import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        const t = sessionStorage.getItem('wayfy_token')

        return t && t !== 'undefined' && t !== 'null' ? t : null
    });

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const expiration = sessionStorage.getItem('wayfy_token_expiration')

        if (!token || !expiration) {
            logout()
            setLoading(false)
            return
        }

        const now = Date.now()

        if (now >= Number(expiration)) {
            logout()
            setLoading(false)
            return
        }

        try {
            const decoded = jwtDecode(token)
            setUser(decoded)
        } catch (error) {
            logout()
        }

        setLoading(false)

    }, [token]);

    const login = async (email, password) => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.msg || 'Error en login');

        const { token, expiresIn } = data;

        const expirationTime = Date.now() + expiresIn * 1000;

        sessionStorage.setItem('wayfy_token', token);
        sessionStorage.setItem('wayfy_token_expiration', expirationTime.toString());

        setToken(token);

        const decoded = jwtDecode(token)
        setUser(decoded);

        return decoded;
    };

    const logout = () => {
        sessionStorage.removeItem('wayfy_token');
        sessionStorage.removeItem('wayfy_token_expiration');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
