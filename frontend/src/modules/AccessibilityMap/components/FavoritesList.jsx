import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Spinner,
    Card,
    Badge,
    Button,
    ListGroup,
    Stack,
    Row,
    Col,
} from 'react-bootstrap';
import { useAuth } from '../../../context/auth/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import useGlobalReducer from '../../../hooks/useGlobalReducer';
import { TooltipButton } from '../../../components/TooltipButton';
import { favoritesApi } from '../services/favorites.api';
import { FavoriteCard } from './FavoriteCard';
import {
    translateCategory,
    getCategoryIcon,
    getCategoryStyle,
} from '../utils/translations/OSM_TRANSLATIONS';
import { toast } from 'react-toastify';

const WHEELCHAIR_LABELS = {
    yes: { label: 'Accesible', color: 'success', icon: 'fa-wheelchair-move' },
    limited: {
        label: 'Parcialmente accesible',
        color: 'warning',
        icon: 'fa-triangle-exclamation',
    },
    no: { label: 'No accesible', color: 'danger', icon: 'fa-ban' },
    unknown: {
        label: 'Desconocido',
        color: 'secondary',
        icon: 'fa-circle-question',
    },
};

export const FavoritesList = () => {
    const { user, token } = useAuth();
    const { removeFavorite } = useFavorites();
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFavorite, setSelectedFavorite] = useState(null);

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
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingFavorites(false);
            }
        };

        fetchFavorites();
    }, [user, token]);

    const handleRemove = async (osm_id) => {
        await removeFavorite(osm_id);
        setFavorites((prev) => prev.filter((f) => f.osm_id !== osm_id));
        if (selectedFavorite?.osm_id === osm_id) setSelectedFavorite(null);
    };

    const handleGoToMap = (favorite) => {
        if (favorite.longitude && favorite.latitude) {
            dispatch({
                type: 'UPDATE_LOCATION',
                payload: {
                    longitude: favorite.longitude,
                    latitude: favorite.latitude,
                    zoom: 17,
                },
            });
            dispatch({
                type: 'SET_SELECTED_LOCATION',
                payload: {
                    longitude: favorite.longitude,
                    latitude: favorite.latitude,
                    zoom: 17,
                },
            });
        }
        dispatch({
            type: 'SET_SELECTED_FEATURE',
            payload: {
                properties: {
                    id: favorite.osm_id,
                    name: favorite.place_name,
                    osm_type: favorite.osm_type || 'node',
                    wheelchair: favorite.wheelchair || 'unknown',
                    sub_type: favorite.sub_type || null,
                    all_tags: favorite.all_tags || {},
                },
                geometry: {
                    coordinates: [favorite.longitude, favorite.latitude],
                },
            },
        });
        navigate('/map');
    };

    if (!user) {
        toast.warn('Debes estar autenticado para ver tus favoritos');
        return null;
    }

    if (loadingFavorites) {
        return (
            <Row className="justify-content-center py-5">
                <Col xs="auto">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                </Col>
            </Row>
        );
    }

    if (error) {
        toast.error(error);
        return null;
    }

    if (favorites.length === 0) {
        return (
            <Card className="border-0 shadow-sm text-center py-5">
                <Card.Body>
                    <i className="fa-regular fa-heart fa-3x text-danger mb-3 d-block"></i>
                    <Card.Text className="text-muted">
                        No tienes favoritos aún. ¡Agrega algunos lugares!
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    return (
        <>
            <Stack direction="horizontal" gap={2} className="text-primary mb-3">
                <i className="fa-solid fa-heart fa-2x"></i>
                <h3 className="text-primary m-0">Mis Favoritos</h3>
                <Badge bg="secondary" pill>
                    {favorites.length}
                </Badge>
            </Stack>

            <Card className="shadow-sm border-0">
                <ListGroup variant="flush">
                    {favorites.map((favorite) => {
                        const wc =
                            WHEELCHAIR_LABELS[favorite.wheelchair] ||
                            WHEELCHAIR_LABELS.unknown;

                        const { icon, color } = getCategoryStyle(
                            favorite.sub_type,
                        );

                        return (
                            <ListGroup.Item
                                key={favorite.id}
                                className="py-3 px-3"
                            >
                                <Row className="align-items-center g-2">
                                    <Col xs="auto" className="d-none d-sm-flex">
                                        <div
                                            className={`bg-${wc.color} rounded-circle d-flex align-items-center justify-content-center text-white`}
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                            }}
                                        >
                                            <i
                                                className={`fa-solid ${wc.icon} small`}
                                            ></i>
                                        </div>
                                    </Col>

                                    <Col>
                                        <div className="fw-bold text-truncate">
                                            {favorite.place_name ||
                                                'Lugar sin nombre'}
                                        </div>
                                        <Stack
                                            direction="horizontal"
                                            gap={1}
                                            className="flex-wrap small mt-1"
                                        >
                                            <i
                                                className={`fa-solid ${icon} me-1`}
                                                style={{ color }}
                                            ></i>
                                            <div
                                                className="fw-bold"
                                                style={{ color }}
                                            >
                                                {translateCategory(
                                                    favorite.sub_type,
                                                )}
                                            </div>
                                        </Stack>
                                    </Col>

                                    <Col xs="auto">
                                        <Stack direction="horizontal" gap={1}>
                                            <TooltipButton
                                                variant="outline-primary"
                                                size="sm"
                                                tooltip="Ver información"
                                                onClick={() =>
                                                    setSelectedFavorite(
                                                        favorite,
                                                    )
                                                }
                                            >
                                                <i className="fa-solid fa-circle-info"></i>
                                            </TooltipButton>
                                            <TooltipButton
                                                variant="outline-success"
                                                size="sm"
                                                tooltip="Ver en el mapa"
                                                onClick={() =>
                                                    handleGoToMap(favorite)
                                                }
                                            >
                                                <i className="fa-solid fa-map-location-dot"></i>
                                            </TooltipButton>
                                            <TooltipButton
                                                variant="outline-danger"
                                                size="sm"
                                                tooltip="Eliminar"
                                                onClick={() =>
                                                    handleRemove(
                                                        favorite.osm_id,
                                                    )
                                                }
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </TooltipButton>
                                        </Stack>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            </Card>

            {selectedFavorite && (
                <FavoriteCard
                    favorite={selectedFavorite}
                    onClose={() => setSelectedFavorite(null)}
                    onGoToMap={handleGoToMap}
                    onRemoved={handleRemove}
                />
            )}
        </>
    );
};
