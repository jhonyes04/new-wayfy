import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Table, Badge, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/auth/AuthContext';
import useGlobalReducer from '../../hooks/useGlobalReducer';
import { tripsApi } from '../../modules/Trips/services/trips.api';
import { useTrips } from '../../modules/Trips/hooks/useTrips';
import { StatCard } from '../../modules/UserDashboard/components/StatCard';

export const PageUserHome = () => {
    const { state } = useGlobalReducer();
    const { token } = useAuth();
    const { trips, loading: loadingTrips } = useTrips();
    const [forkMap, setForkMap] = useState({});
    const [loadingForks, setLoadingForks] = useState(false);

    useEffect(() => {
        if (!trips.length || !token) return;

        const myTripIds = new Set(trips.map((t) => t.id));

        setLoadingForks(true);
        tripsApi
            .getPublicTrips(token)
            .then((data) => {
                const map = {};
                (data.trips || []).forEach((t) => {
                    if (
                        t.original_trip_id &&
                        myTripIds.has(t.original_trip_id)
                    ) {
                        map[t.original_trip_id] =
                            (map[t.original_trip_id] ?? 0) + 1;
                    }
                });
                setForkMap(map);
            })
            .catch(() => setForkMap({}))
            .finally(() => setLoadingForks(false));
    }, [trips, token]);

    const totalForks = Object.values(forkMap).reduce((s, n) => s + n, 0);

    return (
        <Container>
            <div className="d-flex align-items-center text-primary mb-4">
                <i className="fa-solid fa-chart-pie fa-2x me-1"></i>
                <h3 className="m-0">Resumen</h3>
            </div>
            <Row className="g-4 mb-4">
                <Col xs={12} sm={6} lg={4}>
                    <StatCard
                        icon="fa-solid fa-heart"
                        label="Favoritos guardados"
                        count={state.favorites?.length ?? 0}
                        variant="danger"
                    />
                </Col>
                <Col xs={12} sm={6} lg={4}>
                    <StatCard
                        icon="fa-solid fa-map"
                        label="Viajes creados"
                        count={trips?.length ?? 0}
                        loading={loadingTrips}
                        variant="primary"
                    />
                </Col>
                <Col xs={12} sm={6} lg={4}>
                    <StatCard
                        icon="fa-solid fa-code-fork"
                        label="Forks totales"
                        count={totalForks}
                        loading={loadingForks}
                        variant="success"
                    />
                </Col>
            </Row>

            <h5 className="text-primary mb-3">Forks por viaje</h5>
            {loadingTrips || loadingForks ? (
                <Spinner animation="border" size="sm" />
            ) : (
                <Table hover responsive className="align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Viaje</th>
                            <th className="text-center">Visibilidad</th>
                            <th className="text-center">Forks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trips.map((trip) => (
                            <tr key={trip.id}>
                                <td>{trip.title}</td>
                                <td className="text-center">
                                    <Badge
                                        bg={
                                            trip.is_public
                                                ? 'success'
                                                : 'secondary'
                                        }
                                        pill
                                    >
                                        <i
                                            className={`fa-solid ${trip.is_public ? 'fa-globe' : 'fa-lock'} me-1`}
                                        ></i>
                                        {trip.is_public ? 'Público' : 'Privado'}
                                    </Badge>
                                </td>
                                <td className="text-center">
                                    <Badge
                                        bg={
                                            forkMap[trip.id]
                                                ? 'success'
                                                : 'light'
                                        }
                                        text={
                                            forkMap[trip.id] ? 'white' : 'muted'
                                        }
                                    >
                                        <i className="fa-solid fa-code-fork me-1"></i>
                                        {forkMap[trip.id] ?? 0}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};
