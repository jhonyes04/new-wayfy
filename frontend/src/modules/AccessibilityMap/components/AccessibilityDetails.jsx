import { Link } from 'react-router-dom';
import {
    translateTag,
    translateValue,
    translateCategory,
    getCategoryIcon,
} from '../utils/translations/OSM_TRANSLATIONS';
import useGlobalReducer from '../../../hooks/useGlobalReducer';
import { useAuth } from '../../../context/auth/AuthContext';
import { useState } from 'react';
import { AccessibilityEditor } from './AccessibilityEditor';

const WHEELCHAIR_LABELS = {
    yes: {
        label: 'Accesible',
        color: 'success',
        icon: 'fa-wheelchair-move',
    },
    limited: {
        label: 'Parcialmente accesible',
        color: 'warning',
        icon: 'fa-triangle-exclamation',
    },
    no: {
        label: 'No accesible',
        color: 'danger',
        icon: 'fa-ban',
    },
    unknown: {
        label: 'Desconocido',
        color: 'secondary',
        icon: 'fa-circle-question',
    },
};

const formatAddress = (tags) => {
    const street = tags['addr:street'];
    const number = tags['addr:housenumber'];
    const postcode = tags['addr:postcode'];
    const city = tags['addr:city'];

    if (!street && !city) return null;

    return `${street || ''} ${number || ''}, ${postcode || ''} ${city || ''}`.trim();
};

