import { useState, useEffect } from 'react';
import { Modal, Badge, Button, Stack, Card } from 'react-bootstrap';
import { CommunityReviewSection } from './sections/CommunityReviewSection';
import { OsmAccessibilitySection } from './sections/OsmAccessibilitySection';
import { InfoSection } from './sections/InfoSection';
import { PhotoLightbox } from './PhotoLightbox';
import { TooltipButton } from '../../../components/TooltipButton';
import { ModalForms } from '../../../components/ModalForms';
import { accessibilityApi } from '../services/accessibility.api';
import {
    translateCategory,
    getCategoryIcon,
} from '../utils/translations/OSM_TRANSLATIONS';

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

export const FavoriteCard = ({ favorite, onClose, onGoToMap, onRemoved }) => {
    const [communityReview, setCommunityReview] = useState(undefined);
    const [lightboxIndex, setLightboxIndex] = useState(null);

    useEffect(() => {
        setCommunityReview(undefined);
        accessibilityApi
            .getByOsmId(String(favorite.osm_id))
            .then((data) => setCommunityReview(data.reviews?.[0] ?? null))
            .catch(() => setCommunityReview(null));
    }, [favorite.osm_id]);

    const tags =
        typeof favorite.all_tags === 'string'
            ? JSON.parse(favorite.all_tags)
            : favorite.all_tags || {};

    const wheelchair =
        WHEELCHAIR_LABELS[communityReview?.wheelchair] ||
        WHEELCHAIR_LABELS[favorite.wheelchair] ||
        WHEELCHAIR_LABELS.unknown;

    const osmUrl = `https://www.openstreetmap.org/${favorite.osm_type || 'node'}/${favorite.osm_id}`;

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
                                {favorite.place_name || 'Lugar sin nombre'}
                            </h3>
                            <div className="small text-white">
                                <i
                                    className={`fa-solid ${getCategoryIcon(favorite.sub_type)} me-2`}
                                ></i>
                                {translateCategory(favorite.sub_type)}
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

                    <CommunityReviewSection
                        communityReview={communityReview}
                        onPhotoClick={(idx) => setLightboxIndex(idx)}
                    />
                    <OsmAccessibilitySection tags={tags} />
                    <InfoSection tags={tags} />

                    <div className="d-flex gap-2 justify-content-end mt-2">
                        <TooltipButton
                            variant="outline-success"
                            size="sm"
                            tooltip="Ver en el mapa"
                            onClick={() => {
                                onGoToMap(favorite);
                                onClose();
                            }}
                        >
                            <i className="fa-solid fa-map-location-dot d-none d-sm-inline"></i>
                        </TooltipButton>
                        <TooltipButton
                            variant="outline-danger"
                            size="sm"
                            tooltip="Eliminar"
                            onClick={() => {
                                onRemoved(favorite.osm_id);
                                onClose();
                            }}
                        >
                            <i className="fa-solid fa-trash d-none d-sm-inline"></i>
                        </TooltipButton>
                    </div>
                </Card.Body>

                {!String(favorite.id).startsWith('custom_') &&
                    !String(favorite.id).startsWith('community_') && (
                        <Card.Footer className="border-top py-2">
                            <div className="d-flex justify-content-between align-items-center text-white">
                                <span style={{ fontSize: '0.7rem' }}>
                                    OSM ID: {favorite.id}
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

            {lightboxIndex !== null && communityReview?.photos?.length > 0 && (
                <PhotoLightbox
                    photos={communityReview.photos.map((p) => ({
                        src: `${import.meta.env.VITE_BACKEND_URL}${p.url}`,
                        caption: p.caption,
                    }))}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                />
            )}
        </>
    );
};
