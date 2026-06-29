import { useState, useCallback } from 'react';
import { useAuth } from '../../../context/auth/AuthContext';
import { placesApi } from '../services/places.api';

const EMPTY_GEOJSON = { type: 'FeatureCollection', features: [] };

const toGeoJSON = (places, pending = false) => ({
    type: 'FeatureCollection',
    features: places.map((place) => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [place.longitude, place.latitude],
        },
        properties: {
            id: `community_${place.id}`,
            name: place.name,
            sub_type: place.sub_type || null,
            place_label: place.place_label || null,
            status: place.status,
            source: 'community',
            pending,
        },
    })),
});

export const useCommunityPlaces = () => {
    const { user, token } = useAuth();
    const [approvedGeoJSON, setApprovedGeoJSON] = useState(EMPTY_GEOJSON);
    const [pendingGeoJSON, setPendingGeoJSON] = useState(EMPTY_GEOJSON);

    const load = useCallback(
        async (map) => {
            const b = map.getBounds();
            if (!b) return;

            placesApi
                .getByBbox({
                    south: b.getSouth(),
                    west: b.getWest(),
                    north: b.getNorth(),
                    east: b.getEast(),
                })
                .then((data) =>
                    setApprovedGeoJSON(toGeoJSON(data.places || [])),
                )
                .catch(() => {});

            if (user && token) {
                placesApi
                    .getMyPending(token)
                    .then((data) =>
                        setPendingGeoJSON(toGeoJSON(data.places || [], true)),
                    )
                    .catch(() => {});
            }
        },
        [user, token],
    );

    return { approvedGeoJSON, pendingGeoJSON, load };
};
