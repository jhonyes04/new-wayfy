import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Container, Form, Row, ProgressBar, InputGroup } from 'react-bootstrap';
import { useAuth } from '../context/auth/AuthContext';
import { toast } from 'react-toastify';

const mobilityOptions = [
    { id: 'silla', label: 'Usuario de silla de ruedas', icon: 'fa-wheelchair-move' },
    { id: 'andador', label: 'Uso de andador/bastón', icon: 'fa-person-walking-with-cane' },
    { id: 'movilidad', label: 'Movilidad reducida', icon: 'fa-person-walking' },
    { id: 'mayor', label: 'Persona mayor', icon: 'fa-user-nurse' },
    { id: 'without', label: 'Sin limitaciones', icon: 'fa-check' },
];

export const PageRegister = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
        selectedMobility: [],
    });

    const { setSession } = useAuth()

    const [showPassword, setShowPassword] = useState({ password: false, confirm: false })
    const [step, setStep] = useState(1);

    const navigate = useNavigate()

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (step === 1) {
            if (formData.password.length < 8) {
                toast.warn('La contraseña debe tener al menos 8 caracteres')
                return
            }

            if (formData.password !== formData.confirmPassword) {
                toast.warn('Las contraseñas no coinciden')
                return
            }

            setStep(2)
            return
        }


        const payload = {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            selectedMobility: formData.selectedMobility
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.msg || 'Error en el registro')
                return
            }

            setSession(data.token, data.expiresIn)

            toast.success('!Registro completado con éxito! Bienvenido')

            navigate('/user-dashboard')
        } catch (error) {
            console.error('Error en el registro', error)
            toast.error("Error inesperado en el servidor")
        }
    };

    return (
        <Container fluid className="d-flex align-items-center justify-content-center bg-light px-3">
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={10} md={6} lg={5} xl={4}>
                    <Card className="border-0 rounded-4 shadow-lg p-4 p-sm-3">
                        <Card.Body className="p-0">
                            <div className="text-center mb-4">
                                <h3 className="fw-black text-primary mb-1">Crear cuenta</h3>
                                <p className="text-muted small">Paso {step} de 2: {step === 1 ? 'Datos de acceso' : 'Condiciones de movilidad'}</p>
                                <ProgressBar now={step === 1 ? 50 : 100} variant="primary" style={{ height: '6px' }} className="mt-3 rounded-pill" />
                            </div>

                            <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                                {step === 1 && (
                                    <>
                                        <Form.Group controlId="fristname">
                                            <InputGroup className='rounded-3'>
                                                <InputGroup.Text className='border-end-0'>
                                                    <i className="fa-solid fa-user text-secondary"></i>
                                                </InputGroup.Text>
                                                <Form.Control
                                                    required
                                                    name="firstname"
                                                    type="text"
                                                    placeholder="Tu nombre"
                                                    value={formData.firstname}
                                                    onChange={handleChange}
                                                    className="p-2 border-start-0 focus-ring-0 shadow-none"
                                                />
                                            </InputGroup>
                                        </Form.Group>

                                        <Form.Group controlId="lastname">
                                            <InputGroup className='rounded-3'>
                                                <InputGroup.Text className='border-end-0'>
                                                    <i className="fa-solid fa-user text-secondary"></i>
                                                </InputGroup.Text>
                                                <Form.Control
                                                    name="lastname"
                                                    type="text"
                                                    placeholder="Tus apellidos"
                                                    value={formData.lastname}
                                                    onChange={handleChange}
                                                    className="p-2 border-start-0 focus-ring-0 shadow-none"
                                                />
                                            </InputGroup>
                                        </Form.Group>

                                        <Form.Group controlId="email">
                                            <InputGroup className='rounded-3'>
                                                <InputGroup.Text>
                                                    <i className="fa-solid fa-envelope text-secondary"></i>
                                                </InputGroup.Text>
                                                <Form.Control
                                                    required
                                                    name="email"
                                                    type="email"
                                                    placeholder="nombre@ejemplo.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="p-2 border-start-0 focus-ring-0 shadow-none"
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group controlId="password">
                                            <InputGroup className='rounded-3'>
                                                <InputGroup.Text className='border-end-0'>
                                                    <i className="fa-solid fa-lock text-secondary"></i>
                                                </InputGroup.Text>
                                                <Form.Control
                                                    required
                                                    name="password"
                                                    type={showPassword.password ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="p-2 border-start-0 border-end-0 focus-ring-0 shadow-none"
                                                />
                                                <Button
                                                    variant='outline-secondary'
                                                    className="border-start-0 bg-transparent border-secondary-subtle focus-ring-0"
                                                    onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                                                >
                                                    <i className={`fa-solid ${showPassword.password ? 'fa-eye-slash' : 'fa-eye'} text-muted`}></i>
                                                </Button>
                                            </InputGroup>
                                        </Form.Group>

                                        <Form.Group controlId="confirmPassword">
                                            <InputGroup className='rounded-3'>
                                                <InputGroup.Text className='border-end-0'>
                                                    <i className="fa-solid fa-lock text-secondary"></i>
                                                </InputGroup.Text>
                                                <Form.Control
                                                    required
                                                    name="confirmPassword"
                                                    type={showPassword.confirm ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    className="p-2 border-start-0 border-end-0 focus-ring-0 shadow-none"
                                                />
                                                <Button
                                                    variant='outline-secondary'
                                                    className="border-start-0 bg-transparent border-secondary-subtle focus-ring-0"
                                                    onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                >
                                                    <i className={`fa-solid ${showPassword.confirm ? 'fa-eye-slash' : 'fa-eye'} text-muted`}></i>
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
                                                        className={`btn btn-sm w-100 d-flex align-items-center py-2 px-3 border-2 rounded-2 mb-2 ${isSelected
                                                            ? 'btn-success border-success text-white shadow-sm'
                                                            : 'btn-light border-light-subtle text-muted opacity-75'
                                                            }`}
                                                    >
                                                        <div className="d-flex align-items-center gap-3 w-100">
                                                            <i className={`fa-solid ${opt.icon} ${isSelected ? 'text-white' : 'text-secondary'} fs-5`}></i>
                                                            <span className="fw-semibold text-start flex-grow-1">{opt.label}</span>
                                                            {isSelected && <i className="fa-solid fa-circle-check text-white"></i>}
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