export const AccessibilityDetails = ({ feature, onClose }) => {
    const { state, dispatch } = useGlobalReducer();
    const { favorites } = state;

    const { user } = useAuth();

    if (!feature) return null;

    const properties = feature.properties;
    const category = translateCategory(properties.sub_type);
    const categoryIcon = getCategoryIcon(properties.sub_type);

    const tags =
        typeof properties.all_tags === 'string'
            ? JSON.parse(properties.all_tags)
            : properties.all_tags || {};

    const coords = feature.geometry?.coordinates;
    const isFavorite = favorites?.some(
        (favorite) => favorite.id === properties.id,
    );
    const wheelchair =
        WHEELCHAIR_LABELS[properties.wheelchair] || WHEELCHAIR_LABELS.unknown;
    const osmUrl = `https://www.openstreetmap.org/${properties.osm_type || 'node'}/${properties.id}`;

    const [showEditor, setShowEditor] = useState(false);

    const handleToggleFavorite = () => {
        if (isFavorite) {
            dispatch({ type: 'REMOVE_FAVORITE', payload: properties.id });
        } else {
            dispatch({
                type: 'ADD_FAVORITE',
                payload: {
                    id: properties.id,
                    name: properties.name || 'Lugar sin nombre',
                    longitude: coords?.[0],
                    latitude: coords?.[1],
                },
            });
        }
    };

    const nonEmpty = (value) =>
        value !== null &&
        value !== undefined &&
        value !== '' &&
        value !== 'unknown';

    const AutoFields = ({ data }) =>
        Object.entries(data)
            .filter(([_, value]) => nonEmpty(value))
            .map(([key, value]) => {
                const label = translateTag(key);
                const translatedValue = translateValue(key, value);

                return (
                    <div className="small mb-2" key={key}>
                        <strong>{label}:</strong> {String(translatedValue)}
                    </div>
                );
            });

    const accessibilityTags = {
        'wheelchair:description': tags['wheelchair:description'],
        'wheelchair:access': tags['wheelchair:access'],
        'entrance:wheelchair': tags['entrance:wheelchair'],
        'door:width': tags['door:width'],
        'door:automatic': tags['door:automatic'],
        'door:bell': tags['door:bell'],
        kerb: tags['kerb'],
        incline: tags['incline'],
        tactile_paving: tags['tactile_paving'],
        'toilets:wheelchair': tags['toilets:wheelchair'],
        'wheelchair:boarding': tags['wheelchair:boarding'],
        step_free: tags['step_free'],
        lift: tags['lift'],
        escalator: tags['escalator'],
    };

    const infoTags = {
        address: formatAddress(tags),
        opening_hours: tags['opening_hours'],
        phone: tags['phone'],
        email: tags['email'],
        website: tags['website'],
    };

    const Section = ({ title, icon, children }) => (
        <>
            <h6>
                <i className={`fa-solid ${icon} me-2`}></i>
                {title}
            </h6>
            {children}
        </>
    );

    return (
        <>
            <div
                className="card shadow-lg position-absolute top-50 start-50 translate-middle z-1"
                style={{
                    background: 'rgba(0, 0, 0, 0.65)',
                    minWidth: '300px',
                    maxWidth: '600px',
                    maxHeight: 'calc(100vh - 140px)',
                    overflowY: 'auto',
                }}
            >
                {/* CABECERA */}
                <div className="card-body p-3">
                    <button
                        className="btn d-flex ms-auto p-0 text-secondary position-absolute end-0 top-0 mt-2 me-2"
                        onClick={onClose}
                        style={{ zIndex: 1001 }}
                    >
                        <i className="fa-solid fa-circle-xmark fs-5"></i>
                    </button>

                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex">
                            <div
                                className={`bg-${wheelchair.color} rounded-circle shadow-sm d-flex align-items-center justify-content-center text-white`}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    fontSize: '1.2rem',
                                }}
                            >
                                <i
                                    className={`fa-solid ${wheelchair.icon}`}
                                ></i>
                            </div>
                            <div
                                className={`badge bg-dark py-1 px-3 rounded-3 text-capitalize align-self-end ms-2 fw-bold`}
                                style={{
                                    color: `var(--bs-${wheelchair.color})`,
                                }}
                            >
                                {wheelchair.label}
                            </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="text-white m-0 lh-sm">
                                    {properties.name || 'Lugar sin nombre'}
                                </h5>

                                <div className="small text-white">
                                    <i
                                        className={`fa-solid ${categoryIcon} me-2`}
                                    ></i>
                                    {category}
                                </div>
                            </div>
                        </div>
                    </div>

                    {Object.values(accessibilityTags).some(nonEmpty) && (
                        <div
                            className={`bg-success rounded-3 text-white p-2 mt-2`}
                        >
                            <Section title="Accesibilidad" icon="fa-wheelchair">
                                <AutoFields data={accessibilityTags} />
                            </Section>
                        </div>
                    )}

                    {(infoTags.address ||
                        infoTags.opening_hours ||
                        infoTags.phone ||
                        infoTags.email ||
                        infoTags.website) && (
                        <div className="bg-info rounded-3 text-dark p-2 mt-2">
                            <Section title="Información" icon="fa-circle-info">
                                {infoTags.address && (
                                    <div className="small">
                                        <strong>Dirección:</strong>{' '}
                                        {infoTags.address}
                                    </div>
                                )}
                                {infoTags.website && (
                                    <div className="small text-truncate">
                                        <strong>Web: </strong>
                                        <a
                                            href={
                                                infoTags.website.startsWith(
                                                    'http',
                                                )
                                                    ? infoTags.website
                                                    : `https://${infoTags.website}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="fw-semibold text-decoration-none"
                                        >
                                            {translateValue(
                                                'website',
                                                infoTags.website,
                                            )}
                                            <i className="fa-solid fa-arrow-up-right-from-square ms-2"></i>
                                        </a>
                                    </div>
                                )}
                            </Section>
                        </div>
                    )}

                    {user && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <button
                                className="btn btn-sm btn-success fw-bold"
                                onClick={() => setShowEditor(true)}
                            >
                                <i className="fa-solid fa-pencil me-1"></i>
                                Editar accesibilidad
                            </button>
                            <i
                                className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart fa-2x text-danger`}
                                style={{ cursor: 'pointer' }}
                                onClick={handleToggleFavorite}
                            ></i>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="card-footer border-top py-2">
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
                </div>
            </div>

            {showEditor && (
                <AccessibilityEditor
                    feature={feature}
                    onClose={() => setShowEditor(false)}
                    onSaved={() => {
                        setShowEditor(false);
                    }}
                />
            )}
        </>
    );
};
