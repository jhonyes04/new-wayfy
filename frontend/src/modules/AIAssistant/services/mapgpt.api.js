export const fetchMapData = async (text, { signal } = {}) => {
    if (!text || text.trim().length < 2) return null;

    const DEFAULT_CATEGORIES = [
        'alojamiento',
        'gastronomia',
        'transporte',
        'cultura_turismo',
        'recreacion',
        'gobierno',
        'salud',
        'dinero',
        'deporte',
        'baños',
        'tiendas',
        'otros',
    ];

    const normalizeString = (value) => (typeof value === 'string' ? value : '');

    const normalizeArray = (value, fallback) =>
        Array.isArray(value) && value.length ? value : fallback;

    const geocode = async (query) => {
        if (!query) return null;

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/ai/geocode?q=${encodeURIComponent(query)}`,
                { signal },
            );

            if (!res.ok) return null;

            const { feature } = await res.json();
            return feature || null;
        } catch (err) {
            if (err.name === 'AbortError') throw err;
            console.warn('Error geocodificando:', err);
            return null;
        }
    };

    const geocodePoi = async (query) => {
        if (!query) return null;

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/ai/geocode-poi?q=${encodeURIComponent(query)}`,
                { signal },
            );

            if (!response.ok) return null;

            const { feature } = await response.json();

            return feature || null;
        } catch (error) {
            if (error.name === 'AbortError') throw error;
            return null;
        }
    };

    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/ai/mapgpt`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text }),
                signal,
            },
        );

        if (!response.ok) throw new Error('Error en el backend');

        const data = await response.json();

        const poi = normalizeString(data.poi);
        const address = normalizeString(data.address);
        const place = normalizeString(data.place);
        const filters = normalizeArray(data.filters, ['yes', 'limited']);
        const categories = normalizeArray(data.categories, DEFAULT_CATEGORIES);

        const poiWithContext = poi && place ? `${poi} ${place}` : null;
        const addressWithContext =
            address && place ? `${address} ${place}` : null;

        const feature =
            (poiWithContext ? await geocodePoi(poiWithContext) : null) ||
            (await geocodePoi(poi)) ||
            (addressWithContext ? await geocode(addressWithContext) : null) ||
            (await geocode(address)) ||
            (await geocode(place)) ||
            null;

        return {
            feature,
            poi,
            address,
            place,
            filters,
            categories,
            message: normalizeString(data.message),
        };
    } catch (error) {
        console.error('Error en fetchMapData:', error);
        throw error;
    }
};
