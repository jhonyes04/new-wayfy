import React from 'react';
import Map, {
    GeolocateControl,
    Marker,
    NavigationControl,
    Source,
    Layer,
} from 'react-map-gl';

import { Alert, Spinner } from 'react-bootstrap';

import 'mapbox-gl/dist/mapbox-gl.css';
import '../css/AccessibilityMap.css';
import useAccessibilityMap from '../hooks/useAccessibilityMap';
import { AIAssistant } from '../../AIAssistant/components/AIAssistant';
import { CustomPinPopup } from './CustomPinPopup';

export const AccessibilityMap = () => {
    const { state, actions, mapRef } = useAccessibilityMap();
    const {
        viewState,
        userCoords,
        filteredGeoJSON,
        loading,
        error,
        cursor,
        favorites,
        selectedLocation,
        customPin,
    } = state;

    return (
        <div className="w-100 h-100 position-relative overflow-hidden">
            {loading && (
                <div
                    className="position-absolute z-1"
                    style={{ top: '5px', left: '60px' }}
                >
                    <Alert
                        variant="light"
                        className="shadow-sm border-0 d-flex align-items-center rounded-pill px-4 py-2 gap-3 mb-0"
                    >
                        <Spinner
                            animation="border"
                            size="sm"
                            variant="primary"
                        />
                        <span className="text-small fw-bold text-primary">
                            Buscando lugares accesibles cercanos...
                        </span>
                    </Alert>
                </div>
            )}

            {!loading && error && (
                <div
                    className="position-absolute z-1"
                    style={{ top: '5px', left: '60px' }}
                >
                    <Alert
                        variant="warning"
                        className="border-0 shadow-sm py-2 px-4 small fw-bold rounded-pill mb-0"
                    >
                        <i className="fa-solid fa-circle-exclamation me-2"></i>
                        <span className="text-small">{error}</span>
                    </Alert>
                </div>
            )}

            {customPin && (
                <CustomPinPopup
                    longitude={customPin.longitude}
                    latitude={customPin.latitude}
                    onClose={actions.clearCustomPin}
                />
            )}

            <Map
                ref={mapRef}
                {...viewState}
                cursor={cursor}
                onMove={actions.handleMove}
                onMoveEnd={actions.handleMoveEnd}
                onClick={actions.handleClick}
                onMouseEnter={() => actions.setCursor('pointer')}
                onMouseLeave={() => actions.setCursor('grab')}
                onLoad={actions.handleMapLoad}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                interactiveLayerIds={['clusters', 'unclustered-point']}
            >
                <GeolocateControl
                    position="top-left"
                    trackUserLocation
                    showUserHeading
                />
                <NavigationControl position="top-left" />

                {filteredGeoJSON && (
                    <Source
                        id="wheelchair"
                        type="geojson"
                        data={filteredGeoJSON}
                        cluster={true}
                        clusterMaxZoom={14}
                        clusterRadius={50}
                    >
                        <Layer {...state.layers.clusterLayer} />
                        <Layer {...state.layers.clusterCountLayer} />
                        <Layer {...state.layers.unclusteredLayer} />
                    </Source>
                )}

                {userCoords && (
                    <Marker
                        longitude={userCoords.longitude}
                        latitude={userCoords.latitude}
                        anchor="center"
                    >
                        <i className="fa-solid fa-circle-dot text-primary fs-5"></i>
                    </Marker>
                )}

                {selectedLocation && (
                    <Marker
                        longitude={selectedLocation.longitude}
                        latitude={selectedLocation.latitude}
                        anchor="bottom"
                    ></Marker>
                )}

                {favorites
                    ?.filter((f) => f.longitude != null && f.latitude != null)
                    .map((favorite) => (
                        <Marker
                            key={favorite.id}
                            longitude={favorite.longitude}
                            latitude={favorite.latitude}
                            anchor="bottom"
                        >
                            <i
                                className="marker-wayfy shadow-sm"
                                title={favorite.name}
                            ></i>
                        </Marker>
                    ))}

                {customPin && (
                    <Marker
                        longitude={customPin.longitude}
                        latitude={customPin.latitude}
                        anchor="bottom"
                    >
                        <i className="fa-solid fa-location-dot text-primary fs-2"></i>
                    </Marker>
                )}
            </Map>

            <AIAssistant />
        </div>
    );
};
