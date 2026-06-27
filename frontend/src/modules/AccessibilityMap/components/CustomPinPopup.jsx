import { useState } from 'react';
import { Button, Card, Form, Spinner } from 'react-bootstrap';
import { useAuth } from '../../../context/auth/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { useTrips } from '../../Trips/hooks/useTrips';
import { TripSelectModal } from './TripSelectModal';

export const CustomPinPopup = ({ longitude, latitude, onClose }) => {
    const { user } = useAuth();
    const { addFavorite, loading } = useFavorites();
    const { trips, loading: tripsLoading } = useTrips();
    const [name, setName] = useState('');
    const [showTripModal, setShowTripModal] = useState(false);

    if (!user) return null;

    const handleSubmit = () => {
        if (!name.trim()) return;
        setShowTripModal(true);
    };

    const handleSelectTrip = async (trip) => {
        setShowTripModal(false);
        const customId = `custom_${Date.now()}`;
        const success = await addFavorite(
            customId,
            name.trim(),
            { longitude, latitude },
            trip.id,
        );
        if (success) onClose();
    };

    return (
        <>
            <Card
                className="position-absolute top-50 start-50 translate-middle w-100 shadow-lg z-1"
                style={{
                    minWidth: '260px',
                    maxWidth: '400px',
                    maxHeight: '400px',
                    background: 'rgba(0,0,0,0.75)',
                }}
            >
                <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold text-white small">
                            <i className="fa-solid fa-location-dot me-2 text-primary"></i>
                            Agregar ubicación personalizada
                        </span>
                        <Button
                            variant="link"
                            className="p-0 text-secondary text-decoration-none"
                            onClick={onClose}
                        >
                            <i className="fa-solid fa-circle-xmark"></i>
                        </Button>
                    </div>
                    <Form.Control
                        size="sm"
                        placeholder="Nombre del lugar"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        className="mb-2"
                        autoFocus
                    />
                    <Button
                        size="sm"
                        variant="primary"
                        className="w-100 fw-bold"
                        onClick={handleSubmit}
                        disabled={!name.trim() || loading || tripsLoading}
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

            {showTripModal && (
                <TripSelectModal
                    trips={trips}
                    loading={tripsLoading}
                    onSelect={handleSelectTrip}
                    onClose={() => setShowTripModal(false)}
                />
            )}
        </>
    );
};
