import { Col, Row, Form, InputGroup } from 'react-bootstrap';

export const PersonalDataSection = ({ formData, handleChange }) => {
    return (
        <section>
            <h5 className="text-primary mb-3 border-bottom pb-2">
                <i className="fa-solid fa-address-card me-2"></i>Datos
                Personales
            </h5>
            <Row className="g-3">
                <Col xs={12} md={6}>
                    <Form.Group controlId="profileFirstname">
                        <Form.Label className="small fw-bold text-muted">
                            Nombre
                        </Form.Label>
                        <InputGroup className="rounded-3">
                            <InputGroup.Text className="border-end-0">
                                <i className="fa-solid fa-user text-secondary"></i>
                            </InputGroup.Text>
                            <Form.Control
                                required
                                name="firstname"
                                type="text"
                                placeholder="Tu nombre"
                                value={formData.firstname || ''}
                                onChange={handleChange}
                                className="p-2 border-start-0 focus-ring-0 shadow-none"
                            />
                        </InputGroup>
                    </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                    <Form.Group controlId="profileLastname">
                        <Form.Label className="small fw-bold text-muted">
                            Apellidos
                        </Form.Label>
                        <InputGroup className="rounded-3">
                            <InputGroup.Text className="border-end-0">
                                <i className="fa-solid fa-user text-secondary"></i>
                            </InputGroup.Text>
                            <Form.Control
                                name="lastname"
                                type="text"
                                placeholder="Tus apellidos"
                                value={formData.lastname || ''}
                                onChange={handleChange}
                                className="p-2 border-start-0 focus-ring-0 shadow-none"
                            />
                        </InputGroup>
                    </Form.Group>
                </Col>

                <Col xs={12}>
                    <Form.Group controlId="profileEmail">
                        <Form.Label className="small fw-bold text-muted">
                            Correo Electrónico (No editable)
                        </Form.Label>
                        <InputGroup className="rounded-3 opacity-75">
                            <InputGroup.Text className="border-end-0">
                                <i className="fa-solid fa-envelope text-secondary"></i>
                            </InputGroup.Text>
                            <Form.Control
                                disabled
                                type="email"
                                value={formData.email}
                                className="p-2 bg-secondary-subtle border-secondary-subtle border-start-0 focus-ring-0 shadow-none"
                            />
                        </InputGroup>
                    </Form.Group>
                </Col>
            </Row>
        </section>
    );
};
