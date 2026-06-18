import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Container, Form, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import { useAuth } from '../context/auth/AuthContext'
import { toast } from 'react-toastify';

export const PageLogin = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.warn('Por favor, completa todos los campos')
            return
        }

        setLoading(true)

        try {
            await login(formData.email, formData.password)

            navigate('/user-dashboard')
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    };

    return (
        <Container fluid className="d-flex align-items-center justify-content-center bg-light px-3">
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={10} md={6} lg={5} xl={4}>
                    <Card className="border-0 rounded-4 shadow p-4 p-sm-3">
                        <Card.Body className="p-0">
                            <div className="text-center mb-4">
                                <h3 className="fw-black text-primary mb-1">¡Bienvenido!</h3>
                                <p className="text-muted small">Ingresa tus datos para continuar</p>
                            </div>

                            <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                                <Form.Group controlId="email">
                                    <InputGroup className="rounded-3">
                                        <InputGroup.Text className="border-end-0">
                                            <i className="fa-solid fa-envelope text-secondary"></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            name="email"
                                            type="email"
                                            placeholder="nombre@ejemplo.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="p-2 border-start-0 focus-ring-0 shadow-none"
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group controlId="password">
                                    <InputGroup className="rounded-3">
                                        <InputGroup.Text className="border-end-0">
                                            <i className="fa-solid fa-lock text-secondary"></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="p-2 border-start-0 border-end-0 shadow-none"
                                            required
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            className="border-start-0 bg-transparent border-secondary-subtle focus-ring-0"
                                            onClick={() => setShowPassword(!showPassword)}
                                            type="button"
                                        >
                                            <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} text-muted`}></i>
                                        </Button>
                                    </InputGroup>
                                </Form.Group>

                                <Button
                                    type="submit"
                                    variant="success"
                                    className="w-100 py-2.5 fw-bold rounded-3 shadow-sm mt-2 custom-btn"
                                    disabled={loading}
                                >
                                    {loading ? "Iniciando..." : "Iniciar sesión"}
                                </Button>

                                <div className="text-center border-top pt-3 mt-2">
                                    <span className="text-muted small">¿No tienes cuenta?</span>
                                    <Link
                                        to="/register"
                                        className="ms-2 small fw-bold text-decoration-none text-primary"
                                    >
                                        Regístrate
                                    </Link>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};