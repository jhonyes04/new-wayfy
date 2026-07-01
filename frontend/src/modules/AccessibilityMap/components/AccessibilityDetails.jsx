import { useState, useEffect } from 'react';
import { Button, Badge, Card, Alert, Spinner } from 'react-bootstrap';
import {
    translateCategory,
    getCategoryIcon,
} from '../utils/translations/OSM_TRANSLATIONS';
import { useAuth } from '../../../context/auth/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { accessibilityApi } from '../services/accessibility.api';
import { AccessibilityEditor } from './AccessibilityEditor';
import { PhotoLightbox } from './PhotoLightbox';
import { CommunityReviewSection } from './sections/CommunityReviewSection';
import { OsmAccessibilitySection } from './sections/OsmAccessibilitySection';
import { InfoSection } from './sections/InfoSection';
import { reverseGeocode } from '../utils/geocoding';
import { ModalForms } from '../../../components/ModalForms';

const WHEELCHAIR_LABELS = {
    yes: { label: 'Accesible', color: 'success', icon: 'fa-wheelchair-move' },
    limited: {
        label: 'Parcialmente accesible',
        color: 'warning',
        icon: 'fa-triangle-exclamation',
    },
    no: { label: 'No accesible', color: 'danger', icon: 'fa-ban' },
    unknown: {
        label: 'Desconocido',
        color: 'secondary',
        icon: 'fa-circle-question',
    },
};

export const AccessibilityDetails = ({ feature, onClose }) => {
    const { user } = useAuth();
    const { addFavorite, removeFavorite, isFavorite, loading, error } =
        useFavorites();

    const [showEditor, setShowEditor] = useState(false);
    const [communityReview, setCommunityReview] = useState(undefined);
    const [communityLightbox, setCommunityLightbox] = useState(null);

    if (!feature) return null;

    const properties = feature.properties;
    const tags =
        typeof properties.all_tags === 'string'
            ? JSON.parse(properties.all_tags)
            : properties.all_tags || {};

    const coords = feature.geometry?.coordinates;

    const effectiveWheelchair =
        communityReview?.wheelchair ?? properties.wheelchair;
    const wheelchair =
        WHEELCHAIR_LABELS[effectiveWheelchair] || WHEELCHAIR_LABELS.unknown;
    const osmUrl = `https://www.openstreetmap.org/${properties.osm_type || 'node'}/${properties.id}`;

    const fetchCommunityReview = () => {
        setCommunityReview(undefined);
        accessibilityApi
            .getByOsmId(String(properties.id))
            .then((data) => setCommunityReview(data.reviews?.[0] ?? null))
            .catch(() => setCommunityReview(null));
    };

    useEffect(() => {
        fetchCommunityReview();
    }, [properties.id]);

    const handleToggleFavorite = async () => {
        if (isFavorite(properties.id)) {
            await removeFavorite(properties.id);
            return;
        }

        const place_label = await reverseGeocode(coords?.[0], coords?.[1]);

        await addFavorite(
            properties.id,
            properties.name || 'Lugar sin nombre',
            {
                longitude: coords?.[0],
                latitude: coords?.[1],
                wheelchair: properties.wheelchair,
                osm_type: properties.osm_type,
                sub_type: properties.sub_type,
                all_tags: tags,
            },
            place_label,
        );
    };

    return (
        <>
            <ModalForms>
                <Card.Body className="p-3">
                    <Button
                        variant="link"
                        className="d-flex ms-auto p-0 text-secondary position-absolute text-decoration-none end-0 top-0 mt-2 me-2"
                        onClick={onClose}
                        style={{ zIndex: 1001 }}
                    >
                        <i className="fa-solid fa-circle-xmark fs-5"></i>
                    </Button>

                    <div className="d-flex flex-column gap-3 mt-3">
                        <div>
                            <h3 className="text-white m-0 lh-sm">
                                {properties.name || 'Lugar sin nombre'}
                            </h3>
                            <div className="small text-white">
                                <i
                                    className={`fa-solid ${getCategoryIcon(properties.sub_type)} me-2`}
                                ></i>
                                {translateCategory(properties.sub_type)}
                            </div>
                        </div>

                        <div className="d-flex align-items-center">
                            <div
                                className={`bg-${wheelchair.color} rounded-circle d-flex align-items-center justify-content-center text-light me-2`}
                                style={{ width: '30px', height: '30px' }}
                            >
                                <i
                                    className={`fa-solid ${wheelchair.icon}`}
                                ></i>
                            </div>
                            <Badge
                                bg="dark"
                                className="rounded-3 text-capitalize fw-bold"
                                style={{
                                    color: `var(--bs-${wheelchair.color})`,
                                }}
                            >
                                {wheelchair.label}
                            </Badge>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="warning" className="mt-2 mb-2 py-2">
                            {error}
                        </Alert>
                    )}

                    <CommunityReviewSection
                        communityReview={communityReview}
                        onPhotoClick={(idx) => setCommunityLightbox(idx)}
                    />
                    <OsmAccessibilitySection tags={tags} />
                    <InfoSection tags={tags} />

                    {user && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <Button
                                variant="success"
                                size="sm"
                                className="fw-bold"
                                onClick={() => setShowEditor(true)}
                            >
                                <i className="fa-solid fa-pencil me-1"></i>
                                Editar accesibilidad
                            </Button>
                            <button
                                className="btn btn-link p-0 text-decoration-none"
                                onClick={handleToggleFavorite}
                                disabled={loading}
                                title={
                                    isFavorite(properties.id)
                                        ? 'Eliminar de favoritos'
                                        : 'Agregar a favoritos'
                                }
                            >
                                {loading ? (
                                    <Spinner
                                        animation="border"
                                        size="sm"
                                        variant="danger"
                                    />
                                ) : (
                                    <i
                                        className={`${isFavorite(properties.id) ? 'fa-solid' : 'fa-regular'} fa-heart fa-2x text-danger`}
                                    ></i>
                                )}
                            </button>
                        </div>
                    )}
                </Card.Body>

                {!String(properties.id).startsWith('custom_') &&
                    !String(properties.id).startsWith('community_') && (
                        <Card.Footer className="border-top py-2">
                            <div className="d-flex justify-content-between align-items-center text-white">
                                <span style={{ fontSize: '0.7rem' }}>
                                    OSM ID: {properties.id}
                                </span>
                                <a
                                    href={osmUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-white text-decoration-none fw-bold"
                                    style={{ fontSize: '0.7rem' }}
                                >
                                    OSM{' '}
                                    <i className="fa-solid fa-arrow-up-right-from-square ms-1"></i>
                                </a>
                            </div>
                        </Card.Footer>
                    )}
            </ModalForms>

            {communityLightbox !== null &&
                communityReview?.photos?.length > 0 && (
                    <PhotoLightbox
                        photos={communityReview.photos.map((p) => ({
                            src: `${import.meta.env.VITE_BACKEND_URL}${p.url}`,
                            caption: p.caption,
                        }))}
                        initialIndex={communityLightbox}
                        onClose={() => setCommunityLightbox(null)}
                    />
                )}

            {showEditor && (
                <AccessibilityEditor
                    feature={feature}
                    onClose={() => setShowEditor(false)}
                    onSaved={() => {
                        setShowEditor(false);
                        fetchCommunityReview();
                        window.dispatchEvent(new Event('wayfy:review-saved'));
                    }}
                />
            )}
        </>
    );
};
