import { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';

export const ModalAddPlace = ({ show, onHide, onSubmit, loadFavorites }) => {
    const [favorites, setFavorites] = useState([]);
    const [selectedFav, setSelectedFav] = useState('');
    const [visitTime, setVisitTime] = useState('');
    const [visitTimeEnd, setVisitTimeEnd] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (!show) return;
        setSelectedFav('');
        setVisitTime('');
        setVisitTimeEnd('');
        setNotes('');
        loadFavorites().then(setFavorites);
    }, [show]);

    const handleSubmit = async () => {
        if (!selectedFav) return;
        await onSubmit(selectedFav, notes, visitTime, visitTimeEnd, favorites);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <div className="d-flex align-items-center text-primary">
                        <i className="fa-solid fa-heart me-2"></i>
                        <h3 className="m-0">Añadir lugar desde favoritos</h3>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {favorites.length === 0 ? (
                    <Alert variant="info">
                        No tienes favoritos guardados aún.
                    </Alert>
                ) : (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Selecciona un favorito</Form.Label>
                            <Form.Select
                                value={selectedFav}
                                onChange={(e) => setSelectedFav(e.target.value)}
                            >
                                <option value="">-- Elige un lugar --</option>
                                {favorites.map((fav) => (
                                    <option key={fav.id} value={fav.id}>
                                        {fav.place_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group>
                                    <Form.Label>
                                        <i className="fa-solid fa-clock me-1 text-primary"></i>
                                        Hora de entrada
                                    </Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={visitTime}
                                        onChange={(e) =>
                                            setVisitTime(e.target.value)
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>
                                        <i className="fa-solid fa-clock me-1 text-secondary"></i>
                                        Hora de salida
                                    </Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={visitTimeEnd}
                                        onChange={(e) =>
                                            setVisitTimeEnd(e.target.value)
                                        }
                                        min={visitTime}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group>
                            <Form.Label>Notas (opcional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Horario, reserva, observaciones..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </Form.Group>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={!selectedFav}
                >
                    <i className="fa-solid fa-plus me-1"></i> Añadir
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
