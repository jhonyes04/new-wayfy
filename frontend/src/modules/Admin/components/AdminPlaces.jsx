import { useState, useEffect, useCallback } from 'react';
import {
    Badge,
    Button,
    Card,
    Col,
    Container,
    Row,
    Spinner,
    Stack,
    Table,
} from 'react-bootstrap';
import { useAuth } from '../../../context/auth/AuthContext';
import { placesApi } from '../../AccessibilityMap/services/places.api';
import {
    translateCategory,
    getCategoryStyle,
} from '../../AccessibilityMap/utils/translations/OSM_TRANSLATIONS';
import { toast } from 'react-toastify';

const STATUS_BADGE = {
    pending: { bg: 'warning', text: 'dark', label: 'Pendiente' },
    approved: { bg: 'success', text: 'white', label: 'Aprobado' },
    rejected: { bg: 'danger', text: 'white', label: 'Rechazado' },
};

export const AdminPlaces = () => {
    const { token } = useAuth();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await placesApi.getPending(token);
            setPlaces(data.places || []);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        load();
    }, [load]);

    const handleStatus = async (placeId, status) => {
        setUpdating(placeId);
        try {
            await placesApi.updateStatus(placeId, status, token);
            toast.success(
                status === 'approved' ? 'Lugar aprobado' : 'Lugar rechazado',
            );
            setPlaces((prev) => prev.filter((p) => p.id !== placeId));
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUpdating(null);
        }
    };

    return (
        <Container fluid="lg" className="py-4">
            <Stack direction="horizontal" gap={3} className="mb-4">
                <i className="fa-solid fa-shield-halved fa-2x text-primary"></i>
                <div>
                    <h3 className="mb-0 text-primary">Moderación de lugares</h3>
                    <small className="text-muted">
                        Revisa los lugares enviados por usuarios antes de
                        publicarlos
                    </small>
                </div>
                {!loading && (
                    <Badge
                        bg="warning"
                        text="dark"
                        pill
                        className="ms-auto fs-6 px-3"
                    >
                        {places.length} pendientes
                    </Badge>
                )}
            </Stack>

            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}

            {!loading && places.length === 0 && (
                <Card className="border-0 shadow-sm text-center py-5">
                    <Card.Body>
                        <i className="fa-solid fa-circle-check fa-3x text-success mb-3 d-block"></i>
                        <Card.Text className="text-muted">
                            No hay lugares pendientes de revisión
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}

            {!loading && places.length > 0 && (
                <Card className="shadow-sm border-0">
                    <Table responsive hover className="mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Nombre</th>
                                <th className="d-none d-md-table-cell">Tipo</th>
                                <th className="d-none d-sm-table-cell">
                                    Lugar
                                </th>
                                <th className="d-none d-lg-table-cell">
                                    Coordenadas
                                </th>
                                <th className="d-none d-md-table-cell">
                                    Enviado
                                </th>
                                <th style={{ width: 160 }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {places.map((place) => {
                                const { icon, color } = getCategoryStyle(
                                    place.sub_type,
                                );
                                const isUpdating = updating === place.id;

                                return (
                                    <tr key={place.id}>
                                        <td>
                                            <div
                                                className="fw-semibold text-truncate"
                                                style={{ maxWidth: 200 }}
                                            >
                                                {place.name}
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
                                                    place.sub_type,
                                                )}
                                            </span>
                                        </td>
                                        <td className="d-none d-sm-table-cell">
                                            {place.place_label ? (
                                                <Badge
                                                    bg="light"
                                                    text="dark"
                                                    className="fw-normal"
                                                >
                                                    <i className="fa-solid fa-folder me-1 text-primary"></i>
                                                    {place.place_label}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted small">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="d-none d-lg-table-cell">
                                            <code className="small text-muted">
                                                {place.latitude.toFixed(5)},{' '}
                                                {place.longitude.toFixed(5)}
                                            </code>
                                        </td>
                                        <td className="d-none d-md-table-cell">
                                            <span className="small text-muted">
                                                {new Date(
                                                    place.created_at,
                                                ).toLocaleDateString('es-ES')}
                                            </span>
                                        </td>
                                        <td>
                                            <Stack
                                                direction="horizontal"
                                                gap={1}
                                                className="justify-content-end"
                                            >
                                                <Button
                                                    size="sm"
                                                    variant="outline-success"
                                                    disabled={isUpdating}
                                                    onClick={() =>
                                                        handleStatus(
                                                            place.id,
                                                            'approved',
                                                        )
                                                    }
                                                    title="Aprobar"
                                                >
                                                    {isUpdating ? (
                                                        <Spinner
                                                            animation="border"
                                                            size="sm"
                                                        />
                                                    ) : (
                                                        <i className="fa-solid fa-check"></i>
                                                    )}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    disabled={isUpdating}
                                                    onClick={() =>
                                                        handleStatus(
                                                            place.id,
                                                            'rejected',
                                                        )
                                                    }
                                                    title="Rechazar"
                                                >
                                                    {isUpdating ? (
                                                        <Spinner
                                                            animation="border"
                                                            size="sm"
                                                        />
                                                    ) : (
                                                        <i className="fa-solid fa-xmark"></i>
                                                    )}
                                                </Button>
                                            </Stack>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Card>
            )}
        </Container>
    );
};
