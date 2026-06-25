import { useState, useEffect } from 'react';
import { Row, Col, Stack, Badge, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../../context/auth/AuthContext';
import { tripsApi } from '../services/trips.api';
import { TripCard } from './TripCard';
import { toast } from 'react-toastify';

export const PublicTripsList = () => {
    const { token } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublic = async () => {
            try {
                const data = await tripsApi.getPublicTrips(token);
                setTrips(data.trips || []);
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPublic();
    }, [token]);

    const handleFork = async (tripId) => {
        try {
            await tripsApi.forkTrip(tripId, token);
            toast.success('Viaje copiado a tus viajes');
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
                <i className="fa-solid fa-globe text-success"></i>
                <h4 className="text-primary m-0">Viajes de la comunidad</h4>
                <Badge bg="secondary" pill>
                    {trips.length}
                </Badge>
            </Stack>

            {trips.length === 0 ? (
                <Alert variant="info">
                    Aún no hay viajes públicos compartidos.
                </Alert>
            ) : (
                <Row className="g-3">
                    {trips.map((trip) => (
                        <Col key={trip.id} xs={12} sm={6} lg={4}>
                            <TripCard
                                trip={trip}
                                showForkButton
                                onFork={handleFork}
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </>
    );
};
