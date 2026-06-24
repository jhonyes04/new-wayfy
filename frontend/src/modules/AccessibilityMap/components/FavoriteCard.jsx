import { useState, useEffect } from 'react';
import { Modal, Badge, Button, Stack } from 'react-bootstrap';
import { CommunityReviewSection } from './sections/CommunityReviewSection';
import { OsmAccessibilitySection } from './sections/OsmAccessibilitySection';
import { InfoSection } from './sections/InfoSection';
import { PhotoLightbox } from './PhotoLightbox';
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
            <Modal
                show
                onHide={onClose}
                size="lg"
                scrollable
                centered
                fullscreen="sm-down"
            >
                <Modal.Header
                    className="border-0 p-0 flex-column align-items-stretch"
                    style={{ background: 'rgba(0,0,0,0.85)' }}
                >
                    <Stack
                        direction="horizontal"
                        className="align-items-start p-3 gap-2"
                    >
                        <div className="d-flex flex-grow-1 flex-column gap-3 mt-3">
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
                        <Button
                            variant="link"
                            className="text-secondary p-0 flex-shrink-0"
                            onClick={onClose}
                            aria-label="Cerrar"
                        >
                            <i className="fa-solid fa-circle-xmark fs-4"></i>
                        </Button>
                    </Stack>
                </Modal.Header>

                <Modal.Body
                    className="p-3"
                    style={{ background: 'rgba(0,0,0,0.80)' }}
                >
                    <CommunityReviewSection
                        communityReview={communityReview}
                        onPhotoClick={(idx) => setLightboxIndex(idx)}
                    />
                    <OsmAccessibilitySection tags={tags} />
                    <InfoSection tags={tags} />
                </Modal.Body>

                <Modal.Footer
                    className="border-top border-secondary flex-wrap gap-2 justify-content-between"
                    style={{ background: 'rgba(0,0,0,0.85)' }}
                >
                    <a
                        href={osmUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-secondary text-decoration-none small"
                    >
                        OSM ID: {favorite.osm_id}
                        <i className="fa-solid fa-arrow-up-right-from-square ms-1"></i>
                    </a>
                    <Stack direction="horizontal" gap={2}>
                        <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => {
                                onGoToMap(favorite);
                                onClose();
                            }}
                        >
                            <i className="fa-solid fa-map-location-dot d-none d-sm-inline"></i>
                        </Button>
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                                onRemoved(favorite.osm_id);
                                onClose();
                            }}
                        >
                            <i className="fa-solid fa-trash d-none d-sm-inline"></i>
                        </Button>
                    </Stack>
                </Modal.Footer>
            </Modal>

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
