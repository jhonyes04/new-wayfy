import { Badge, Button, Card, ListGroup, Stack } from 'react-bootstrap';

export const TripDayCard = ({
    day,
    isOwner,
    onDeleteDay,
    onOpenDateModal,
    onAddPlace,
    onDeletePlace,
}) => (
    <Card className="shadow-sm border-0 h-100">
        <Card.Header className="d-flex align-items-center gap-2">
            <i className="fa-solid fa-calendar-day text-primary"></i>
            <span className="fw-bold flex-grow-1">
                {day.title || `Día ${day.day_number}`}
            </span>
            <Button
                variant="outline-secondary"
                size="sm"
                title="Asignar fecha"
                onClick={() => onOpenDateModal(day)}
            >
                <i
                    className={`fa-solid ${day.date ? 'fa-calendar-check' : 'fa-calendar-plus'}`}
                ></i>
            </Button>
            {isOwner && (
                <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDeleteDay(day.id)}
                >
                    <i className="fa-solid fa-trash"></i>
                </Button>
            )}
        </Card.Header>

        {day.date && (
            <div className="px-3 pt-2">
                <Badge bg="light" text="dark" className="small">
                    <i className="fa-solid fa-calendar me-1"></i>
                    {new Date(day.date + 'T00:00:00').toLocaleDateString(
                        'es-ES',
                        {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                        },
                    )}
                </Badge>
            </div>
        )}

        <ListGroup variant="flush" className="mt-1">
            {!day.places || day.places.length === 0 ? (
                <ListGroup.Item className="text-muted small text-center py-3">
                    Sin lugares asignados
                </ListGroup.Item>
            ) : (
                day.places.map((place) => (
                    <ListGroup.Item key={place.id} className="py-2 px-3">
                        <Stack direction="horizontal" gap={2}>
                            <i className="fa-solid fa-location-dot text-danger"></i>
                            <span className="flex-grow-1 small fw-semibold text-truncate">
                                {place.place_name}
                            </span>
                            {place.visit_time && (
                                <Badge bg="light" text="dark" className="small">
                                    <i className="fa-solid fa-clock me-1"></i>
                                    {place.visit_time}
                                    {place.visit_time_end &&
                                        ` - ${place.visit_time_end}`}
                                </Badge>
                            )}
                            {isOwner && (
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() =>
                                        onDeletePlace(day.id, place.id)
                                    }
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </Button>
                            )}
                        </Stack>
                        {place.notes && (
                            <div className="text-muted small mt-1 ms-4">
                                {place.notes}
                            </div>
                        )}
                    </ListGroup.Item>
                ))
            )}
        </ListGroup>

        {isOwner && (
            <Card.Footer className="bg-transparent border-0 pt-0 pb-2">
                <Button
                    variant="outline-primary"
                    size="sm"
                    className="w-100"
                    onClick={() => onAddPlace(day.id)}
                >
                    <i className="fa-solid fa-heart me-1"></i> Añadir desde
                    favoritos
                </Button>
            </Card.Footer>
        )}
    </Card>
);
