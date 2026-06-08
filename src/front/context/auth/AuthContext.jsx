import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('wayfy_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const expiration = localStorage.getItem('wayfy_token_expiration');

        // Verificar si el token existe y si aún es válido
        if (token && expiration) {
            const now = new Date().getTime();
            if (now < parseInt(expiration)) {
                // El token es válido (puedes guardar aquí más info del usuario si tu backend la dio)
                setUser({ loggedIn: true });
            } else {
                // El token expiró
                logout();
            }
        }
        setLoading(false);
    }, [token]);

    const login = (backendData) => {
        // backendData debería traer: { token, expiresIn (en segundos o ms), user... }
        const { token, expiresIn } = backendData;

        // Calcular fecha de expiración absoluta (ahora + tiempo de vida del token)
        const expirationTime = new Date().getTime() + expiresIn;

        localStorage.setItem('wayfy_token', token);
        localStorage.setItem('wayfy_token_expiration', expirationTime.toString());

        setToken(token);
        setUser({ loggedIn: true });
    };

    const logout = () => {
        localStorage.removeItem('wayfy_token');
        localStorage.removeItem('wayfy_token_expiration');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);