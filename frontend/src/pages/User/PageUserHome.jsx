import React from 'react';
import { Col, Container, Row, Table, Badge, Spinner } from 'react-bootstrap';
import useGlobalReducer from '../../hooks/useGlobalReducer';
import { useTrips } from '../../modules/Trips/hooks/useTrips';
import { StatCard } from '../../modules/UserDashboard/components/StatCard';

export const PageUserHome = () => {
    const { state } = useGlobalReducer();
    const { trips, loading: loadingTrips } = useTrips();

    const totalForks = trips.reduce((sum, t) => sum + (t.fork_count ?? 0), 0);

    return (
        <Container className="py-4">
            <h4 className="mb-4">Resumen</h4>
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
                        loading={loadingTrips}
                        variant="success"
                    />
                </Col>
            </Row>

            <h5 className="mb-3">Forks por viaje</h5>
            {loadingTrips ? (
                <Spinner animation="border" size="sm" />
            ) : (
                <Table hover responsive className="align-middle">
                    <thead className="table-light">
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
                                            trip.fork_count
                                                ? 'success'
                                                : 'light'
                                        }
                                        text={
                                            trip.fork_count ? 'white' : 'muted'
                                        }
                                    >
                                        <i className="fa-solid fa-code-fork me-1"></i>
                                        {trip.fork_count ?? 0}
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
