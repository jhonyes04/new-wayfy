import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Card, ListGroup, Stack } from 'react-bootstrap';
import { useDrag, useDrop } from 'react-dnd';
import { TooltipButton } from '../../../components/TooltipButton';
import { getCategoryStyle } from '../../AccessibilityMap/utils/translations/OSM_TRANSLATIONS';
import { ModalTripDayMap } from './ModalTripDayMap';

const DRAG_TYPE = 'TRIP_PLACE';

const DraggablePlaceItem = ({
    place,
    index,
    isOwner,
    dayId,
    onDeletePlace,
    onMovePlace,
    onDragEnd,
}) => {
    const ref = useRef(null);
    const { icon, color } = getCategoryStyle(place.sub_type);

    const [{ isDragging }, drag] = useDrag({
        type: DRAG_TYPE,
        item: { index },
        end: () => onDragEnd(),
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    const [{ isOver }, drop] = useDrop({
        accept: DRAG_TYPE,
        hover(item) {
            if (item.index === index) return;
            onMovePlace(item.index, index);
            item.index = index;
        },
        collect: (monitor) => ({ isOver: monitor.isOver() }),
    });

    drag(drop(ref));

    return (
        <ListGroup.Item
            ref={ref}
            className="py-2 px-3"
            style={{
                opacity: isDragging ? 0.4 : 1,
                backgroundColor: isOver
                    ? 'var(--bs-primary-bg-subtle)'
                    : undefined,
                cursor: isOwner ? 'grab' : 'default',
                transition: 'background-color 0.15s',
            }}
        >
            <Stack direction="horizontal" gap={2}>
                {isOwner && (
                    <i
                        className="fa-solid fa-grip-vertical text-muted"
                        style={{ cursor: 'grab', fontSize: 12 }}
                    ></i>
                )}
                <i className={`fa-solid ${icon}`} style={{ color }}></i>
                <span className="flex-grow-1 small fw-semibold text-truncate">
                    {place.place_name}
                </span>
                {place.visit_time && (
                    <Badge
                        bg="info"
                        text="dark"
                        className="small justify-content-between"
                        style={{ minWidth: '120px' }}
                    >
                        <i className="fa-solid fa-clock me-1"></i>
                        {place.visit_time}
                        {place.visit_time_end && ` - ${place.visit_time_end}`}
                    </Badge>
                )}
                {isOwner && (
                    <TooltipButton
                        variant="outline-danger"
                        size="sm"
                        className="border-0"
                        tooltip="Eliminar lugar"
                        onClick={() => onDeletePlace(dayId, place.id)}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </TooltipButton>
                )}
            </Stack>
            {place.notes && (
                <div className="text-muted small mt-1 ms-4">{place.notes}</div>
            )}
        </ListGroup.Item>
    );
};

export const TripDayCard = ({
    day,
    isOwner,
    onDeleteDay,
    onOpenDateModal,
    onAddPlace,
    onDeletePlace,
    onReorderPlaces,
}) => {
    const [showMap, setShowMap] = useState(false);
    const [localPlaces, setLocalPlaces] = useState(
        [...(day.places ?? [])].sort((a, b) => a.order - b.order),
    );

    useEffect(() => {
        setLocalPlaces(
            [...(day.places ?? [])].sort((a, b) => a.order - b.order),
        );
    }, [day.places]);

    const hasPlacesWithCoords = localPlaces.some(
        (p) => p.latitude && p.longitude,
    );

    const handleMovePlace = (fromIndex, toIndex) => {
        setLocalPlaces((prev) => {
            const next = [...prev];
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            return next;
        });
    };

    const handleDropEnd = () => {
        const reordered = localPlaces.map((p, i) => ({ ...p, order: i }));
        setLocalPlaces(reordered);
        onReorderPlaces?.(day.id, reordered);
    };

    return (
        <>
            <Card className="shadow-sm border-1 h-100 d-flex flex-column">
                <Card.Header className="d-flex align-items-center gap-2">
                    <i className="fa-solid fa-calendar-day text-primary"></i>
                    <span className="fw-bold flex-grow-1">
                        {day.title || `Día ${day.day_number}`}
                    </span>
                    {day.date && (
                        <div className="ms-auto">
                            <Badge bg="light" text="dark" className="small">
                                <i className="fa-solid fa-calendar me-1"></i>
                                {new Date(
                                    day.date + 'T00:00:00',
                                ).toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                })}
                            </Badge>
                        </div>
                    )}
                </Card.Header>

                <ListGroup variant="flush" className="mt-1 flex-grow-1">
                    {localPlaces.length === 0 ? (
                        <ListGroup.Item className="text-muted small text-center py-3">
                            Sin lugares asignados
                        </ListGroup.Item>
                    ) : (
                        localPlaces.map((place, index) => (
                            <DraggablePlaceItem
                                key={place.id}
                                place={place}
                                index={index}
                                isOwner={isOwner}
                                dayId={day.id}
                                onDeletePlace={onDeletePlace}
                                onMovePlace={handleMovePlace}
                                onDragEnd={handleDropEnd}
                            />
                        ))
                    )}
                </ListGroup>

                <Card.Footer className="d-flex justify-content-end gap-1 bg-transparent border-top border-1 py-2">
                    {hasPlacesWithCoords && (
                        <TooltipButton
                            variant="outline-success"
                            size="sm"
                            tooltip="Ver ruta del día"
                            onClick={() => setShowMap(true)}
                        >
                            <i className="fa-solid fa-route"></i>
                        </TooltipButton>
                    )}
                    {isOwner && (
                        <>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="w-100"
                                onClick={() => onAddPlace(day.id)}
                            >
                                <i className="fa-solid fa-heart me-1"></i>{' '}
                                Añadir desde favoritos
                            </Button>
                            <TooltipButton
                                variant="outline-secondary"
                                size="sm"
                                tooltip="Asignar fecha"
                                onClick={() => onOpenDateModal(day)}
                            >
                                <i
                                    className={`fa-solid ${day.date ? 'fa-calendar-check' : 'fa-calendar-plus'}`}
                                ></i>
                            </TooltipButton>
                            <TooltipButton
                                variant="outline-danger"
                                size="sm"
                                tooltip="Eliminar día"
                                onClick={() => onDeleteDay(day.id)}
                            >
                                <i className="fa-solid fa-trash"></i>
                            </TooltipButton>
                        </>
                    )}
                </Card.Footer>
            </Card>

            <ModalTripDayMap
                show={showMap}
                onHide={() => setShowMap(false)}
                day={{ ...day, places: localPlaces }}
            />
        </>
    );
};
