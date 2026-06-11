import React from 'react';
import Map, {
    GeolocateControl,
    Marker,
    NavigationControl,
    Source,
    Layer,
} from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import '../css/AccessibilityMap.css';
import useAccessibilityMap from '../hooks/useAccessibilityMap';
import { AIAssistant } from '../../AIAssistant/components/AIAssistant';

export const AccessibilityMap = () => {
    const { state, actions, mapRef } = useAccessibilityMap()
    const {
        viewState,
        userCoords,
        filteredGeoJSON,
        loading,
        error,
        cursor,
        favorites,
        selectedLocation,
    } = state;

    return (
        <div className="w-100 h-100 position-relative overflow-hidden">
            {/* INDICADOR DE CARGA */}
            {loading && (
                <div className="position-absolute z-1" style={{ top: '5px', left: '60px' }}>
                    <div className="alert alert-light shadow-sm border-0 d-flex align-items-center rounded-pill px-4 py-2 gap-3">
                        <div className="spinner-border spinner-border-sm text-primary"></div>
                        <span className="text-small fw-bold text-primary">
                            Buscando lugares accesibles cercanos...
                        </span>
                    </div>
                </div>
            )}

            {/* AVISO DE ERROR */}
            {!loading && error && (
                <div className="position-absolute z-1" style={{ top: '5px', left: '60px' }}>
                    <div className="alert alert-warning border-0 shadow-sm py-2 px-4 small fw-bold rounded-pill">
                        <i className="fa-solid fa-circle-exclamation me-2"></i>
                        <span className="text-small">{error}</span>
                    </div>
                </div>
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
                        {/* <Layer {...state.layers.clusterPulseLayer} /> */}
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

                {/* MARCADOR SELECCIONADO */}
                {selectedLocation && (
                    <Marker
                        longitude={selectedLocation.longitude}
                        latitude={selectedLocation.latitude}
                        anchor="bottom"
                    >
                        {/* <i className="fa-solid fa-location-dot text-danger fs-2"></i> */}
                    </Marker>
                )}

                {/* MARCADORES GUARDADOS POR EL USUARIO */}
                {favorites?.map((favorite) => (
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
            </Map>

            <AIAssistant />
        </div>
    );
};
