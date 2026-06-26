const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeader = (token) => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
});

const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const body = isJson
        ? await response.json()
        : { msg: `Error ${response.status} : ${response.statusText}` };

    if (!response.ok) throw new Error(body.msg || 'Error en la solicitud');

    return body;
};

export const tripsApi = {
    async getMyTrips(token) {
        const response = await fetch(`${API_BASE_URL}/api/trips/`, {
            method: 'GET',
            headers: getAuthHeader(token),
        });

        return handleResponse(response);
    },

    async getPublicTrips(token) {
        const headers = token ? getAuthHeader(token) : {};
        const response = await fetch(`${API_BASE_URL}/api/trips/public`, {
            method: 'GET',
            headers: headers,
        });

        return handleResponse(response);
    },

    async getTrip(tripId, token) {
        const headers = token ? getAuthHeader(token) : {};
        const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}`, {
            method: 'GET',
            headers: headers,
        });

        return handleResponse(response);
    },

    async createTrip(data, token) {
        const response = await fetch(`${API_BASE_URL}/api/trips/`, {
            method: 'POST',
            headers: getAuthHeader(token),
            body: JSON.stringify(data),
        });

        return handleResponse(response);
    },

    async updateTrip(tripId, data, token) {
        const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}`, {
            method: 'PUT',
            headers: getAuthHeader(token),
            body: JSON.stringify(data),
        });

        return handleResponse(response);
    },

    async updateCover(tripId, file, token) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(
            `${API_BASE_URL}/api/trips/${tripId}/cover`,
            {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            },
        );

        return handleResponse(response);
    },

    async deleteCover(tripId, token) {
        const response = await fetch(
            `${API_BASE_URL}/api/trips/${tripId}/cover`,
            {
                method: 'DELETE',
                headers: getAuthHeader(token),
            },
        );

        return handleResponse(response);
    },

    async deleteTrip(tripId, token) {
        const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}`, {
            method: 'DELETE',
            headers: getAuthHeader(token),
        });

        return handleResponse(response);
    },

    async forkTrip(tripId, token) {
        const response = await fetch(
            `${API_BASE_URL}/api/trips/${tripId}/fork`,
            {
                method: 'POST',
                headers: getAuthHeader(token),
            },
        );

        return handleResponse(response);
    },

    async addDay(tripId, data, token) {
        const response = await fetch(
            `${API_BASE_URL}/api/trips/${tripId}/days`,
            {
                method: 'POST',
                headers: getAuthHeader(token),
                body: JSON.stringify(data),
            },
        );

        return handleResponse(response);
    },

    async updateDay(tripId, dayId, data, token) {
        const response = await fetch(
            `${API_BASE_URL}/api/trips/${tripId}/days/${dayId}`,
            {
                method: 'PUT',
                headers: getAuthHeader(token),
                body: JSON.stringify(data),
            },
        );

        return handleResponse(response);
    },

    async deleteDay(tripId, dayId, token) {
        const response = await fetch(
            `${API_BASE_URL}/api/trips/${tripId}/days/${dayId}`,
            {
                method: 'DELETE',
                headers: getAuthHeader(token),
            },
        );

        return handleResponse(response);
    },

    async addPlace(tripId, dayId, data, token) {
        const response = await fetch(
            `${API_BASE_URL}/api/trips/${tripId}/days/${dayId}/places`,
            {
                method: 'POST',
                headers: getAuthHeader(token),
                body: JSON.stringify(data),
            },
        );

        return handleResponse(response);
    },

    async updatePlace(tripId, dayId, placeId, data, token) {
        const response = await fetch(
            `${API_BASE_URL}/api/trips/${tripId}/days/${dayId}/places/${placeId}`,
            {
                method: 'PUT',
                headers: getAuthHeader(token),
                body: JSON.stringify(data),
            },
        );

        return handleResponse(response);
    },

    async deletePlace(tripId, dayId, placeId, token) {
        const response = await fetch(
            `${API_BASE_URL}/api/trips/${tripId}/days/${dayId}/places/${placeId}`,
            {
                method: 'DELETE',
                headers: getAuthHeader(token),
            },
        );

        return handleResponse(response);
    },
};
