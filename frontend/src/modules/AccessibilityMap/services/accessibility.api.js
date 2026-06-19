const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/accessibility`;

const getToken = () => sessionStorage.getItem('wayfy_token');

export const accessibilityApi = {
    getByOsmId: async (osmId) => {
        const response = await fetch(`${BASE_URL}/${osmId}`);

        if (!response.ok) throw new Error('Error al obtener reseñas');

        return response.json();
    },

    getPlaceReview: async (osmId) => {
        const response = await fetch(`${BASE_URL}/${osmId}/review`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });

        if (response.status === 404) return null;
        if (!response.ok)
            throw new Error('Error al obtener datos de accesibilidad');

        return response.json();
    },

    upsert: async (osmId, data) => {
        const response = await fetch(`${BASE_URL}/${osmId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Error al guardar reseña');

        return response.json();
    },

    uploadPhotos: async (reviewId, files) => {
        const formData = new FormData();

        files.forEach((file) => formData.append('photos', file));

        const response = await fetch(`${BASE_URL}/${reviewId}/photos`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${getToken()}` },
            body: formData,
        });

        if (!response.ok) throw new Error('Error al subir fotos');

        return response.json();
    },

    deletePhoto: async (photoId) => {
        const response = await fetch(`${BASE_URL}/photos/${photoId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${getToken()}` },
        });

        if (!response.ok) throw new Error('Error al eliminar la foto');

        return response.json();
    },
};
