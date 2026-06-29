import { useState } from 'react';
import { Button, Card, Form, Spinner, Badge } from 'react-bootstrap';
import { useAuth } from '../../../context/auth/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { reverseGeocode } from '../utils/geocoding';
import { OSM_TRANSLATIONS } from '../utils/translations/OSM_TRANSLATIONS';
import { placesApi } from '../services/places.api';
import { accessibilityApi } from '../services/accessibility.api';
import { ModalForms } from '../../../components/ModalForms';

const CATEGORY_GROUPS = [
    {
        label: 'Gastronomía',
        keys: [
            'restaurant',
            'cafe',
            'bar',
            'pub',
            'fast_food',
            'ice_cream',
            'food_court',
        ],
    },
    {
        label: 'Alojamiento',
        keys: [
            'hotel',
            'hostel',
            'apartment',
            'motel',
            'guest_house',
            'camp_site',
        ],
    },
    {
        label: 'Transporte',
        keys: [
            'bus_stop',
            'bus_station',
            'station',
            'subway_entrance',
            'taxi',
            'parking',
            'bicycle_parking',
        ],
    },
    {
        label: 'Cultura',
        keys: [
            'museum',
            'art_gallery',
            'theatre',
            'cinema',
            'library',
            'place_of_worship',
            'viewpoint',
            'attraction',
            'information',
            'picnic_site',
        ],
    },
    {
        label: 'Recreación',
        keys: [
            'park',
            'playground',
            'garden',
            'nightclub',
            'recreation_ground',
        ],
    },
    {
        label: 'Deporte',
        keys: [
            'sports_centre',
            'stadium',
            'pitch',
            'swimming_pool',
            'fitness_centre',
        ],
    },
    {
        label: 'Salud',
        keys: [
            'hospital',
            'clinic',
            'pharmacy',
            'dentist',
            'doctors',
            'social_facility',
        ],
    },
    {
        label: 'Gobierno',
        keys: [
            'townhall',
            'courthouse',
            'embassy',
            'police',
            'post_office',
            'fire_station',
        ],
    },
    {
        label: 'Tiendas',
        keys: ['supermarket', 'convenience', 'bakery', 'clothes', 'mall'],
    },
    { label: 'Dinero', keys: ['bank', 'atm', 'bureau_de_change'] },
    { label: 'Baños', keys: ['toilets'] },
];

const WHEELCHAIR_OPTIONS = [
    {
        value: 'yes',
        label: 'Accesible',
        color: 'success',
        icon: 'fa-wheelchair-move',
    },
    {
        value: 'limited',
        label: 'Parcial',
        color: 'warning',
        icon: 'fa-triangle-exclamation',
    },
    { value: 'no', label: 'No accesible', color: 'danger', icon: 'fa-ban' },
];

const BOOLEAN_FIELDS = [
    { key: 'has_ramp', label: 'Rampa de acceso' },
    { key: 'has_elevator', label: 'Ascensor' },
    { key: 'has_accessible_toilet', label: 'Baño accesible' },
    { key: 'has_accessible_parking', label: 'Parking accesible' },
    { key: 'automatic_door', label: 'Puerta automática' },
];

const INITIAL_DETAILS = {
    has_ramp: false,
    has_elevator: false,
    has_accessible_toilet: false,
    has_accessible_parking: false,
    automatic_door: false,
    description: '',
};

