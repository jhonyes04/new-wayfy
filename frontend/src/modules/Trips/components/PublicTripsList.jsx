import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col, Stack, Badge, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../../context/auth/AuthContext';
import { tripsApi } from '../services/trips.api';
import { TripCard } from './TripCard';
import { toast } from 'react-toastify';

export const PublicTripsList = () => {
    const { token, user } = useAuth();
    const [trips, setTrips] = useState([]);
    const [forkedIds, setForkedIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [publicData, myData] = await Promise.all([
                    tripsApi.getPublicTrips(token),
                    token
                        ? tripsApi.getMyTrips(token)
                        : Promise.resolve({ trips: [] }),
                ]);
                setTrips(publicData.trips || []);
                const ids = new Set(
                    (myData.trips || [])
                        .filter((t) => t.original_trip_id)
                        .map((t) => t.original_trip_id),
                );
                setForkedIds(ids);
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [token]);

    const handleFork = async (tripId) => {
        if (!token) {
            toast.info('Inicia sesión para copiar este viaje');
            navigate('/login');
            return;
        }
        try {
            const data = await tripsApi.forkTrip(tripId, token);
            setForkedIds((prev) => new Set([...prev, tripId]));
            toast.success('Viaje copiado a tus viajes');
            navigate(`/user-dashboard?tab=trip-detail&tripId=${data.trip.id}`);
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (loading) {
        return (
            <Row className="justify-content-center py-5">
                <Col xs="auto">
                    <Spinner animation="border" />
                </Col>
            </Row>
        );
    }

    return (
        <>
            <Stack direction="horizontal" gap={2} className="mb-4">
                <i className="fa-solid fa-globe fa-2x text-primary"></i>
                <h3 className="text-primary m-0">Viajes de la comunidad</h3>
                <Badge bg="secondary" pill className="fs-6">
                    {trips.length}
                </Badge>
            </Stack>

            {trips.length === 0 ? (
                <Alert variant="info">
                    Aún no hay viajes públicos compartidos.
                </Alert>
            ) : (
                <Row className="g-3">
                    {!user && (
                        <Alert variant="info" className="mb-4">
                            <i className="fa-solid fa-circle-info me-2"></i>
                            <strong>¿Te gusta algún viaje?</strong>{' '}
                            <Link
                                to="/login"
                                className="text-decoration-none fw-bold"
                            >
                                Inicia sesión
                            </Link>{' '}
                            para copiarlo a tus viajes
                        </Alert>
                    )}
                    {trips.map((trip) => (
                        <Col key={trip.id} xs={12} sm={6} lg={4}>
                            <TripCard
                                trip={trip}
                                showForkButton={trip.user_id !== user?.id}
                                onFork={handleFork}
                                publicView
                                alreadyForked={forkedIds.has(trip.id)}
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </>
    );
};
