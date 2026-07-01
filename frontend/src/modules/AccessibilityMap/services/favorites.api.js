import {
    API_BASE_URL,
    getAuthHeader,
    handleResponse,
} from '../../../services/apiUtils';

export const favoritesApi = {
    async addFavorite(
        userId,
        osm_id,
        place_name,
        longitude,
        latitude,
        wheelchair,
        osm_type,
        sub_type,
        all_tags,
        place_label,
        token,
    ) {
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
                    wheelchair,
                    osm_type,
                    sub_type,
                    all_tags,
                    place_label,
                }),
            },
        );

        return await handleResponse(response, 'Error al agregar favorito');
    },

    async removeFavorite(userId, osm_id, token) {
        const response = await fetch(
            `${API_BASE_URL}/api/users/${userId}/favorites/${osm_id}`,
            {
                method: 'DELETE',
                headers: getAuthHeader(token),
            },
        );

        return await handleResponse(response, 'Error al eliminar favorito');
    },

    async getUserFavorites(userId, token) {
        const response = await fetch(
            `${API_BASE_URL}/api/users/${userId}/favorites`,
            {
                method: 'GET',
                headers: getAuthHeader(token),
            },
        );

        return await handleResponse(response, 'Error al obtener favoritos');
    },
};
