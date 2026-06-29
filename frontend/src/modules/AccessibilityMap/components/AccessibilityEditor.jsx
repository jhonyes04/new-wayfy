import { useEffect, useState } from 'react';
import { Button, Card, Alert, Spinner, Form } from 'react-bootstrap';
import { accessibilityApi } from '../services/accessibility.api';
import { useAuth } from '../../../context/auth/AuthContext';
import { PhotoLightbox } from './PhotoLightbox';
import { ModalForms } from '../../../components/ModalForms';

const WHEELCHAIR_OPTIONS = [
    {
        value: 'yes',
        label: 'Totalmente accesible',
        color: 'success',
        icon: 'fa-wheelchair-move',
    },
    {
        value: 'limited',
        label: 'Parcialmente accesible',
        color: 'warning',
        icon: 'fa-triangle-exclamation',
    },
    { value: 'no', label: 'No accesible', color: 'danger', icon: 'fa-ban' },
];

const BOOLEAN_FIELDS = [
    { key: 'has_ramp', label: 'Tiene rampa de acceso' },
    { key: 'has_elevator', label: 'Tiene ascensor' },
    { key: 'has_accessible_toilet', label: 'Baño accesible' },
    { key: 'has_accessible_parking', label: 'Parking accesible' },
    { key: 'automatic_door', label: 'Puerta automática' },
];

