import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
    Row,
    Col,
    Button,
    Stack,
    Badge,
    Spinner,
    Alert,
    ButtonGroup,
} from 'react-bootstrap';

import { useTripDetail } from '../hooks/useTripDetail';
import { TripDayCard } from './TripDayCard';
import { TripCalendar } from './TripCalendar';
import { ModalAddPlace } from './ModalAddPlace';
import { ModalAssignDate } from './ModalAssignDate';
import { ModalDateRange } from './ModalDateRange';

export const TripDetail = ({ tripId }) => {
    const navigate = useNavigate();
    const {
        trip,
        loading,
        isOwner,
        handleDeleteDay,
        handleGenerateDays,
        handleSaveDate,
        handleAddPlace,
        handleUpdatePlace,
        handleDeletePlace,
        handleReorderPlaces,
        loadFavorites,
    } = useTripDetail(tripId);

    const [viewMode, setViewMode] = useState('board');
    const [targetDayId, setTargetDayId] = useState(null);
    const [showAddPlace, setShowAddPlace] = useState(false);
    const [showDateRange, setShowDateRange] = useState(false);
    const [dateModalDay, setDateModalDay] = useState(null);

    if (loading)
        return (
            <Row className="justify-content-center py-5">
                <Col xs="auto">
                    <Spinner animation="border" />
                </Col>
            </Row>
        );
    if (!trip) return null;

    const days = trip.days || [];
    const hasCalendarDates = days.some((d) => d.date);

    return (
        <>
            {trip.cover_image && (
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${trip.cover_image}`}
                    alt={trip.title}
                    className="w-100 rounded-3 shadow-sm mb-3"
                    style={{ height: '220px', objectFit: 'cover' }}
                />
            )}
            <Stack
                direction="horizontal"
                gap={2}
                className="mb-3 flex-wrap text-primary"
            >
                <h3 className="m-0 flex-grow-1">{trip.title}</h3>
                <Badge bg={trip.is_public ? 'success' : 'secondary'} pill>
                    <i
                        className={`fa-solid ${trip.is_public ? 'fa-globe' : 'fa-lock'} me-1`}
                    ></i>
                    {trip.is_public ? 'Público' : 'Privado'}
                </Badge>
                {trip.original_trip_id && (
                    <Badge bg="info" text="dark">
                        <i className="fa-solid fa-code-fork me-1"></i> Copiado
                    </Badge>
                )}
            </Stack>

            {trip.description && (
                <Alert variant="light" className="border mb-3">
                    {trip.description}
                </Alert>
            )}

            <Stack direction="horizontal" gap={2} className="mb-4">
                <ButtonGroup size="sm">
                    <Button
                        variant={
                            viewMode === 'board' ? 'primary' : 'outline-primary'
                        }
                        onClick={() => setViewMode('board')}
                    >
                        <i className="fa-solid fa-table-columns me-1"></i>{' '}
                        Tablero
                    </Button>
                    <Button
                        variant={
                            viewMode === 'calendar'
                                ? 'primary'
                                : 'outline-primary'
                        }
                        onClick={() => setViewMode('calendar')}
                        disabled={!hasCalendarDates}
                        title={
                            !hasCalendarDates
                                ? 'Asigna fechas a los días para usar el calendario'
                                : ''
                        }
                    >
                        <i className="fa-solid fa-calendar-days me-1"></i>{' '}
                        Calendario
                    </Button>
                </ButtonGroup>
                {isOwner && days.length > 0 && (
                    <div className="ms-auto">
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => setShowDateRange(true)}
                        >
                            <i className="fa-solid fa-calendar-days me-1"></i>
                            Seleccionar fechas
                        </Button>
                    </div>
                )}

                {!hasCalendarDates && days.length > 0 && (
                    <span className="text-muted small">
                        <i className="fa-solid fa-circle-info me-1"></i> Asigna
                        fechas a los días para activar el calendario
                    </span>
                )}
            </Stack>

            {days.length === 0 && (
                <div className="text-center py-5 text-muted">
                    <i className="fa-solid fa-calendar-days fa-3x mb-3 d-block text-primary opacity-50"></i>
                    <p>Este viaje no tiene días aún.</p>
                    {isOwner && (
                        <div className="text-center mt-4">
                            <Button
                                variant="primary"
                                onClick={() => setShowDateRange(true)}
                            >
                                <i className="fa-solid fa-calendar-days me-1"></i>
                                Seleccionar fechas
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {viewMode === 'board' && days.length > 0 && (
                <DndProvider backend={HTML5Backend}>
                    <Row className="g-3">
                        {days.map((day) => (
                            <Col key={day.id} xs={12} md={6} xl={4}>
                                <TripDayCard
                                    day={day}
                                    isOwner={isOwner}
                                    onDeleteDay={handleDeleteDay}
                                    onOpenDateModal={setDateModalDay}
                                    onAddPlace={(dayId) => {
                                        setTargetDayId(dayId);
                                        setShowAddPlace(true);
                                    }}
                                    onDeletePlace={handleDeletePlace}
                                    onReorderPlaces={handleReorderPlaces}
                                />
                            </Col>
                        ))}
                    </Row>
                </DndProvider>
            )}

            {viewMode === 'calendar' && hasCalendarDates && (
                <TripCalendar
                    days={days}
                    isOwner={isOwner}
                    onUpdatePlace={handleUpdatePlace}
                    onDeletePlace={handleDeletePlace}
                    onSelectedSlot={({ start }) => {
                        const dateStr = start.toISOString().split('T')[0];
                        const day = days.find((d) => d.date === dateStr);

                        if (day) {
                            setTargetDayId(day.id);
                            setShowAddPlace(true);
                        }
                    }}
                />
            )}

            <ModalAddPlace
                show={showAddPlace}
                onHide={() => setShowAddPlace(false)}
                loadFavorites={loadFavorites}
                onSubmit={(favId, notes, time, timeEnd, favs) =>
                    handleAddPlace(
                        targetDayId,
                        favId,
                        notes,
                        time,
                        timeEnd,
                        favs,
                    )
                }
            />

            <ModalAssignDate
                show={!!dateModalDay}
                onHide={() => setDateModalDay(null)}
                day={dateModalDay}
                onSubmit={handleSaveDate}
            />

            <ModalDateRange
                show={showDateRange}
                onHide={() => setShowDateRange(false)}
                onSubmit={handleGenerateDays}
            />
        </>
    );
};
