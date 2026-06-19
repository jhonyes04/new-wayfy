import { translateValue } from '../../utils/translations/OSM_TRANSLATIONS';

const formatAddress = (tags) => {
    const street = tags['addr:street'];
    const number = tags['addr:housenumber'];
    const postcode = tags['addr:postcode'];
    const city = tags['addr:city'];
    if (!street && !city) return null;
    return `${street || ''} ${number || ''}, ${postcode || ''} ${city || ''}`.trim();
};

export const InfoSection = ({ tags }) => {
    const address = formatAddress(tags);
    const website = tags['website'];

    if (!address && !tags['opening_hours'] && !tags['phone'] && !tags['email'] && !website)
        return null;

    return (
        <div className="bg-info rounded-3 text-dark p-2 mt-2">
            <div className="d-flex align-items-center mb-2">
                <i className="fa-solid fa-circle-info me-2"></i>
                <h5 className="m-0">Información</h5>
            </div>
            {address && (
                <div className="small">
                    <strong>Dirección:</strong> {address}
                </div>
            )}
            {website && (
                <div className="small text-truncate">
                    <strong>Web: </strong>
                    <a
                        href={website.startsWith('http') ? website : `https://${website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fw-semibold text-decoration-none"
                    >
                        {translateValue('website', website)}
                        <i className="fa-solid fa-arrow-up-right-from-square ms-2"></i>
                    </a>
                </div>
            )}
        </div>
    );
};
