import { useCallback, useState } from 'react';
import { useAuth } from '../../../context/auth/AuthContext';
import useGlobalReducer from '../../../hooks/useGlobalReducer';
import { favoritesApi } from '../services/favorites.api';

export const useFavorites = () => {
    const { user, token } = useAuth();
    const { state, dispatch } = useGlobalReducer();
    const { favorites } = state;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadFavorites = useCallback(async () => {
        if (!user || !token) return;

        try {
            const data = await favoritesApi.getUserFavorites(user.id, token);

            dispatch({
                type: 'SET_FAVORITES',
                payload: data.favorites.map((favorite) => ({
                    id: favorite.osm_id,
                    name: favorite.place_name,
                    created_at: favorite.created_at,
                })),
            });
        } catch (error) {
            console.error('Error cargando favoritos', error);
        }
    }, [user, token, dispatch]);

    const addFavorite = useCallback(
        async (osm_id, place_name, osmData) => {
            if (!user || !token) {
                setError('Debes estar autenticado para agregar favoritos');
                return false;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await favoritesApi.addFavorite(
                    user.id,
                    osm_id,
                    place_name,
                    osmData?.longitude,
                    osmData?.latitude,
                    token,
                );

                dispatch({
                    type: 'ADD_FAVORITE',
                    payload: {
                        id: osm_id,
                        name: place_name || 'Lugar sin nombre',
                        longitude: osmData?.longitude,
                        latitude: osmData?.latitude,
                    },
                });

                setLoading(false);
                return true;
            } catch (error) {
                setError(error.message);
                setLoading(false);
                return false;
            }
        },
        [user, token, dispatch],
    );

    const removeFavorite = useCallback(
        async (osm_id) => {
            if (!user || !token) {
                setError('Debes estar autenticado para eliminar favoritos');
                return false;
            }

            setLoading(true);
            setError(null);

            try {
                await favoritesApi.removeFavorite(user.id, osm_id, token);

                dispatch({
                    type: 'REMOVE_FAVORITE',
                    payload: osm_id,
                });

                setLoading(false);
                return true;
            } catch (error) {
                setError(error.message);
                setLoading(false);
                return false;
            }
        },
        [user, token, dispatch],
    );

    const isFavorite = useCallback(
        (osm_id) => {
            return (
                favorites?.some((f) => String(f.id) === String(osm_id)) || false
            );
        },
        [favorites],
    );

    return {
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        loading,
        error,
    };
};
