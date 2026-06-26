import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button, Stack } from 'react-bootstrap';

export const TripCard = ({
    trip,
    onEdit,
    onDelete,
    showForkButton = false,
    onFork,
}) => {
    const navigate = useNavigate();

    return (
        <Card className="shadow-sm border-0 h-100">
            {trip.cover_image ? (
                <Card.Img
                    variant="top"
                    src={`${import.meta.env.VITE_BACKEND_URL}${trip.cover_image}`}
                    style={{ height: '160px', objectFit: 'cover' }}
                    alt={trip.title}
                />
            ) : (
                <div
                    className="d-flex align-items-center justify-content-center bg-light text-muted"
                    style={{ height: '80px' }}
                >
                    <i className="fa-solid fa-route fa-2x opacity-25"></i>
                </div>
            )}

            <Card.Body>
                <Stack direction="horizontal" gap={2} className="mb-2">
                    <Card.Title className="mb-0 text-truncate flex-grow-1">
                        <h4 className="text-primary">{trip.title}</h4>
                    </Card.Title>
                    <Badge bg={trip.is_public ? 'success' : 'secondary'} pill>
                        <i
                            className={`fa-solid ${trip.is_public ? 'fa-globe' : 'fa-lock'} me-1`}
                        ></i>
                        {trip.is_public ? 'Público' : 'Privado'}
                    </Badge>
                </Stack>

                {trip.description && (
                    <Card.Text
                        className="text-muted small"
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 5,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {trip.description}
                    </Card.Text>
                )}

                <Stack direction="horizontal" gap={2}>
                    <Badge bg="light" text="dark">
                        <i className="fa-solid fa-calendar-days me-1"></i>
                        {trip.total_days}{' '}
                        {trip.total_days === 1 ? 'día' : 'días'}
                    </Badge>
                    {trip.original_trip_id && (
                        <Badge bg="info" text="dark">
                            <i className="fa-solid fa-code-fork me-1"></i>
                            Copiado
                        </Badge>
                    )}
                </Stack>
            </Card.Body>

            <Card.Footer className="bg-transparent border-top border-1">
                <Stack direction="horizontal" gap={1}>
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                            navigate(
                                `/user-dashboard?tab=trip-detail&tripId=${trip.id}`,
                            )
                        }
                    >
                        <i className="fa-solid fa-eye"></i>
                    </Button>
                    {!showForkButton && (
                        <div className="ms-auto d-flex gap-1">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => onEdit(trip)}
                            >
                                <i className="fa-solid fa-pen"></i>
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => onDelete(trip.id)}
                            >
                                <i className="fa-solid fa-trash"></i>
                            </Button>
                        </div>
                    )}
                    {showForkButton && (
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => onFork(trip.id)}
                        >
                            <i className="fa-solid fa-code-fork me-1"></i>{' '}
                            Copiar
                        </Button>
                    )}
                </Stack>
            </Card.Footer>
        </Card>
    );
};
