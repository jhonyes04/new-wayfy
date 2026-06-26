import { useState } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';

export const ModalDateRange = ({ show, onHide, onSubmit }) => {
    const today = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [loading, setLoading] = useState(false);

    const totalDays = () => {
        if (!startDate || !endDate) return 0;
        const diff =
            (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
        return diff >= 0 ? diff + 1 : 0;
    };

    const handleSubmit = async () => {
        if (!startDate || !endDate || totalDays() === 0) return;
        setLoading(true);
        try {
            await onSubmit(startDate, endDate);
            setStartDate(today);
            setEndDate(today);
            onHide();
        } finally {
            setLoading(false);
        }
    };

    const days = totalDays();

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="fa-solid fa-calendar-range me-2 text-primary"></i>
                    Generar días por rango
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="g-3">
                    <Col xs={6}>
                        <Form.Group>
                            <Form.Label>Fecha de inicio</Form.Label>
                            <Form.Control
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group>
                            <Form.Label>Fecha de fin</Form.Label>
                            <Form.Control
                                type="date"
                                value={endDate}
                                min={startDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {days > 0 && (
                    <Alert variant="info" className="mt-3 mb-0">
                        <i className="fa-solid fa-circle-info me-2"></i>
                        Se creará{days > 1 ? 'n' : ''}{' '}
                        <strong>
                            {days} día{days > 1 ? 's' : ''}
                        </strong>{' '}
                        automáticamente
                    </Alert>
                )}
                {startDate && endDate && days === 0 && (
                    <Alert variant="danger" className="mt-3 mb-0">
                        La fecha de fin debe ser igual o posterior a la de
                        inicio
                    </Alert>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={days === 0 || loading}
                >
                    {loading ? (
                        <>
                            <i className="fa-solid fa-spinner fa-spin me-1"></i>{' '}
                            Generando...
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-wand-magic-sparkles me-1"></i>{' '}
                            Generar {days > 0 ? days : ''} días
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
