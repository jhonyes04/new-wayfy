import { useState } from 'react';
import { Button, Card, Form, Spinner } from 'react-bootstrap';
import { useAuth } from '../../../context/auth/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { reverseGeocode } from '../utils/geocoding';
import { OSM_TRANSLATIONS } from '../utils/translations/OSM_TRANSLATIONS';

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

export const CustomPinPopup = ({ longitude, latitude, onClose }) => {
    const { user } = useAuth();
    const { addFavorite, getPlaceLabels, loading } = useFavorites();
    const [name, setName] = useState('');
    const [subType, setSubType] = useState('');
    const [newLabel, setNewLabel] = useState('');

    if (!user) return null;

    const existingLabels = getPlaceLabels();

    const handleSubmit = async () => {
        if (!name.trim()) return;

        const place_label = await reverseGeocode(longitude, latitude);

        const customId = `custom_${Date.now()}`;
        const success = await addFavorite(
            customId,
            name.trim(),
            { longitude, latitude, sub_type: subType || null },
            place_label,
        );

        if (success) onClose();
    };

    const canSubmit = name.trim() && !loading && newLabel.trim();

    return (
        <Card
            className="position-absolute top-50 start-50 translate-middle shadow-lg z-1"
            style={{
                minWidth: '300px',
                maxWidth: '600px',
                background: 'rgba(0,0,0,0.75)',
            }}
        >
            <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
                    <Button
                        variant="link"
                        className="d-flex ms-auto p-0 text-secondary position-absolute text-decoration-none end-0 top-0 mt-2 me-2"
                        onClick={onClose}
                        style={{ zIndex: 1001 }}
                    >
                        <i className="fa-solid fa-circle-xmark fs-5"></i>
                    </Button>
                    <span className="d-flex align-items-center fw-bold text-light mt-4">
                        <i className="fa-solid fa-location-dot me-2 fs-5"></i>
                        <h3 className="mb-0">Ubicación personalizada</h3>
                    </span>
                </div>

                <Form.Control
                    placeholder="Nombre del lugar"
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

                <Button
                    size="sm"
                    variant="success"
                    className="w-100 fw-bold mt-2"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                >
                    {loading ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        <>
                            <i className="fa-regular fa-heart me-2"></i>
                            Guardar en favoritos
                        </>
                    )}
                </Button>
            </Card.Body>
        </Card>
    );
};
