const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const reverseGeocode = async (longitude, latitude) => {
    try {
        const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?types=place&language=es&access_token=${MAPBOX_TOKEN}`,
        );
        const data = await res.json();
        const feature = data.features?.[0];

        return feature ? feature.place_name.split(',')[0] : null;
    } catch {
        return null;
    }
};
