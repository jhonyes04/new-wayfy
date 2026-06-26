import { Badge, Button, Card, ListGroup, Stack } from 'react-bootstrap';
import { TooltipButton } from '../../../components/TooltipButton';
import { getCategoryStyle } from '../../AccessibilityMap/utils/translations/OSM_TRANSLATIONS';

export const TripDayCard = ({
    day,
    isOwner,
    onDeleteDay,
    onOpenDateModal,
    onAddPlace,
    onDeletePlace,
}) => (
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
        </Card.Header>

        <ListGroup variant="flush" className="mt-1 flex-grow-1">
            {!day.places || day.places.length === 0 ? (
                <ListGroup.Item className="text-muted small text-center py-3">
                    Sin lugares asignados
                </ListGroup.Item>
            ) : (
                day.places.map((place) => {
                    const { icon, color } = getCategoryStyle(place.sub_type);

                    return (
                        <ListGroup.Item key={place.id} className="py-2 px-3">
                            <Stack direction="horizontal" gap={2}>
                                <i
                                    className={`fa-solid ${icon}`}
                                    style={{ color }}
                                ></i>
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
                                        {place.visit_time_end &&
                                            ` - ${place.visit_time_end}`}
                                    </Badge>
                                )}
                                {isOwner && (
                                    <TooltipButton
                                        variant="outline-danger"
                                        size="sm"
                                        className="border-0"
                                        tooltip="Eliminar lugar"
                                        onClick={() =>
                                            onDeletePlace(day.id, place.id)
                                        }
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </TooltipButton>
                                )}
                            </Stack>
                            {place.notes && (
                                <div className="text-muted small mt-1 ms-4">
                                    {place.notes}
                                </div>
                            )}
                        </ListGroup.Item>
                    );
                })
            )}
        </ListGroup>

        {isOwner && (
            <Card.Footer className="d-flex justify-content-end gap-1 bg-transparent border-top border-1 py-2">
                <Button
                    variant="outline-primary"
                    size="sm"
                    className="w-100"
                    onClick={() => onAddPlace(day.id)}
                >
                    <i className="fa-solid fa-heart me-1"></i> Añadir desde
                    favoritos
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
                {isOwner && (
                    <TooltipButton
                        variant="outline-danger"
                        size="sm"
                        tooltip="Eliminar día"
                        onClick={() => onDeleteDay(day.id)}
                    >
                        <i className="fa-solid fa-trash"></i>
                    </TooltipButton>
                )}
            </Card.Footer>
        )}
    </Card>
);
