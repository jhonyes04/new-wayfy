import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Col, Container, Form, Row, ProgressBar, InputGroup } from 'react-bootstrap';

const mobilityOptions = [
    { id: 'silla', label: 'Usuario de silla de ruedas', icon: 'fa-wheelchair-move' },
    { id: 'andador', label: 'Uso de andador/bastón', icon: 'fa-person-walking-with-cane' },
    { id: 'movilidad', label: 'Movilidad reducida', icon: 'fa-person-walking' },
    { id: 'mayor', label: 'Persona mayor', icon: 'fa-user-nurse' },
    { id: 'without', label: 'Sin limitaciones', icon: 'fa-check' },
];

export const PageRegister = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        selectedMobility: [],
    });

    const [showPassword, setShowPassword] = useState({ password: false, confirm: false })

    const [step, setStep] = useState(1);

    const toggleMobility = (id) => {
        setFormData((prev) => {
            const alreadySelected = prev.selectedMobility.includes(id);
            return {
                ...prev,
                selectedMobility: alreadySelected
                    ? prev.selectedMobility.filter((item) => item !== id)
                    : [...prev.selectedMobility, id],
            };
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
        } else {
            console.log("Registro completado:", formData);
        }
    };

    return (
        <Container fluid className="d-flex align-items-center justify-content-center bg-light px-3">
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={10} md={6} lg={5} xl={4}>
                    <Card className="border-0 rounded-4 shadow-lg p-4 p-sm-3 bg-white">
                        <Card.Body className="p-0">
                            <div className="text-center mb-4">
                                <h3 className="fw-black text-primary mb-1">Crear cuenta</h3>
                                <p className="text-muted small">Paso {step} de 2: {step === 1 ? 'Datos de acceso' : 'Condiciones de movilidad'}</p>
                                <ProgressBar now={step === 1 ? 50 : 100} variant="primary" style={{ height: '6px' }} className="mt-3 rounded-pill" />
                            </div>

                            <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                                {step === 1 && (
                                    <>
                                        <Form.Group controlId="fullName">
                                            <InputGroup className='rounded-3'>
                                                <InputGroup.Text className='bg-white border-secondary-subtle border-end-0'>
                                                    <i className="fa-solid fa-user text-secondary"></i>
                                                </InputGroup.Text>
                                                <Form.Control
                                                    required
                                                    name="fullName"
                                                    type="text"
                                                    placeholder="Tu nombre y apellidos"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    className="px-0 py-2 border-secondary-subtle border-start-0 focus-ring-0 shadow-none"
                                                />
                                            </InputGroup>
                                        </Form.Group>

                                        <Form.Group controlId="email">
                                            <InputGroup className='rounded-3'>
                                                <InputGroup.Text className='bg-white border-secondary-subtle border-end-0'>
                                                    <i className="fa-solid fa-envelope text-secondary"></i>
                                                </InputGroup.Text>
                                                <Form.Control
                                                    required
                                                    name="email"
                                                    type="email" // Corregido el tipo nativo HTML5
                                                    placeholder="nombre@ejemplo.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="px-0 py-2 border-secondary-subtle border-start-0 focus-ring-0 shadow-none"
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group controlId="password">
                                            <InputGroup className='rounded-3'>
                                                <InputGroup.Text className='bg-white border-secondary-subtle border-end-0'>
                                                    <i className="fa-solid fa-lock text-secondary"></i>
                                                </InputGroup.Text>
                                                <Form.Control
                                                    required
                                                    name="password"
                                                    type={showPassword.password ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="px-0 py-2 border-secondary-subtle border-start-0 focus-ring-0 shadow-none"
                                                />
                                                <Button
                                                    variant='light'
                                                    className='border-secondary-subtle border-start-0 shadow-none>'
                                                    onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                                                >
                                                    <i className={`fa-solid ${showPassword.password ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                                </Button>
                                            </InputGroup>
                                        </Form.Group>

                                        <Form.Group controlId="confirmPassword">
                                            <InputGroup className='rounded-3'>
                                                <InputGroup.Text className='bg-white border-secondary-subtle border-end-0'>
                                                    <i className="fa-solid fa-lock text-secondary"></i>
                                                </InputGroup.Text>
                                                <Form.Control
                                                    required
                                                    name="confirmPassword"
                                                    type={showPassword.confirm ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    className="px-0 py-2 border-secondary-subtle border-start-0 focus-ring-0 shadow-none"
                                                />
                                                <Button
                                                    variant='light'
                                                    className='border-secondary-subtle border-start-0 shadow-none'
                                                    onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                >
                                                    <i className={`fa-solid ${showPassword.confirm ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                                </Button>
                                            </InputGroup>
                                        </Form.Group>



                                        <Button
                                            type="submit"
                                            variant="success"
                                            className="w-100 py-2.5 fw-bold rounded-3 shadow-sm mt-3"
                                        >
                                            Continuar
                                            <i className="fa-solid fa-arrow-circle-right ms-2"></i>
                                        </Button>
                                    </>
                                )}

                                {step === 2 && (
                                    <>
                                        <div className="d-flex flex-column text-start gap-1">
                                            {mobilityOptions.map((opt) => {
                                                const isSelected = formData.selectedMobility.includes(opt.id);

                                                return (
                                                    <button
                                                        key={opt.id}
                                                        type='button'
                                                        onClick={() => toggleMobility(opt.id)}
                                                        className={`btn btn-sm w-100 h-100 d-flex flex-column align-items-start py-2 border-2 rounded-2 ${isSelected
                                                            ? 'btn-success border-success text-primary shadow-sm'
                                                            : 'btn-light border-light-subtle text-muted opacity-50'
                                                            }`}
                                                    >
                                                        <div className="d-flex align-items-center gap-2 px-2">
                                                            <i
                                                                className={`fa-solid ${opt.icon} ${isSelected ? 'text-white' : 'text-muted'
                                                                    } mb-1`}
                                                            ></i>
                                                            <span
                                                                className={`${isSelected ? 'text-white' : 'text-muted'} w-100 px-1`}
                                                            >
                                                                {opt.label}
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="d-flex gap-3 mt-3">
                                            <Button
                                                type="button"
                                                variant="outline-secondary"
                                                className="w-50 py-2.5 fw-bold rounded-3"
                                                onClick={() => setStep(1)}
                                            >
                                                <i className="fa-solid fa-arrow-circle-left me-2"></i>
                                                Atrás
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="success"
                                                className="w-50 py-2.5 fw-bold rounded-3 shadow-sm"
                                            >
                                                <i className="fa-solid fa-user-plus me-2"></i>
                                                Finalizar
                                            </Button>
                                        </div>
                                    </>
                                )}

                                {/* Enlace hacia el login */}
                                <div className="text-center border-top pt-3 mt-2">
                                    <span className="text-muted small">¿Ya estás registrado?</span>
                                    <Link
                                        to="/login"
                                        className="ms-2 small fw-bold text-decoration-none text-primary"
                                    >
                                        Inicia sesión
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