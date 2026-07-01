import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Spinner,
    Alert,
    Badge,
    Card,
    ListGroup,
    Stack,
} from 'react-bootstrap';
import { tripsApi } from '../modules/Trips/services/trips.api';
import { getCategoryStyle } from '../modules/AccessibilityMap/utils/translations/OSM_TRANSLATIONS';

const PagePublicTripDetail = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        tripsApi
            .getTrip(tripId, null)
            .then(setTrip)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [tripId]);

    if (loading)
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" />
            </Container>
        );

    if (error)
        return (
            <Container className="py-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );

    const days = trip?.days || [];

    return (
        <Container className="py-4">
            {trip.cover_image && (
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${trip.cover_image}`}
                    alt={trip.title}
                    className="w-100 rounded-3 shadow-sm mb-4"
                    style={{ height: '260px', objectFit: 'cover' }}
                />
            )}

            <Stack direction="horizontal" gap={2} className="mb-2 flex-wrap">
                <h2 className="text-primary m-0 flex-grow-1">{trip.title}</h2>
                <Badge bg="success" pill>
                    <i className="fa-solid fa-globe me-1"></i> Público
                </Badge>
            </Stack>

            {trip.description && (
                <Alert variant="light" className="border mb-4">
                    {trip.description}
                </Alert>
            )}

            <p className="text-muted small mb-4">
                <i className="fa-solid fa-calendar-days me-1"></i>
                {days.length} {days.length === 1 ? 'día' : 'días'} · Las fechas
                y horarios solo son visibles para el autor.
            </p>

            <Row className="g-3">
                {days.map((day) => (
                    <Col key={day.id} xs={12} md={6} lg={4}>
                        <Card className="shadow-sm border-0 h-100 d-flex flex-column">
                            <Card.Header className="d-flex align-items-center gap-2">
                                <i className="fa-solid fa-calendar-day text-primary"></i>
                                <span className="fw-bold">
                                    {day.title || `Día ${day.day_number}`}
                                </span>
                            </Card.Header>
                            <ListGroup variant="flush" className="flex-grow-1">
                                {!day.places || day.places.length === 0 ? (
                                    <ListGroup.Item className="text-muted small text-center py-3">
                                        Sin lugares asignados
                                    </ListGroup.Item>
                                ) : (
                                    day.places.map((place) => {
                                        const { icon, color } =
                                            getCategoryStyle(place.sub_type);
                                        return (
                                            <ListGroup.Item
                                                key={place.id}
                                                className="py-2 px-3"
                                            >
                                                <Stack
                                                    direction="horizontal"
                                                    gap={2}
                                                >
                                                    <i
                                                        className={`fa-solid ${icon}`}
                                                        style={{ color }}
                                                    ></i>
                                                    <span className="flex-grow-1 small fw-semibold text-truncate">
                                                        {place.place_name}
                                                    </span>
                                                </Stack>
                                                {place.notes && (
                                                    <div className="text-muted small mt-1 ms-4">
                                                        {place.notes}
                                                    </div>
                                                )}
                                            </ListGroup.Item>
                                        );
                                    })
                                )}
                            </ListGroup>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default PagePublicTripDetail;
