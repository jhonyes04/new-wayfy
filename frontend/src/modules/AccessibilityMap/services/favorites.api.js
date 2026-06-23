const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeader = (token) => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
});

export const favoritesApi = {
    async addFavorite(userId, osm_id, place_name, longitude, latitude, token) {
        const response = await fetch(
            `${API_BASE_URL}/api/users/${userId}/favorites`,
            {
                method: 'POST',
                headers: getAuthHeader(token),
                body: JSON.stringify({
                    osm_id,
                    place_name,
                    longitude,
                    latitude,
                }),
            },
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.msg || 'Error al agreagar favorito');
        }

        return await response.json();
    },

    async removeFavorite(userId, osm_id, token) {
        const response = await fetch(
            `${API_BASE_URL}/api/users/${userId}/favorites/${osm_id}`,
            {
                method: 'DELETE',
                headers: getAuthHeader(token),
            },
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.msg || 'Error al eliminar favorito');
        }

        return await response.json();
    },

    async getUserFavorites(userId, token) {
        const response = await fetch(
            `${API_BASE_URL}/api/users/${userId}/favorites`,
            {
                method: 'GET',
                headers: getAuthHeader(token),
            },
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.msg || 'Error al obtener favoritos');
        }

        return await response.json();
    },
};
