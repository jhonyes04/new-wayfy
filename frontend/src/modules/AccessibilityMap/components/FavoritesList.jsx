import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Spinner,
    Card,
    Badge,
    Table,
    Stack,
    Row,
    Col,
    Form,
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
    const [activeLabel, setActiveLabel] = useState('__all__');

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

    const placeLabels = useMemo(() => {
        return [
            ...new Set(favorites.map((f) => f.place_label).filter(Boolean)),
        ].sort();
    }, [favorites]);

    const filtered = useMemo(() => {
        if (activeLabel === '__all__') return favorites;
        if (activeLabel === '__none__')
            return favorites.filter((f) => !f.place_label);
        return favorites.filter((f) => f.place_label === activeLabel);
    }, [favorites, activeLabel]);

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
            <Stack direction="horizontal" gap={2} className="text-primary mb-4">
                <i className="fa-solid fa-heart fa-2x"></i>
                <h3 className="text-primary m-0">Mis Favoritos</h3>
                <Badge bg="secondary" pill className="btn-circle">
                    {favorites.length}
                </Badge>
            </Stack>

            <div className="d-flex flex-wrap gap-2 mb-3">
                <Badge
                    pill
                    bg={activeLabel === '__all__' ? 'primary' : 'light'}
                    text={activeLabel === '__all__' ? 'white' : 'dark'}
                    className="px-3 py-2 fw-semibold"
                    style={{ cursor: 'pointer', fontSize: '0.85rem' }}
                    onClick={() => setActiveLabel('__all__')}
                >
                    Todos ({favorites.length})
                </Badge>

                {placeLabels.map((label) => (
                    <Badge
                        key={label}
                        pill
                        bg={activeLabel === label ? 'primary' : 'light'}
                        text={activeLabel === label ? 'white' : 'dark'}
                        className="px-3 py-2 fw-semibold"
                        style={{ cursor: 'pointer', fontSize: '0.85rem' }}
                        onClick={() => setActiveLabel(label)}
                    >
                        <i className="fa-solid fa-folder me-1"></i>
                        {label} (
                        {
                            favorites.filter((f) => f.place_label === label)
                                .length
                        }
                        )
                    </Badge>
                ))}

                {favorites.some((f) => !f.place_label) && (
                    <Badge
                        pill
                        bg={activeLabel === '__none__' ? 'secondary' : 'light'}
                        text={activeLabel === '__none__' ? 'white' : 'dark'}
                        className="px-3 py-2 fw-semibold"
                        style={{ cursor: 'pointer', fontSize: '0.85rem' }}
                        onClick={() => setActiveLabel('__none__')}
                    >
                        Sin categoría (
                        {favorites.filter((f) => !f.place_label).length})
                    </Badge>
                )}
            </div>

            <Card className="shadow-sm border-0">
                <Table responsive hover className="mb-0 align-middle">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: 36 }}></th>
                            <th>Nombre</th>
                            <th className="d-none d-md-table-cell">
                                Categoría
                            </th>
                            <th className="d-none d-sm-table-cell">Lugar</th>
                            <th className="d-none d-md-table-cell">
                                Accesibilidad
                            </th>
                            <th style={{ width: 110 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((favorite) => {
                            const wc =
                                WHEELCHAIR_LABELS[favorite.wheelchair] ||
                                WHEELCHAIR_LABELS.unknown;
                            const { icon, color } = getCategoryStyle(
                                favorite.sub_type,
                            );

                            return (
                                <tr key={favorite.id}>
                                    <td>
                                        <div
                                            className={`bg-${wc.color} rounded-circle d-flex align-items-center justify-content-center text-white mx-auto`}
                                            style={{ width: 32, height: 32 }}
                                        >
                                            <i
                                                className={`fa-solid ${wc.icon} small`}
                                            ></i>
                                        </div>
                                    </td>
                                    <td>
                                        <div
                                            className="fw-semibold text-truncate"
                                            style={{ maxWidth: 180 }}
                                        >
                                            {favorite.place_name ||
                                                'Lugar sin nombre'}
                                        </div>
                                    </td>
                                    <td className="d-none d-md-table-cell">
                                        <span
                                            className="small"
                                            style={{ color }}
                                        >
                                            <i
                                                className={`fa-solid ${icon} me-1`}
                                            ></i>
                                            {translateCategory(
                                                favorite.sub_type,
                                            )}
                                        </span>
                                    </td>
                                    <td className="d-none d-sm-table-cell">
                                        {favorite.place_label ? (
                                            <Badge
                                                bg="light"
                                                text="dark"
                                                className="fw-normal"
                                            >
                                                <i className="fa-solid fa-folder me-1 text-primary"></i>
                                                {favorite.place_label}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted small">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="d-none d-md-table-cell">
                                        <Badge
                                            bg={wc.color}
                                            className="fw-normal small"
                                        >
                                            {wc.label}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Stack
                                            direction="horizontal"
                                            gap={1}
                                            className="justify-content-end"
                                        >
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
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
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
