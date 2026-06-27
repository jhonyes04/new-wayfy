import { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

export const ModalAssignDate = ({ show, onHide, day, onSubmit }) => {
    const [date, setDate] = useState('');

    useEffect(() => {
        setDate(day?.date || '');
    }, [day]);

    const handleSubmit = async () => {
        await onSubmit(day.id, date);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} centered size="sm">
            <Modal.Header closeButton>
                <Modal.Title className="d-flex  align-items-center text-primary">
                    <i className="fa-solid fa-calendar me-2 text-primary"></i>
                    <h3 className="m-0">Asignar fecha</h3>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>
                        Fecha para {day?.title || `Día ${day?.day_number}`}
                    </Form.Label>
                    <Form.Control
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <Form.Text className="text-muted">
                        Deja vacío para modo relativo (sin fecha fija)
                    </Form.Text>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
