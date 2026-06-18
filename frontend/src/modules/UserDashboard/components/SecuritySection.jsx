import { Col, Row, Form, InputGroup, Button } from 'react-bootstrap';

export const SecuritySection = ({ formData, handleChange, showPassword, setShowPassword }) => {
    return (
        <section>
            <h5 className="text-primary mb-3 border-bottom pb-2">
                <i className="fa-solid fa-lock text-muted me-2"></i>Seguridad
            </h5>
            <Row className="g-3">
                <Col xs={12} md={6}>
                    <Form.Group controlId="profilePassword">
                        <Form.Label className="small fw-bold text-muted">Nueva Contraseña</Form.Label>
                        <InputGroup className='rounded-3'>
                            <InputGroup.Text className='border-end-0'>
                                <i className="fa-solid fa-key text-secondary"></i>
                            </InputGroup.Text>
                            <Form.Control
                                name="password"
                                type={showPassword.password ? "text" : "password"}
                                placeholder='Dejar en blanco para mantener'
                                value={formData.password}
                                onChange={handleChange}
                                className="p-2 border-start-0 border-end-0 focus-ring-0 shadow-none"
                            />
                            <Button
                                variant="outline-secondary"
                                className="border-start-0 bg-transparent border-secondary-subtle focus-ring-0"
                                onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                            >
                                <i className={`fa-solid ${showPassword.password ? 'fa-eye-slash' : 'fa-eye'} text-muted`}></i>
                            </Button>
                        </InputGroup>
                    </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                    <Form.Group controlId="profileConfirmPassword">
                        <Form.Label className="small fw-bold text-muted">Confirmar Nueva Contraseña</Form.Label>
                        <InputGroup className='rounded-3'>
                            <InputGroup.Text className='border-end-0'>
                                <i className="fa-solid fa-shield-halved text-secondary"></i>
                            </InputGroup.Text>
                            <Form.Control
                                name="confirmPassword"
                                type={showPassword.confirmPassword ? "text" : "password"}
                                placeholder='Repite la contraseña'
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="p-2 border-start-0 border-end-0 focus-ring-0 shadow-none"
                            />
                            <Button
                                variant="outline-secondary"
                                className="border-start-0 bg-transparent border-secondary-subtle focus-ring-0"
                                onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                            >
                                <i className={`fa-solid ${showPassword.confirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-muted`}></i>
                            </Button>
                        </InputGroup>
                    </Form.Group>
                </Col>
            </Row>
        </section>
    );
};