export const AccessibilityEditor = ({ feature, onClose, onSaved }) => {
    const { user } = useAuth();
    const properties = feature.properties;
    const osmId = String(properties.id);

    const [wheelchair, setWheelchair] = useState(null);
    const [details, setDetails] = useState({
        has_ramp: false,
        has_elevator: false,
        has_accessible_toilet: false,
        has_accessible_parking: false,
        automatic_door: false,
        description: '',
    });
    const [existingPhotos, setExistingPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);
    const [lightbox, setLightbox] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        accessibilityApi
            .getPlaceReview(osmId)
            .then((review) => {
                if (review) {
                    setWheelchair(review.wheelchair);
                    setDetails({
                        has_ramp: review.has_ramp ?? false,
                        has_elevator: review.has_elevator ?? false,
                        has_accessible_toilet:
                            review.has_accessible_toilet ?? false,
                        has_accessible_parking:
                            review.has_accessible_parking ?? false,
                        automatic_door: review.automatic_door ?? false,
                        description: review.description ?? '',
                    });
                    setExistingPhotos(review.photos ?? []);
                }
            })
            .catch(() => {})
            .finally(() => setLoadingData(false));
    }, []);

    const handleDetailChange = (key, value) =>
        setDetails((prev) => ({ ...prev, [key]: value }));

    const handleNewPhotoChange = (e) => {
        const selected = Array.from(e.target.files);
        const remaining = 5 - existingPhotos.length - newPhotos.length;
        setNewPhotos((prev) => [...prev, ...selected.slice(0, remaining)]);
        e.target.value = '';
    };

    const handleDeletePhoto = async (photoId) => {
        try {
            await accessibilityApi.deletePhoto(photoId);
            setExistingPhotos((prev) => prev.filter((p) => p.id !== photoId));
        } catch {
            setError('No se pudo eliminar la foto');
        }
    };

    const handleRemoveNewPhoto = (index) =>
        setNewPhotos((prev) => prev.filter((_, i) => i !== index));

    const handleSubmit = async () => {
        if (!wheelchair) {
            setError('Selecciona el nivel de accesibilidad');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const review = await accessibilityApi.upsert(osmId, {
                ...details,
                wheelchair,
                osm_type: properties.osm_type || 'node',
                place_name: properties.name || 'Lugar sin nombre',
            });

            if (newPhotos.length > 0) {
                await accessibilityApi.uploadPhotos(review.id, newPhotos);
            }

            onSaved?.();
            onClose();
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const totalPhotos = existingPhotos.length + newPhotos.length;

    if (loadingData)
        return (
            <Card className="shadow-lg position-absolute top-50 start-50 translate-middle z-2 p-4">
                <Spinner animation="border" variant="primary" />
            </Card>
        );

    return (
        <>
            <ModalForms>
                <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-center text-light mb-3">
                        <h3 className="m-0">
                            <i className="fa-solid fa-pencil me-2"></i>
                            Editar accesibilidad
                        </h3>
                        <Button
                            variant="link"
                            size="sm"
                            className="p-0 text-secondary text-decoration-none"
                            onClick={onClose}
                        >
                            <i className="fa-solid fa-circle-xmark fs-5"></i>
                        </Button>
                    </div>

                    <h3 className="text-light mb-3">
                        {properties.name || 'Lugar sin nombre'}
                    </h3>

                    <h6 className="text-light mb-2">
                        Nivel de accesibilidad *
                    </h6>
                    <div className="d-flex gap-2 mb-3">
                        {WHEELCHAIR_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                className={`btn btn-sm flex-fill py-2 ${wheelchair === option.value ? `btn-${option.color}` : `btn-outline-${option.color}`}`}
                                onClick={() => setWheelchair(option.value)}
                            >
                                <i
                                    className={`fa-solid ${option.icon} d-block mb-1`}
                                ></i>
                                <span style={{ fontSize: '0.8rem' }}>
                                    {option.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    <h6 className="text-light mb-2">Características</h6>
                    <div className="mb-3">
                        {BOOLEAN_FIELDS.map(({ key, label }) => (
                            <Form.Check
                                key={key}
                                id={key}
                                className="mb-1"
                                label={
                                    <span className="text-light">{label}</span>
                                }
                                checked={details[key]}
                                onChange={(e) =>
                                    handleDetailChange(key, e.target.checked)
                                }
                            />
                        ))}
                    </div>

                    <h6 className="text-light mb-1">Descripción (opcional)</h6>
                    <Form.Control
                        as="textarea"
                        size="sm"
                        className="mb-3"
                        rows={3}
                        placeholder="Describe barreras, facilidades o cualquier detalle útil..."
                        value={details.description}
                        onChange={(e) =>
                            handleDetailChange('description', e.target.value)
                        }
                    />

                    {existingPhotos.length > 0 && (
                        <>
                            <h6 className="text-light mb-1">Fotos guardadas</h6>
                            <div className="d-flex gap-2 flex-wrap mb-3">
                                {existingPhotos.map((photo, idx) => (
                                    <div
                                        key={photo.id}
                                        className="position-relative"
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_BACKEND_URL}${photo.url}`}
                                            alt={photo.caption || 'foto'}
                                            style={{
                                                width: 70,
                                                height: 70,
                                                objectFit: 'cover',
                                                borderRadius: 6,
                                                pacity: 0.7,
                                                border: '2px dashed #0d6efd',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() =>
                                                setLightbox({ index: idx })
                                            }
                                        />
                                        {user && photo.user_id == user.id && (
                                            <button
                                                className="btn btn-danger p-0 position-absolute top-0 end-0"
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    fontSize: '0.6rem',
                                                    lineHeight: 1,
                                                    borderRadius: '50%',
                                                    transform:
                                                        'translate(30%, -30%)',
                                                }}
                                                onClick={() =>
                                                    handleDeletePhoto(photo.id)
                                                }
                                                title="Eliminar foto"
                                            >
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {newPhotos.length > 0 && (
                        <>
                            <h6 className="text-light mb-1">Por subir</h6>
                            <div className="d-flex gap-2 flex-wrap mb-3">
                                {newPhotos.map((photo, i) => (
                                    <div key={i} className="position-relative">
                                        <img
                                            src={URL.createObjectURL(photo)}
                                            alt={`nueva ${i}`}
                                            style={{
                                                width: 70,
                                                height: 70,
                                                objectFit: 'cover',
                                                borderRadius: 6,
                                                opacity: 0.7,
                                                border: '2px dashed #0d6efd',
                                            }}
                                        />
                                        <button
                                            className="btn btn-secondary p-0 position-absolute top-0 end-0"
                                            style={{
                                                width: 20,
                                                height: 20,
                                                fontSize: '0.6rem',
                                                lineHeight: 1,
                                                borderRadius: '50%',
                                                transform:
                                                    'translate(30%, -30%)',
                                            }}
                                            onClick={() =>
                                                handleRemoveNewPhoto(i)
                                            }
                                            title="Quitar foto"
                                        >
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <h6 className="text-light mb-1">
                        Añadir fotos{' '}
                        <span
                            className="fw-normal text-light"
                            style={{ fontSize: '0.8rem' }}
                        >
                            ({totalPhotos}/5)
                        </span>
                    </h6>
                    <Form.Control
                        type="file"
                        className="mb-3"
                        accept="image/*"
                        multiple
                        disabled={totalPhotos >= 5}
                        onChange={handleNewPhotoChange}
                    />

                    {error && (
                        <Alert variant="danger" className="py-1 small">
                            {error}
                        </Alert>
                    )}

                    <Button
                        variant="success"
                        className="w-100 fw-bold"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Spinner
                                    animation="border"
                                    size="sm"
                                    className="me-1"
                                />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-floppy-disk me-1"></i>
                                Guardar valoración
                            </>
                        )}
                    </Button>
                </Card.Body>
            </ModalForms>

            {lightbox && (
                <PhotoLightbox
                    photos={existingPhotos.map((p) => ({
                        src: `${import.meta.env.VITE_BACKEND_URL}${p.url}`,
                        caption: p.caption,
                    }))}
                    initialIndex={lightbox.index}
                    onClose={() => setLightbox(null)}
                />
            )}
        </>
    );
};
