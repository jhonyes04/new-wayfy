export const fetchMapData = async (text) => {
    if (!text || text.trim().length < 2) return null;

    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/mapgpt`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text }),
            },
        );

        if (!response.ok) throw new Error('Error en el backend');

        const data = await response.json();
        console.log('AI →', data);

        // Normalización defensiva
        const poi = data.poi || '';
        const address = data.address || '';
        const place = data.place || '';
        const filters = Array.isArray(data.filters)
            ? data.filters
            : ['yes', 'limited'];
        const categories = Array.isArray(data.categories)
            ? data.categories
            : [
                  'restauracion',
                  'alojamiento',
                  'transporte',
                  'cultura',
                  'ocio',
                  'gobierno',
                  'salud',
                  'dinero',
                  'deporte',
                  'baños',
                  'compras',
              ];

        // -----------------------------
        // GEOCODING (POI → ADDRESS → PLACE)
        // -----------------------------
        const geocode = async (query) => {
            if (!query) return null;

            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                query,
            )}&limit=1`;

            try {
                const res = await fetch(url, {
                    headers: {
                        'User-Agent': 'WayfyAI/1.0',
                    },
                });

                const text = await res.text();

                if (text.trim().startsWith('<')) return null;

                const json = JSON.parse(text);
                if (!json.length) return null;

                const lon = parseFloat(json[0].lon);
                const lat = parseFloat(json[0].lat);

                return {
                    id: query,
                    center: [lon, lat],
                    geometry: {
                        type: 'Point',
                        coordinates: [lon, lat],
                    },
                    place_name: query,
                    text: query,
                };
            } catch (err) {
                console.warn('Error geocodificando:', err);
                return null;
            }
        };

        const feature =
            (await geocode(poi)) ||
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
            message: data.message,
        };
    } catch (error) {
        console.error('Error en fetchMapData:', error);
        throw error;
    }
};
