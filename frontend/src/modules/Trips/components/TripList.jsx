import { useState } from 'react';
import { Row, Col, Button, Stack, Badge, Spinner } from 'react-bootstrap';
import { useTrips } from '../hooks/useTrips';
import { TripCard } from './TripCard';
import { TripFormModal } from './TripFormModal';

export const TripList = () => {
    const {
        trips,
        loading,
        createTrip,
        updateTrip,
        uploadCover,
        removeCover,
        deleteTrip,
    } = useTrips();
    const [showModal, setShowModal] = useState(false);
    const [editingTrip, setEditingTrip] = useState(null);

    const handleEdit = (trip) => {
        setEditingTrip(trip);
        setShowModal(true);
    };

    const handleSubmit = async (formData, coverFile, deleteExistingCover) => {
        let trip;
        if (editingTrip) {
            trip = await updateTrip(editingTrip.id, formData);
            if (coverFile) await uploadCover(editingTrip.id, coverFile);
            else if (deleteExistingCover) await removeCover(editingTrip.id);
        } else {
            trip = await createTrip(formData);
            if (trip && coverFile) await uploadCover(trip.id, coverFile);
        }
        setEditingTrip(null);
        setShowModal(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTrip(null);
    };

    if (loading) {
        return (
            <Row className="justify-content-center py-5">
                <Col xs="auto">
                    <Spinner animation="border" role="status" />
                </Col>
            </Row>
        );
    }

    return (
        <>
            <Stack direction="horizontal" gap={2} className="mb-4">
                <div className="d-flex align-items-center gap-2">
                    <i className="fa-solid fa-route text-primary fa-2x"></i>
                    <h3 className="text-primary m-0">Mis Viajes</h3>
                    <Badge bg="secondary" pill>
                        {trips.length}
                    </Badge>
                </div>
                <Button
                    variant="success"
                    size="sm"
                    className="ms-auto"
                    onClick={() => setShowModal(true)}
                >
                    <i className="fa-solid fa-plus me-1"></i> Nuevo viaje
                </Button>
            </Stack>

            {trips.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <i className="fa-solid fa-route fa-3x mb-3 d-block text-primary opacity-50"></i>
                    <p>Aún no tienes viajes. ¡Crea tu primero!</p>
                </div>
            ) : (
                <Row className="g-3">
                    {trips.map((trip) => (
                        <Col key={trip.id} xs={12} sm={6} lg={4}>
                            <TripCard
                                trip={trip}
                                onEdit={handleEdit}
                                onDelete={deleteTrip}
                            />
                        </Col>
                    ))}
                </Row>
            )}

            <TripFormModal
                show={showModal}
                onHide={handleCloseModal}
                onSubmit={handleSubmit}
                initialData={editingTrip}
            />
        </>
    );
};
