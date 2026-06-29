import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = 'wayfy_token';
const EXPIRATION_STORAGE_KEY = 'wayfy_token_expiration';

const getStoredToken = () => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    return storedToken && storedToken !== 'undefined' && storedToken !== 'null'
        ? storedToken
        : null;
};

const decodeToken = (tokenValue) => {
    const decoded = jwtDecode(tokenValue);

    return {
        ...decoded,
        id: decoded.id ?? decoded.sub ?? null,
    };
};

const persistSession = (tokenValue, expiresIn) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, tokenValue);
    localStorage.setItem(
        EXPIRATION_STORAGE_KEY,
        (Date.now() + expiresIn * 1000).toString(),
    );
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        return getStoredToken();
    });

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const expiration = localStorage.getItem(EXPIRATION_STORAGE_KEY);

        if (!token || !expiration) {
            logout();
            setLoading(false);
            return;
        }

        const now = Date.now();

        if (now >= Number(expiration)) {
            logout();
            setLoading(false);
            return;
        }

        try {
            setUser(decodeToken(token));
        } catch (error) {
            logout();
            setLoading(false);
            return;
        }

        setLoading(false);
    }, [token]);

    const setSession = (tokenValue, expiresIn) => {
        persistSession(tokenValue, expiresIn);

        setToken(tokenValue);

        const decoded = decodeToken(tokenValue);
        setUser(decoded);

        return decoded;
    };

    const login = async (email, password) => {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            },
        );

        const data = await response.json();

        if (!response.ok) throw new Error(data.msg || 'Error en login');

        return setSession(data.token, data.expiresIn);
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(EXPIRATION_STORAGE_KEY);
        setToken(null);
        setUser(null);
    };

    const updateUserContext = (updateData, newToken, newExpiresIn) => {
        if (newToken) {
            persistSession(newToken, newExpiresIn ?? 3600);
            setToken(newToken);
            setUser(decodeToken(newToken));
            return;
        }

        setUser((prevUser) => {
            if (!prevUser) return null;

            return {
                ...prevUser,
                ...updateData,
            };
        });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                loading,
                updateUserContext,
                setSession,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
