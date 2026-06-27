import { Modal, Button, ListGroup, Spinner, Stack } from 'react-bootstrap';

export const TripSelectModal = ({ trips, loading, onSelect, onClose }) => {
    return (
        <Modal show onHide={onClose} centered size="sm">
            <Modal.Header closeButton>
                <Modal.Title className="fs-6">
                    <i className="fa-solid fa-route me-2 text-primary"></i>
                    ¿A qué viaje pertenece?
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-2">
                {loading ? (
                    <Stack className="align-items-center py-3">
                        <Spinner animation="border" size="sm" />
                    </Stack>
                ) : trips.length === 0 ? (
                    <p className="text-muted text-center small py-2">
                        No tienes viajes creados.
                    </p>
                ) : (
                    <ListGroup variant="flush">
                        {trips.map((trip) => (
                            <ListGroup.Item
                                key={trip.id}
                                action
                                onClick={() => onSelect(trip)}
                                className="d-flex align-items-center gap-2 py-2"
                            >
                                <i className="fa-solid fa-suitcase-rolling text-primary"></i>
                                <span className="fw-semibold text-truncate">
                                    {trip.title}
                                </span>
                                <small className="text-muted ms-auto flex-shrink-0">
                                    {trip.total_days} día
                                    {trip.total_days !== 1 ? 's' : ''}
                                </small>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Modal.Body>

            <Modal.Footer className="py-2">
                <Button variant="outline-secondary" size="sm" onClick={onClose}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
