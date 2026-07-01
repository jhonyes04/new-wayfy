import { useState, useEffect, useRef } from 'react';
import {
    Button,
    Col,
    Container,
    Form,
    Row,
    InputGroup,
    Image,
    Spinner,
    Badge,
} from 'react-bootstrap';
import { useAuth } from '../../context/auth/AuthContext';
import { toast } from 'react-toastify';
import { Loading } from '../../components/Loading';
import { AvatarSection } from '../../modules/UserDashboard/components/AvatarSection';
import { PersonalDataSection } from '../../modules/UserDashboard/components/PersonalDataSection';
import { MobilitySection } from '../../modules/UserDashboard/components/MobilitySection';
import { SecuritySection } from '../../modules/UserDashboard/components/SecuritySection';
import { useProtectedImage } from '../../hooks/useProtectedImage';
import { passwordRequirements } from '../../components/PasswordStrengthIndicator';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const DEFAULT_AVATAR = `${API_BASE_URL}/api/users/avatar/default_avatar.png`;

const hasValidAvatar = (avatar) =>
    avatar && !avatar.endsWith('None') && !avatar.endsWith('null');

const getUserId = (user) => user?.sub || user?.id;

const buildProfileForm = (data) => ({
    firstname: data.firstname ?? '',
    lastname: data.lastname ?? '',
    email: data.email ?? '',
    selectedMobility: data.selected_mobility ?? [],
    password: '',
    confirmPassword: '',
});

const buildProfileSnapshot = (data) => ({
    firstname: data.firstname ?? '',
    lastname: data.lastname ?? '',
    selectedMobility: data.selected_mobility ?? [],
});

const buildAuthHeaders = (token, contentType = 'application/json') => ({
    Authorization: `Bearer ${token}`,
    ...(contentType ? { 'Content-Type': contentType } : {}),
});

const mobilityOptions = [
    {
        id: 'silla',
        label: 'Usuario de silla de ruedas',
        icon: 'fa-wheelchair-move',
    },
    {
        id: 'andador',
        label: 'Uso de andador/bastón',
        icon: 'fa-person-walking-with-cane',
    },
    { id: 'movilidad', label: 'Movilidad reducida', icon: 'fa-person-walking' },
    { id: 'mayor', label: 'Persona mayor', icon: 'fa-user-nurse' },
    { id: 'without', label: 'Sin limitaciones', icon: 'fa-check' },
];

