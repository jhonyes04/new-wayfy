import { useState, useEffect } from 'react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const useTripDayRoute = (places, profile = 'walking') => {
    const [routeGeoJSON, setRouteGeoJSON] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const validPlaces = places
            ?.filter((p) => p.latitude && p.longitude)
            .sort((a, b) => a.order - b.order);

        if (!validPlaces || validPlaces.length < 2) {
            setRouteGeoJSON(null);
            setRouteInfo(null);
            return;
        }

        const fetchRoute = async () => {
            setLoading(true);
            setError(null);

            const coords = validPlaces
                .map((p) => `${p.longitude},${p.latitude}`)
                .join(';');

            const url =
                `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coords}` +
                `?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;

            try {
                const res = await fetch(url);
                const data = await res.json();

                if (!data.routes?.length) {
                    setError('No se pudo calcular la ruta');
                    return;
                }

                const route = data.routes[0];

                setRouteGeoJSON({
                    type: 'Feature',
                    geometry: route.geometry,
                });

                setRouteInfo({
                    distance: (route.distance / 1000).toFixed(1),
                    duration: Math.round(route.duration / 60),
                });
            } catch {
                setError('Error al conectar con el servicio de rutas');
            } finally {
                setLoading(false);
            }
        };

        fetchRoute();
    }, [places, profile]);

    return { routeGeoJSON, routeInfo, loading, error };
};
