import { useEffect, useState } from 'react';
import { accessibilityApi } from '../services/accessibility.api';

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
    const properties = feature.properties;
    const osmId = String(properties.id);

    const [wheelchair, setWheelchair] = useState(properties.wheelchair || null);
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

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        accessibilityApi
            .getMyReview(osmId)
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

    if (loadingData)
        return (
            <div className="card shadow-lg position-absolute top-50 start-50 translate-middle z-2 p-4">
                <i className="fa-solid fa-spinner fa-spin fa-2x text-primary"></i>
            </div>
        );

    return (
        <div
            className="card shadow-lg position-absolute top-50 start-50 translate-middle overflow-y-auto z-2"
            style={{
                minWidth: '320px',
                maxWidth: '500px',
                maxHeight: 'calc(100vh - 200px)',
            }}
        >
            <div className="card-body p-3">
                {/* Cabecera */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="m-0">
                        <i className="fa-solid fa-pencil me-2"></i>
                        Editar accesibilidad
                    </h4>
                    <button className="btn btn-sm p-0" onClick={onClose}>
                        <i className="fa-solid fa-circle-xmark fs-5"></i>
                    </button>
                </div>

                <h5 className="mb-3">
                    {properties.name || 'Lugar sin nombre'}
                </h5>

                {/* Selector de nivel de accesibilidad */}
                <h6 className="text-primary mb-2">Nivel de accesibilidad *</h6>
                <div className="d-flex gap-2 mb-3">
                    {WHEELCHAIR_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            className={`btn btn-sm flex-fill ${wheelchair === option.value ? `btn-${option.color}` : `btn-outline-${option.color}`} py-2`}
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

                {/* Checkboxes de detalles */}
                <h6 className="text-primary mb-2">Características</h6>
                <div className="mb-3">
                    {BOOLEAN_FIELDS.map(({ key, label }) => (
                        <div className="form-check mb-1" key={key}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={key}
                                checked={details[key]}
                                onChange={(e) =>
                                    handleDetailChange(key, e.target.checked)
                                }
                            />
                            <label className="form-check-label" htmlFor={key}>
                                {label}
                            </label>
                        </div>
                    ))}
                </div>

                {/* Descripción */}
                <h6 className="text-primary mb-1">Descripción (opcional)</h6>
                <textarea
                    className="form-control form-control-sm mb-3"
                    rows={3}
                    placeholder="Describe barreras, facilidades o cualquier detalle útil..."
                    value={details.description}
                    onChange={(e) =>
                        handleDetailChange('description', e.target.value)
                    }
                />

                {/* Fotos guardadas */}
                {existingPhotos.length > 0 && (
                    <>
                        <h6 className="text-primary mb-1">Fotos guardadas</h6>
                        <div className="d-flex gap-2 flex-wrap mb-3">
                            {existingPhotos.map((photo) => (
                                <div
                                    key={photo.id}
                                    className="position-relative"
                                >
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_URL}${photo.url}`}
                                        alt={photo.caption || 'foto'}
                                        style={{
                                            width: 60,
                                            height: 60,
                                            objectFit: 'cover',
                                            borderRadius: 6,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Añadir fotos nuevas */}
                <h6 className="text-primary mb-1">
                    Añadir fotos{' '}
                    {existingPhotos.length > 0 &&
                        `(${existingPhotos.length}/5 subidas)`}
                </h6>
                <input
                    className="form-control form-control-sm mb-2"
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={existingPhotos.length >= 5}
                    onChange={(e) =>
                        setNewPhotos(
                            Array.from(e.target.files).slice(
                                0,
                                5 - existingPhotos.length,
                            ),
                        )
                    }
                />
                {newPhotos.length > 0 && (
                    <div className="d-flex gap-2 flex-wrap mb-3">
                        {newPhotos.map((photo, i) => (
                            <img
                                key={i}
                                src={URL.createObjectURL(photo)}
                                alt={`nueva ${i}`}
                                style={{
                                    width: 60,
                                    height: 60,
                                    objectFit: 'cover',
                                    borderRadius: 6,
                                    opacity: 0.7,
                                    border: '2px dashed #0d6efd',
                                }}
                            />
                        ))}
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger py-1 small">{error}</div>
                )}

                <button
                    className="btn btn-success w-100 fw-bold mt-3"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <i className="fa-solid fa-spinner fa-spin me-1"></i>
                            Guardando...
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-floppy-disk me-1"></i>
                            Guardar valoración
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