export const CustomPinPopup = ({ longitude, latitude, onClose }) => {
    const { user, token } = useAuth();
    const { addFavorite, getPlaceLabels, loading } = useFavorites();

    const [name, setName] = useState('');
    const [subType, setSubType] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [wheelchair, setWheelchair] = useState(null);
    const [details, setDetails] = useState(INITIAL_DETAILS);
    const [saving, setSaving] = useState(false);

    if (!user) return null;

    const existingLabels = getPlaceLabels();

    const handleDetailChange = (key, value) =>
        setDetails((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async () => {
        if (!name.trim()) return;
        setSaving(true);

        try {
            const place_label = await reverseGeocode(longitude, latitude);

            const customId = `custom_${Date.now()}`;

            const success = await addFavorite(
                customId,
                name.trim(),
                { longitude, latitude, sub_type: subType || null },
                place_label,
            );

            if (success) {
                if (wheelchair) {
                    accessibilityApi
                        .upsert(customId, {
                            ...details,
                            wheelchair,
                            osm_type: 'node',
                            place_name: name.trim(),
                        })
                        .catch(() => {});
                }

                placesApi
                    .createPlace(
                        {
                            name: name.trim(),
                            longitude,
                            latitude,
                            sub_type: subType || null,
                            place_label,
                        },
                        token,
                    )
                    .catch(() => {});

                onClose();
            }
        } finally {
            setSaving(false);
        }
    };

    const canSubmit = name.trim() && !loading && !saving;

    return (
        <ModalForms>
            <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="d-flex align-items-center fw-bold text-light gap-2">
                        <i className="fa-solid fa-location-dot fs-5"></i>
                        <h3 className="mb-0">Nuevo lugar</h3>
                    </span>
                    <Button
                        variant="link"
                        className="p-0 text-secondary text-decoration-none"
                        onClick={onClose}
                    >
                        <i className="fa-solid fa-circle-xmark fs-5"></i>
                    </Button>
                </div>

                <Form.Control
                    placeholder="Nombre del lugar *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className="mb-2"
                    autoFocus
                />

                <Form.Select
                    className="mb-2"
                    value={subType}
                    onChange={(e) => setSubType(e.target.value)}
                >
                    <option value="">Tipo de lugar (opcional)</option>
                    {CATEGORY_GROUPS.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                            {group.keys.map((key) => (
                                <option key={key} value={key}>
                                    {OSM_TRANSLATIONS.categories[key]}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </Form.Select>

                <hr className="border-secondary my-3" />

                <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="text-light small fw-semibold">
                        Accesibilidad
                    </span>
                    <Badge
                        bg="secondary"
                        className="fw-normal"
                        style={{ fontSize: '0.7rem' }}
                    >
                        opcional
                    </Badge>
                </div>

                <div className="d-flex gap-2 mb-3">
                    {WHEELCHAIR_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            className={`btn btn-sm flex-fill py-2 ${wheelchair === opt.value ? `btn-${opt.color}` : `btn-outline-${opt.color}`}`}
                            onClick={() =>
                                setWheelchair(
                                    wheelchair === opt.value ? null : opt.value,
                                )
                            }
                        >
                            <i
                                className={`fa-solid ${opt.icon} d-block mb-1`}
                            ></i>
                            <span style={{ fontSize: '0.72rem' }}>
                                {opt.label}
                            </span>
                        </button>
                    ))}
                </div>

                {wheelchair && (
                    <>
                        <div className="mb-2">
                            {BOOLEAN_FIELDS.map(({ key, label }) => (
                                <Form.Check
                                    key={key}
                                    id={`pin-${key}`}
                                    className="mb-1"
                                    label={
                                        <span className="text-light small">
                                            {label}
                                        </span>
                                    }
                                    checked={details[key]}
                                    onChange={(e) =>
                                        handleDetailChange(
                                            key,
                                            e.target.checked,
                                        )
                                    }
                                />
                            ))}
                        </div>

                        <Form.Control
                            as="textarea"
                            size="sm"
                            rows={2}
                            className="mb-3"
                            placeholder="Describe el nivel de accesibilidad..."
                            value={details.description}
                            onChange={(e) =>
                                handleDetailChange(
                                    'description',
                                    e.target.value,
                                )
                            }
                        />
                    </>
                )}

                <Button
                    size="sm"
                    variant="success"
                    className="w-100 fw-bold mt-1"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                >
                    {saving || loading ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        <>
                            <i className="fa-regular fa-heart me-2"></i>
                            Guardar en favoritos
                        </>
                    )}
                </Button>
            </Card.Body>
        </ModalForms>
    );
};
