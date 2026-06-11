import { useState, useEffect, useRef } from 'react';
import { Button, Col, Container, Form, Row, InputGroup, Image, Spinner, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/auth/AuthContext';
import { toast } from 'react-toastify';

const mobilityOptions = [
    { id: 'silla', label: 'Usuario de silla de ruedas', icon: 'fa-wheelchair-move' },
    { id: 'andador', label: 'Uso de andador/bastón', icon: 'fa-person-walking-with-cane' },
    { id: 'movilidad', label: 'Movilidad reducida', icon: 'fa-person-walking' },
    { id: 'mayor', label: 'Persona mayor', icon: 'fa-user-nurse' },
    { id: 'without', label: 'Sin limitaciones', icon: 'fa-check' },
];

export const PageUserProfile = () => {
    const { user, token, updateUserContext } = useAuth();
    const fileInputRef = useRef(null);

    const originalDataRef = useRef({
        firstname: '',
        lastname: '',
        selectedMobility: []
    })

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        selectedMobility: [],
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false
    });
    const [avatarPreview, setAvatarPreview] = useState('https://via.placeholder.com/150');
    const [avatarFile, setAvatarFile] = useState(null);
    const [componentLoading, setComponentLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const userId = user?.sub || user?.id;

            if (!userId || !token) {
                setComponentLoading(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    toast.error(data.msg || 'Error al cargar los datos del perfil');
                    return;
                }

                const initialForm = {
                    firstname: data.firstname ?? '',
                    lastname: data.lastname ?? '',
                    email: data.email ?? '',
                    selectedMobility: data.selected_mobility ?? [],
                    password: '',
                    conformPassword: ''
                }

                originalDataRef.current = {
                    firstname: data.firstname ?? '',
                    lastname: data.lastname ?? '',
                    selectedMobility: data.selected_mobility ?? []
                }

                setFormData(initialForm);

                if (data.avatar && !data.avatar.endsWith('None') && !data.avatar.endsWith('null')) {
                    setAvatarPreview(data.avatar);
                }

            } catch (error) {
                console.error('Error fetching user profile:', error);
                toast.error('No se pudo conectar con el servidor');
            } finally {
                setComponentLoading(false);
            }
        };

        fetchUserProfile();
    }, [token, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0]

        if (!file) return

        setAvatarPreview(URL.createObjectURL(file))

        const userId = user?.id
        const formDataFile = new FormData()

        formDataFile.append('file', file)

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/avatar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataFile
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.msg || 'No se pudo guardar el avatar en el servidor')
                return
            }


            if (updateUserContext && data.user) updateUserContext(data.user)

            toast.success('¡Avatar actualizado correctamente')
        } catch (error) {
            console.error('Error al subir avatar:', error)
            toast.error('Error de red al intentar subir el avatar')
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = user?.sub || user?.id;

        if (!userId) return;

        if (formData.password || formData.confirmPassword) {
            if (formData.password !== formData.confirmPassword) {
                toast.error('Las contraseñas no coinciden.');
                return;
            }
            if (formData.password.length < 8) {
                toast.warn('La contraseña debe tener al menos 8 caracteres.');
                return;
            }
        }

        setActionLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    selectedMobility: formData.selectedMobility,
                    ...(formData.password && { password: formData.password })
                })
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.msg || 'Error al actualizar el perfil');
                return;
            }

            if (updateUserContext && data.user) {
                updateUserContext(data.user);
            }

            toast.success('¡Perfil actualizado con éxito!')
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
        } catch (error) {
            console.error('Error al actualizar perfil', error)
            toast.error('Error inesperado en el servidor')
        } finally {
            setActionLoading(false);
        }
    };

    const checkIfDataChanged = () => {
        const origin = originalDataRef.current

        if (formData.firstname !== origin.firstname) return true
        if (formData.lastname !== origin.lastname) return true
        if (formData.password !== '') return true
        if (formData.selectedMobility.length !== origin.selectedMobility.length) return true

        const sortedOrigin = [...origin.selectedMobility].sort();
        const sortedCurrent = [...formData.selectedMobility].sort()

        return sortedOrigin.some((val, index) => val !== sortedCurrent[index])
    }

    const hasChanges = checkIfDataChanged();

    if (componentLoading) {
        return (
            <Container className="d-flex align-items-center justify-content-center min-vh-100">
                <Spinner animation="border" variant="primary" role="status">
                    <span className="visually-hidden">Cargando perfil...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="bg-light  d-flex align-items-center justify-content-center w-100">
            <Row className="w-100">
                <Col className='col-auto'>
                    <Form onSubmit={handleSubmit}>
                        <Row className="gap-4 gap-lg-0">
                            <Col xs={12} lg={4} className="d-flex flex-column align-items-center text-center border-end-lg border-light pe-lg-4 justify-content-start pt-3">
                                <div className="position-relative d-inline-block mb-3">
                                    <Image
                                        src={avatarPreview}
                                        roundedCircle
                                        className={`shadow border border-5 border-success objectFit`}
                                        width={150}
                                        height={150}
                                    />

                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center rounded-circle p-2 shadow"
                                        onClick={() => fileInputRef.current.click()}
                                        type="button"
                                    >
                                        <i className="fa-solid fa-camera text-white"></i>
                                    </Button>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="d-none"
                                        accept=".jpg, .jpeg, .png"
                                        onChange={handleAvatarChange}
                                    />
                                </div>
                                <p className="text-muted small mb-4">Gestiona tus datos de acceso y preferencias de movilidad desde un solo lugar.</p>
                                <Badge variant='primary'>{user.is_active}</Badge>
                            </Col>

                            <Col xs={12} lg={8} className="ps-lg-4 d-flex flex-column flex-grow-1 gap-4">
                                <section>
                                    <h5 className="text-primary mb-3 border-bottom pb-2">
                                        <i className="fa-solid fa-address-card text-muted me-2"></i>Datos Personales
                                    </h5>
                                    <Row className="g-3">
                                        <Col xs={12} md={6}>
                                            <Form.Group controlId="profileFirstname">
                                                <Form.Label className="small fw-bold text-muted">Nombre</Form.Label>
                                                <InputGroup className='rounded-3'>
                                                    <InputGroup.Text className='bg-light border-secondary-subtle border-end-0'>
                                                        <i className="fa-solid fa-user text-secondary"></i>
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        required
                                                        name="firstname"
                                                        type="text"
                                                        placeholder="Tu nombre"
                                                        value={formData.firstname || ''}
                                                        onChange={handleChange}
                                                        className="px-0 py-2 bg-light border-secondary-subtle border-start-0 focus-ring-0 shadow-none"
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>

                                        <Col xs={12} md={6}>
                                            <Form.Group controlId="profileLastname">
                                                <Form.Label className="small fw-bold text-muted">Apellidos</Form.Label>
                                                <InputGroup className='rounded-3'>
                                                    <InputGroup.Text className='bg-light border-secondary-subtle border-end-0'>
                                                        <i className="fa-solid fa-user text-secondary"></i>
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        name="lastname"
                                                        type="text"
                                                        placeholder="Tus apellidos"
                                                        value={formData.lastname || ''}
                                                        onChange={handleChange}
                                                        className="px-0 py-2 bg-light border-secondary-subtle border-start-0 focus-ring-0 shadow-none"
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>

                                        <Col xs={12}>
                                            <Form.Group controlId="profileEmail">
                                                <Form.Label className="small fw-bold text-muted">Correo Electrónico (No editable)</Form.Label>
                                                <InputGroup className='rounded-3 opacity-75'>
                                                    <InputGroup.Text className='bg-secondary-subtle border-secondary-subtle border-end-0'>
                                                        <i className="fa-solid fa-envelope text-secondary"></i>
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        disabled
                                                        type="email"
                                                        value={formData.email}
                                                        className="px-0 py-2 bg-secondary-subtle border-secondary-subtle border-start-0 focus-ring-0 shadow-none"
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </section>

                                <section>
                                    <h5 className="text-primary mb-3 border-bottom pb-2">
                                        <i className="fa-solid fa-wheelchair me-2 text-muted"></i>Condiciones de Movilidad
                                    </h5>
                                    <div className="d-flex flex-column gap-2">
                                        {mobilityOptions.map((opt) => {
                                            const isSelected = formData.selectedMobility.includes(opt.id);

                                            return (
                                                <button
                                                    key={opt.id}
                                                    type='button'
                                                    onClick={() => toggleMobility(opt.id)}
                                                    className={`btn btn-sm w-100 d-flex align-items-center py-2.5 px-3 border-2 rounded-2 transition-all ${isSelected
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
                                </section>

                                <section>
                                    <h5 className="text-primary mb-3 border-bottom pb-2">
                                        <i className="fa-solid fa-lock text-muted me-2"></i>Seguridad
                                    </h5>
                                    <Row className="g-3">
                                        <Col xs={12} md={6}>
                                            <Form.Group controlId="profilePassword">
                                                <Form.Label className="small fw-bold text-muted">Nueva Contraseña</Form.Label>
                                                <InputGroup className='rounded-3'>
                                                    <InputGroup.Text className='bg-light border-secondary-subtle border-end-0'>
                                                        <i className="fa-solid fa-key text-secondary"></i>
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        name="password"
                                                        type={showPassword.password ? "text" : "password"}
                                                        placeholder='Dejar en blanco para mantener'
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        className="px-0 py-2 bg-light border-secondary-subtle border-start-0 border-end-0 focus-ring-0 shadow-none"
                                                    />
                                                    <Button
                                                        variant="outline-secondary"
                                                        className="border-secondary-subtle border-start-0 bg-light"
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
                                                    <InputGroup.Text className='bg-light border-secondary-subtle border-end-0'>
                                                        <i className="fa-solid fa-shield-halved text-secondary"></i>
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        name="confirmPassword"
                                                        type={showPassword.confirmPassword ? "text" : "password"}
                                                        placeholder='Repite la contraseña'
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        className="px-0 py-2 bg-light border-secondary-subtle border-start-0 focus-ring-0 shadow-none"
                                                    />
                                                    <Button
                                                        variant="outline-secondary"
                                                        className="border-secondary-subtle border-start-0 bg-light"
                                                        onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                                                    >
                                                        <i className={`fa-solid ${showPassword.confirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-muted`}></i>
                                                    </Button>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </section>

                                <Button
                                    type="submit"
                                    variant={`${hasChanges ? 'success' : 'outline-secondary'}`}
                                    disabled={!hasChanges || actionLoading}
                                    className={`w-100 py-2.5 fw-bold rounded-3 shadow-sm mt-2`}
                                >
                                    {actionLoading ? (
                                        'Guardando cambios...'
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-floppy-disk me-2"></i>
                                            Guardar Cambios
                                        </>
                                    )}
                                </Button>


                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};