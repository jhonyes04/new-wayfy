import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Container, Form, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import { useAuth } from '../context/auth/AuthContext'
import { useNavigate } from 'react-router-dom';

export const PageLogin = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState(null)
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

        setError(null)
        setLoading(true)

        try {
            await login(formData.email, formData.password)

            navigate('/user-dashboard')
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    };

    return (
        <Container fluid className="d-flex align-items-center justify-content-center bg-light px-3">
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={10} md={6} lg={5} xl={4}>
                    <Card className="border-0 rounded-4 shadow p-4 p-sm-3 bg-white">
                        <Card.Body className="p-0">
                            <div className="text-center mb-4">
                                <h3 className="fw-black text-primary mb-1">¡Bienvenido!</h3>
                                <p className="text-muted small">Ingresa tus datos para continuar</p>
                            </div>

                            {error && (
                                <Alert variant='danger'>{error}</Alert>
                            )}

                            <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                                <Form.Group controlId="email">
                                    <InputGroup className="rounded-3">
                                        <InputGroup.Text className="bg-white border-secondary-subtle border-end-0">
                                            <i className="fa-solid fa-envelope text-secondary"></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            name="email"
                                            type="email"
                                            placeholder="nombre@ejemplo.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="px-0 py-2 border-secondary-subtle border-start-0 focus-ring-0 shadow-none"
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group controlId="password">
                                    <InputGroup className="rounded-3">
                                        <InputGroup.Text className="bg-white border-secondary-subtle border-end-0">
                                            <i className="fa-solid fa-lock text-secondary"></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="px-0 py-2 border-secondary-subtle border-start-0 focus-ring-0 shadow-none"
                                            required
                                        />
                                        <Button
                                            variant="light"
                                            className="border-secondary-subtle border-start-0 shadow-none"
                                            onClick={() => setShowPassword(!showPassword)}
                                            type="button"
                                        >
                                            <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
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