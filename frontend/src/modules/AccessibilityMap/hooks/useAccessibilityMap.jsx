import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import useGlobalReducer from '../../../hooks/useGlobalReducer';
import useFilteredGeoJSON from './useFilteredGeoJSON';
import { fetchWheelchairPlacesProgressive } from '../services/overpass.api';
import { elementsToGeoJSON } from '../utils/toGeoJSON';

const useAccessibilityMap = () => {
    const { state, dispatch } = useGlobalReducer();
    const {
        viewState,
        favorites,
        selectedLocation,
        activeFilters,
        activeCategories,
    } = state;

    const [userCoords, setUserCoords] = useState(null);
    const [geojson, setGeojson] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cursor, setCursor] = useState('grab');

    const mapRef = useRef(null);
    const debounceRef = useRef(null);
    const abortControllerRef = useRef(null);
    const isLoadingRef = useRef(false);
    const reloadRequestedRef = useRef(false);

    const elementsRef = useRef([]);

    const filteredGeoJSON = useFilteredGeoJSON(
        geojson,
        activeFilters,
        activeCategories,
    );

    const layers = useMemo(
        () => ({
            clusterLayer: {
                id: 'clusters',
                type: 'circle',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': [
                        'step',
                        ['get', 'point_count'],
                        '#10b891',
                        10,
                        '#38bdf8',
                        50,
                        '#ec8e8e',
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        18,
                        10,
                        24,
                        50,
                        32,
                    ],
                    'circle-stroke-width': [
                        'step',
                        ['get', 'point_count'],
                        3,
                        10,
                        4,
                        50,
                        5,
                    ],
                    'circle-stroke-color': [
                        'step',
                        ['get', 'point_count'],
                        'rgba(9, 116, 91, 0.5)',
                        10,
                        'rgba(56, 189, 248, 0.5)',
                        50,
                        'rgba(236, 142, 142, 0.5)',
                    ],
                    'circle-blur': 0.0001,
                },
            },
            clusterCountLayer: {
                id: 'cluster-count',
                type: 'symbol',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-size': 14,
                    'text-font': [
                        'DIN Offc Pro Medium',
                        'Arial Unicode MS Bold',
                    ],
                    'text-allow-overlap': true,
                },
                paint: { 'text-color': '#ffffff' },
            },
            unclusteredLayer: {
                id: 'unclustered-point',
                type: 'circle',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-radius': 9,
                    'circle-color': [
                        'match',
                        ['get', 'wheelchair'],
                        'yes',
                        '#10b891',
                        'limited',
                        '#ffc108',
                        'no',
                        '#db3545',
                        '#93a2b8',
                    ],
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff',
                    'circle-pitch-alignment': 'map',
                },
            },
        }),
        [],
    );

    const updateLocation = useCallback(
        (newViewState) => {
            dispatch({ type: 'UPDATE_LOCATION', payload: newViewState });
        },
        [dispatch],
    );

    const isPositionReady = !!(selectedLocation || userCoords);

    const loadData = useCallback(async () => {
        const map = mapRef.current?.getMap();
        if (!map || !isPositionReady) return;

        if (isLoadingRef.current) {
            reloadRequestedRef.current = true;
            return;
        }

        if (map.getZoom() < 14) {
            setGeojson(null);
            setError('Acércate más para ver lugares accesibles.');
            return;
        }

        isLoadingRef.current = true;
        reloadRequestedRef.current = false;

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const b = map.getBounds();
        const bbox = [b.getSouth(), b.getWest(), b.getNorth(), b.getEast()];

        setLoading(true);
        setError(null);
        elementsRef.current = [];

        try {
            await fetchWheelchairPlacesProgressive(
                bbox,
                (chunk) => {
                    elementsRef.current = [...elementsRef.current, ...chunk];
                    setGeojson(elementsToGeoJSON(elementsRef.current));
                },
                controller.signal,
            );
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error(err);
                setError('Error al cargar datos de accesibilidad.');
            }
        } finally {
            isLoadingRef.current = false;
            setLoading(false);

            if (reloadRequestedRef.current) {
                loadData();
            }
        }
    }, [isPositionReady]);

    useEffect(() => {
        if (selectedLocation) return;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { longitude, latitude } = position.coords;
                    setUserCoords({ longitude, latitude });

                    mapRef.current?.flyTo({
                        center: [longitude, latitude],
                        zoom: 14,
                        duration: 1500,
                    });

                    updateLocation({
                        ...viewState,
                        longitude,
                        latitude,
                        zoom: 14,
                    });
                },
                (err) => {
                    console.error('Error de geolocalización:', err);
                    setUserCoords({ longitude: 0, latitude: 0 });
                },
                { enableHighAccuracy: true, timeout: 5000 },
            );
        } else {
            setUserCoords({ longitude: 0, latitude: 0 });
        }
    }, []);

    useEffect(() => {
        if (isPositionReady && mapRef.current) {
            loadData();
        }
    }, [isPositionReady, loadData]);

    useEffect(() => {
        return () => {
            clearTimeout(debounceRef.current);
            abortControllerRef.current?.abort();
        };
    }, []);

    useEffect(() => {
        if (selectedLocation && mapRef.current) {
            mapRef.current.flyTo({
                center: [selectedLocation.longitude, selectedLocation.latitude],
                zoom: selectedLocation.zoom || 16,
                essential: true,
                duration: 1500,
            });
        }
    }, [selectedLocation, isPositionReady]);

    useEffect(() => {
        const zoomErrorMessage = 'Acércate más para ver lugares accesibles.';
        if (error && error !== zoomErrorMessage) {
            const timer = setTimeout(() => setError(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleMapLoad = useCallback(() => {
        if (selectedLocation) {
            mapRef.current?.flyTo({
                center: [selectedLocation.longitude, selectedLocation.latitude],
                zoom: selectedLocation.zoom || 16,
                essential: true,
                duration: 1500,
            });
        }
    }, [selectedLocation]);

    const handleMove = useCallback(
        (evt) => updateLocation(evt.viewState),
        [updateLocation],
    );

    const handleMoveEnd = useCallback(() => {
        if (!isPositionReady) return;
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => loadData(), 300);
    }, [loadData, isPositionReady]);

    const handleClick = useCallback(
        (evt) => {
            const map = mapRef.current?.getMap();
            if (!map) return;

            const hasClusters = map.getLayer('clusters');
            const hasUnclustered = map.getLayer('unclustered-point');

            if (!hasClusters || !hasUnclustered) return;

            const clusters = map.queryRenderedFeatures(evt.point, {
                layers: ['clusters'],
            });

            if (clusters.length) {
                const clusterId = clusters[0].properties.cluster_id;
                map.getSource('wheelchair').getClusterExpansionZoom(
                    clusterId,
                    (err, zoom) => {
                        if (err) return;
                        map.easeTo({
                            center: clusters[0].geometry.coordinates,
                            zoom,
                        });
                    },
                );
                return;
            }

            const points = map.queryRenderedFeatures(evt.point, {
                layers: ['unclustered-point'],
            });

            if (points.length) {
                dispatch({ type: 'SET_SELECTED_FEATURE', payload: points[0] });
            }
        },
        [dispatch],
    );

    return {
        state: {
            viewState,
            userCoords,
            filteredGeoJSON,
            loading,
            error,
            cursor,
            favorites,
            selectedLocation,
            layers,
        },
        actions: {
            setCursor,
            handleMove,
            handleMoveEnd,
            handleClick,
            handleMapLoad,
        },
        mapRef,
    };
};

export default useAccessibilityMap;
