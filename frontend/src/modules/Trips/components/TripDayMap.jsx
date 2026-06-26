import React, { useMemo } from 'react';
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl';
import { Alert, Badge, Spinner, Stack } from 'react-bootstrap';
import 'mapbox-gl/dist/mapbox-gl.css';

import { useTripDayRoute } from '../hooks/useTripDayRoute';

const routeLineLayer = {
    id: 'route-line',
    type: 'line',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': '#0d6efd', 'line-width': 4, 'line-opacity': 0.85 },
};

const getBounds = (places) => {
    const valid = places.filter((p) => p.latitude && p.longitude);
    if (!valid.length) return null;
    const lngs = valid.map((p) => p.longitude);
    const lats = valid.map((p) => p.latitude);
    return {
        longitude: (Math.min(...lngs) + Math.max(...lngs)) / 2,
        latitude: (Math.min(...lats) + Math.max(...lats)) / 2,
        zoom: valid.length === 1 ? 14 : 12,
    };
};

const MARKER_COLORS = [
    '#0d6efd',
    '#198754',
    '#dc3545',
    '#fd7e14',
    '#6f42c1',
    '#20c997',
    '#ffc107',
    '#0dcaf0',
];

export const TripDayMap = ({ day, height = '400px' }) => {
    const sortedPlaces = useMemo(
        () =>
            [...(day?.places ?? [])]
                .filter((p) => p.latitude && p.longitude)
                .sort((a, b) => a.order - b.order),
        [day?.places],
    );

    const { routeGeoJSON, routeInfo, loading, error } =
        useTripDayRoute(sortedPlaces);
    const initialView = useMemo(
        () => getBounds(sortedPlaces) ?? { longitude: 0, latitude: 0, zoom: 2 },
        [sortedPlaces],
    );

    if (!sortedPlaces.length) {
        return (
            <Alert variant="light" className="text-center text-muted border">
                <i className="fa-solid fa-map-location-dot fa-2x mb-2 d-block opacity-50"></i>
                Este día no tiene lugares con coordenadas para mostrar en el
                mapa.
            </Alert>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            {routeInfo && (
                <Stack
                    direction="horizontal"
                    gap={2}
                    className="mb-2 flex-wrap"
                >
                    <Badge bg="primary" className="py-2 px-3">
                        <i className="fa-solid fa-route me-1"></i>
                        {routeInfo.distance} km
                    </Badge>
                    <Badge bg="secondary" className="py-2 px-3">
                        <i className="fa-solid fa-person-walking me-1"></i>
                        {routeInfo.duration} min a pie
                    </Badge>
                    <Badge bg="light" text="dark" className="py-2 px-3">
                        <i className="fa-solid fa-map-pin me-1"></i>
                        {sortedPlaces.length} lugares
                    </Badge>
                </Stack>
            )}

            {loading && (
                <div
                    style={{
                        position: 'absolute',
                        top: '60px',
                        left: '10px',
                        zIndex: 10,
                    }}
                >
                    <Alert
                        variant="light"
                        className="shadow-sm border-0 d-flex align-items-center rounded-pill px-3 py-2 gap-2 mb-0"
                    >
                        <Spinner
                            animation="border"
                            size="sm"
                            variant="primary"
                        />
                        <span className="small fw-bold text-primary">
                            Calculando ruta...
                        </span>
                    </Alert>
                </div>
            )}

            {error && (
                <Alert variant="warning" className="py-2 small mb-2">
                    <i className="fa-solid fa-triangle-exclamation me-1"></i>
                    {error}
                </Alert>
            )}

            <div style={{ height, borderRadius: '0.5rem', overflow: 'hidden' }}>
                <Map
                    initialViewState={initialView}
                    mapStyle="mapbox://styles/mapbox/streets-v12"
                    mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                    style={{ width: '100%', height: '100%' }}
                >
                    <NavigationControl position="top-left" />

                    {routeGeoJSON && (
                        <Source id="route" type="geojson" data={routeGeoJSON}>
                            <Layer {...routeLineLayer} />
                        </Source>
                    )}

                    {sortedPlaces.map((place, index) => (
                        <Marker
                            key={place.id}
                            longitude={place.longitude}
                            latitude={place.latitude}
                            anchor="bottom"
                        >
                            <div
                                title={place.place_name}
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50% 50% 50% 0',
                                    transform: 'rotate(-45deg)',
                                    backgroundColor:
                                        MARKER_COLORS[
                                            index % MARKER_COLORS.length
                                        ],
                                    border: '2px solid white',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <span
                                    style={{
                                        transform: 'rotate(45deg)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: 13,
                                    }}
                                >
                                    {index + 1}
                                </span>
                            </div>
                        </Marker>
                    ))}
                </Map>
            </div>

            <div className="mt-3">
                {sortedPlaces.map((place, index) => (
                    <div
                        key={place.id}
                        className="d-flex align-items-start gap-2 mb-1 small"
                    >
                        <span
                            className="badge rounded-pill flex-shrink-0"
                            style={{
                                backgroundColor:
                                    MARKER_COLORS[index % MARKER_COLORS.length],
                                minWidth: 22,
                            }}
                        >
                            {index + 1}
                        </span>
                        <div>
                            <span className="fw-semibold small">
                                {place.place_name}
                            </span>
                            {place.visit_time && (
                                <span className="small text-muted ms-2">
                                    <i className="fa-regular fa-clock me-1"></i>
                                    {place.visit_time}
                                    {place.visit_time_end &&
                                        ` – ${place.visit_time_end}`}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
