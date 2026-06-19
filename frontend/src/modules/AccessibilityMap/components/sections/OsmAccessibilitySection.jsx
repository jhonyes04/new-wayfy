import {
    translateTag,
    translateValue,
} from '../../utils/translations/OSM_TRANSLATIONS';

const nonEmpty = (value) =>
    value !== null && value !== undefined && value !== '' && value !== 'unknown';

export const OsmAccessibilitySection = ({ tags }) => {
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

    const entries = Object.entries(accessibilityTags).filter(([_, v]) => nonEmpty(v));

    if (entries.length === 0) return null;

    return (
        <div className="bg-success rounded-3 text-white p-2 mt-2">
            <div className="d-flex align-items-center mb-2">
                <i className="fa-solid fa-wheelchair me-2"></i>
                <h5 className="m-0">Accesibilidad (OSM)</h5>
            </div>
            {entries.map(([key, value]) => (
                <div className="small mb-2" key={key}>
                    <strong>{translateTag(key)}:</strong>{' '}
                    {String(translateValue(key, value))}
                </div>
            ))}
        </div>
    );
};
