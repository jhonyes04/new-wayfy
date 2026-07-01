import React from 'react';
import { Col, Container, Row, Table, Badge, Spinner } from 'react-bootstrap';
import useGlobalReducer from '../../hooks/useGlobalReducer';
import { useTrips } from '../../modules/Trips/hooks/useTrips';
import { StatCard } from '../../modules/UserDashboard/components/StatCard';

const PageUserHome = () => {
    const { state } = useGlobalReducer();
    const { trips, loading: loadingTrips } = useTrips();

    const totalForks = trips.reduce((sum, t) => sum + (t.fork_count ?? 0), 0);

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
                        label="Favoritos"
                        count={state.favorites?.length ?? 0}
                        variant="danger"
                    />
                </Col>
                <Col xs={12} sm={6} lg={4}>
                    <StatCard
                        icon="fa-solid fa-map"
                        label="Viajes"
                        count={trips?.length ?? 0}
                        loading={loadingTrips}
                        variant="primary"
                    />
                </Col>
                <Col xs={12} sm={6} lg={4}>
                    <StatCard
                        icon="fa-solid fa-code-fork"
                        label="Forks"
                        count={totalForks}
                        loading={loadingTrips}
                        variant="success"
                    />
                </Col>
            </Row>

            <h5 className="text-primary mb-3">Viajes Forkeados</h5>
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
                        {trips
                            .filter((t) => t.is_public)
                            .map((trip) => (
                                <tr key={trip.id}>
                                    <td>{trip.title}</td>
                                    <td className="text-center">
                                        <Badge bg="success" pill>
                                            <i className="fa-solid fa-globe me-1"></i>
                                            Público
                                        </Badge>
                                    </td>
                                    <td className="text-center">
                                        <Badge bg="success">
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

export default PageUserHome;