const PageUserProfile = () => {
    const { user, token, updateUserContext } = useAuth();
    const fileInputRef = useRef(null);

    const originalDataRef = useRef({
        firstname: '',
        lastname: '',
        selectedMobility: [],
    });

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        selectedMobility: [],
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    });

    const [avatarUrl, setAvatarUrl] = useState(null);
    const [localPreview, setLocalPreview] = useState(null);
    const blobUrl = useProtectedImage(avatarUrl, token);
    const [componentLoading, setComponentLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (hasValidAvatar(user?.avatar)) {
            setAvatarUrl(`${API_BASE_URL}${user.avatar}`);
        }
    }, [user]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const userId = getUserId(user);

            if (!userId || !token) {
                setComponentLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/users/${userId}`,
                    {
                        method: 'GET',
                        headers: buildAuthHeaders(token),
                    },
                );

                const data = await response.json();

                if (!response.ok) {
                    toast.error(
                        data.msg || 'Error al cargar los datos del perfil',
                    );
                    return;
                }

                const initialForm = buildProfileForm(data);

                originalDataRef.current = buildProfileSnapshot(data);

                setFormData(initialForm);

                if (hasValidAvatar(data.avatar)) {
                    setAvatarUrl(`${API_BASE_URL}${data.avatar}`);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                toast.error('No se pudo conectar con el servidor');
            } finally {
                setComponentLoading(false);
            }
        };

        fetchUserProfile();
    }, [token, user?.id, user?.sub]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
        const file = e.target.files[0];

        if (!file) return;

        setAvatarUrl(URL.createObjectURL(file));

        const formDataFile = new FormData();
        formDataFile.append('file', file);

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/avatar`, {
                method: 'PUT',
                headers: buildAuthHeaders(token, null),
                body: formDataFile,
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(
                    data.msg || 'No se pudo guardar el avatar en el servidor',
                );
                // Revertir vista previa si falla
                setLocalPreview(null);
                return;
            }

            if (updateUserContext && data.user) {
                updateUserContext(data.user, data.token, data.expiresIn);
            }

            toast.success('¡Avatar actualizado correctamente!');
        } catch (error) {
            console.error('Error al subir avatar:', error);
            toast.error('Error de red al intentar subir el avatar');
            setLocalPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = getUserId(user);

        if (!userId) return;

        const allPassed = passwordRequirements.every((r) =>
            r.test(formData.password),
        );

        if (!allPassed) {
            toast.warn(
                'La contraseña no cumple todos los requisitos de seguridad',
            );
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.warn('Las contraseñas no coinciden');
            return;
        }

        setActionLoading(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/users/${userId}`,
                {
                    method: 'PUT',
                    headers: buildAuthHeaders(token),
                    body: JSON.stringify({
                        firstname: formData.firstname,
                        lastname: formData.lastname,
                        selectedMobility: formData.selectedMobility,
                        ...(formData.password && {
                            password: formData.password,
                        }),
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.msg || 'Error al actualizar el perfil');
                return;
            }

            if (updateUserContext && data.user) {
                updateUserContext(
                    data.user,
                    data.token || null,
                    data.expiresIn,
                );
            }

            toast.success('¡Perfil actualizado con éxito!');
            setFormData((prev) => ({
                ...prev,
                password: '',
                confirmPassword: '',
            }));
        } catch (error) {
            console.error('Error al actualizar perfil', error);
            toast.error('Error inesperado en el servidor');
        } finally {
            setActionLoading(false);
        }
    };

    const checkIfDataChanged = () => {
        const origin = originalDataRef.current;

        if (formData.firstname !== origin.firstname) return true;
        if (formData.lastname !== origin.lastname) return true;
        if (formData.password !== '') return true;
        if (formData.selectedMobility.length !== origin.selectedMobility.length)
            return true;

        const sortedOrigin = [...origin.selectedMobility].sort();
        const sortedCurrent = [...formData.selectedMobility].sort();

        return sortedOrigin.some((val, index) => val !== sortedCurrent[index]);
    };

    const hasChanges = checkIfDataChanged();

    if (componentLoading) <Loading label="Cargando perfil..." />;

    return (
        <Container className="bg-light d-flex align-items-center justify-content-center w-100">
            <Row className="w-100">
                <Col className="col-auto w-100">
                    <Form onSubmit={handleSubmit}>
                        <Row className="gap-4 gap-lg-0">
                            <AvatarSection
                                avatarPreview={
                                    localPreview || blobUrl || DEFAULT_AVATAR
                                }
                                user={user}
                                handleAvatarChange={handleAvatarChange}
                            />

                            <Col
                                xs={12}
                                lg={8}
                                className="ps-lg-4 d-flex flex-column flex-grow-1 gap-4"
                            >
                                <PersonalDataSection
                                    formData={formData}
                                    handleChange={handleChange}
                                />

                                <MobilitySection
                                    selectedMobility={formData.selectedMobility}
                                    toggleMobility={toggleMobility}
                                />

                                <SecuritySection
                                    formData={formData}
                                    handleChange={handleChange}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                />

                                <Button
                                    type="submit"
                                    variant={`${hasChanges ? 'primary' : 'outline-secondary'}`}
                                    disabled={!hasChanges || actionLoading}
                                    className="w-100 py-2.5 fw-bold rounded-3 shadow-sm mt-2"
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

export default PageUserProfile;
