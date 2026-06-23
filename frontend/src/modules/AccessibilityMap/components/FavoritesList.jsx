import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/auth/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { favoritesApi } from '../services/favorites.api';
import useGlobalReducer from '../../../hooks/useGlobalReducer';
import { Alert, Spinner, Card, ListGroup, Button } from 'react-bootstrap';

export const FavoritesList = () => {
    const { user, token } = useAuth();
    const { removeFavorite, loading: favoriteLoading } = useFavorites();
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || !token) return;

        const fetchFavorites = async () => {
            setLoadingFavorites(true);
            setError(null);

            try {
                const data = await favoritesApi.getUserFavorites(
                    user.id,
                    token,
                );
                setFavorites(data.favorites || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoadingFavorites(false);
            }
        };

        fetchFavorites();
    }, [user, token]);

    const handleRemoveFavorite = async (osm_id) => {
        await removeFavorite(osm_id);
        setFavorites(favorites.filter((f) => f.osm_id !== osm_id)); // ← corregido oms_id → osm_id
    };

    const handleGoToMap = (favorite) => {
        // Centrar el mapa en las coordenadas del favorito
        if (favorite.longitude && favorite.latitude) {
            dispatch({
                type: 'UPDATE_LOCATION',
                payload: {
                    longitude: favorite.longitude,
                    latitude: favorite.latitude,
                    zoom: 17,
                },
            });
        }

        // Construir un feature mínimo para mostrar en AccessibilityDetails
        dispatch({
            type: 'SET_SELECTED_FEATURE',
            payload: {
                properties: {
                    id: favorite.osm_id,
                    name: favorite.place_name,
                    osm_type: 'node',
                    wheelchair: 'unknown',
                    sub_type: null,
                    all_tags: '{}',
                },
                geometry: {
                    coordinates: [favorite.longitude, favorite.latitude],
                },
            },
        });

        navigate('/map'); // ← ajusta la ruta según tu router
    };

    if (!user) {
        return (
            <Alert variant="info" className="mt-3">
                <i className="fa-solid fa-lock me-2"></i>
                Debes estar autenticado para ver tus favoritos
            </Alert>
        );
    }

    if (loadingFavorites) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </div>
        );
    }

    if (error) return <Alert variant="danger">{error}</Alert>;

    if (favorites.length === 0) {
        return (
            // ← añadido return
            <Alert variant="secondary" className="mt-3">
                <i className="fa-solid fa-heart me-2"></i>
                No tienes favoritos aún. ¡Agrega algunos lugares!
            </Alert>
        );
    }

    return (
        <Card className="mt-3">
            <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                <h5 className="m-0">
                    <i className="fa-solid fa-heart me-2 text-danger"></i>
                    Mis Favoritos ({favorites.length})
                </h5>
            </Card.Header>
            <ListGroup variant="flush">
                {favorites.map((favorite) => (
                    <ListGroup.Item
                        key={favorite.id}
                        className="d-flex justify-content-between align-items-center"
                    >
                        <div
                            style={{ cursor: 'pointer', flex: 1 }}
                            onClick={() => handleGoToMap(favorite)}
                        >
                            <div className="fw-bold text-dark">
                                {favorite.place_name || 'Lugar sin nombre'}
                            </div>
                            <div className="small text-muted">
                                <i className="fa-solid fa-location-dot me-1"></i>
                                OSM ID: {favorite.osm_id}
                            </div>
                            <div className="small text-muted">
                                {new Date(
                                    favorite.created_at,
                                ).toLocaleDateString('es-ES')}
                            </div>
                        </div>
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() =>
                                handleRemoveFavorite(favorite.osm_id)
                            }
                            disabled={favoriteLoading}
                            className="ms-2"
                        >
                            <i className="fa-solid fa-trash"></i>
                        </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Card>
    );
};
