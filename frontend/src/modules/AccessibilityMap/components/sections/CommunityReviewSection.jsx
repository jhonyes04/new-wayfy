const BOOLEAN_LABELS = {
    has_ramp: 'Rampa de acceso',
    has_elevator: 'Ascensor',
    has_accessible_toilet: 'Baño accesible',
    has_accessible_parking: 'Parking accesible',
    automatic_door: 'Puerta automática',
};

const formatDate = (isoString) =>
    new Date(isoString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

export const CommunityReviewSection = ({ communityReview, onPhotoClick }) => {
    if (communityReview === undefined)
        return (
            <div className="text-white small mt-2">
                <i className="fa-solid fa-spinner fa-spin me-1"></i>
                Cargando datos de accesibilidad...
            </div>
        );

    if (!communityReview) return null;

    const activeFeatures = Object.entries(BOOLEAN_LABELS).filter(
        ([key]) => communityReview[key] === true,
    );

    return (
        <div
            className="rounded-3 p-2 mt-2"
            style={{ background: 'rgba(0,0,0,0.4)' }}
        >
            <div className="text-light">
                <div className="d-flex align-items-center mb-2">
                    <i className="fa-solid fa-users me-2"></i>
                    <h5 className="m-0">Valoración de la comunidad</h5>
                </div>

                {activeFeatures.map(([key, label]) => (
                    <div className="small mb-1 text-white" key={key}>
                        <i className="fa-solid fa-check text-success me-2"></i>
                        {label}
                    </div>
                ))}

                {communityReview.description && (
                    <div className="small text-white mt-2">
                        <strong>Descripción: </strong>
                        {communityReview.description}
                    </div>
                )}

                {communityReview.photos?.length > 0 && (
                    <div className="d-flex gap-2 flex-wrap mt-2">
                        {communityReview.photos.map((photo, idx) => (
                            <img
                                key={photo.id}
                                src={`${import.meta.env.VITE_BACKEND_URL}${photo.url}`}
                                alt={photo.caption || 'foto'}
                                style={{
                                    width: 60,
                                    height: 60,
                                    objectFit: 'cover',
                                    borderRadius: 6,
                                    cursor: 'pointer',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                }}
                                onClick={() => onPhotoClick(idx)}
                            />
                        ))}
                    </div>
                )}
                <div
                    className="d-flex justify-content-between mt-2 pt-2 border-top border-secondary"
                    style={{ fontSize: '0.7rem', opacity: 0.7 }}
                >
                    {communityReview.last_modified_by_name && (
                        <div>
                            <i className="fa-solid fa-user me-1"></i>
                            {communityReview.last_modified_by_name}
                        </div>
                    )}
                    <div>
                        <i className="fa-solid fa-clock me-1"></i>
                        Última actualización:{' '}
                        {formatDate(communityReview.updated_at)}
                    </div>
                </div>
            </div>
        </div>
    );
};
