import { useEffect, useReducer } from 'react';
import { storeReducer } from './storeReducer';
import { initialState } from './initialState';
import { StoreContext } from './StoreContext';
import { useAuth } from '../auth/AuthContext';
import { favoritesApi } from '../../modules/AccessibilityMap/services/favorites.api';

export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(storeReducer, initialState());
    const { user, token } = useAuth();

    useEffect(() => {
        if (!user || !token) {
            dispatch({
                type: 'SET_FAVORITES',
                payload: [],
            });

            return;
        }

        favoritesApi
            .getUserFavorites(user.id, token)
            .then((data) => {
                dispatch({
                    type: 'SET_FAVORITES',
                    payload: data.favorites.map((favorite) => ({
                        id: favorite.osm_id,
                        name: favorite.place_name,
                        longitude: favorite.longitude,
                        latitude: favorite.latitude,
                        created_at: favorite.created_at,
                    })),
                });
            })
            .catch((error) => console.error('Error cargando favoritos', error));
    }, [user?.id]);

    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
};
