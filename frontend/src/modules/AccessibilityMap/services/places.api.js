const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeader = (token) => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
});

const handleResponse = async (response, message) => {
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const body = isJson
        ? await response.json()
        : { msg: `Error ${response.status} : ${response.statusText}` };

    if (!response.ok) throw new Error(body.msg || message);

    return body;
};

export const placesApi = {
    async createPlace(
        { name, longitude, latitude, sub_type, place_label },
        token,
    ) {
        const response = await fetch(`${API_BASE_URL}/api/places`, {
            method: 'POST',
            headers: getAuthHeader(token),
            body: JSON.stringify({
                name,
                longitude,
                latitude,
                sub_type,
                place_label,
            }),
        });

        return handleResponse(response, 'Error al publicar el lugar');
    },

    async getByBbox({ south, west, north, east }) {
        const params = new URLSearchParams({ south, west, north, east });
        const response = await fetch(`${API_BASE_URL}/api/places/?${params}`);

        return handleResponse(response, 'Error al obtener lugares');
    },

    async getMyPending(token) {
        const response = await fetch(
            `${API_BASE_URL}/api/places/main/pending`,
            {
                headers: getAuthHeader(token),
            },
        );

        return handleResponse(
            response,
            'Error al obtener tus lugares pendientes',
        );
    },

    async getPending(token) {
        const response = await fetch(`${API_BASE_URL}/api/places/pending`, {
            headers: getAuthHeader(token),
        });

        return handleResponse(response, 'Error al obtener lugares');
    },

    async updateStatus(placeId, status, token) {
        const response = await fetch(
            `${API_BASE_URL}/api/places/${placeId}/status`,
            {
                method: 'PATCH',
                headers: getAuthHeader(token),
                body: JSON.stringify({ status }),
            },
        );

        return handleResponse(response, 'Error al actualizar el estado');
    },
};
