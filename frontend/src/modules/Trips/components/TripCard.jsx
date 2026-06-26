import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button, Stack } from 'react-bootstrap';
import { useAuth } from '../../../context/auth/AuthContext';
import { TooltipButton } from '../../../components/TooltipButton';

export const TripCard = ({
    trip,
    onEdit,
    onDelete,
    showForkButton = false,
    onFork,
    publicView = false,
    alreadyForked = false,
}) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isOwner = String(user?.id) === String(trip.user_id);

    return (
        <Card className="shadow-sm border-1 h-100">
            <div className="position-relative">
                {trip.cover_image ? (
                    <Card.Img
                        variant="top"
                        src={`${import.meta.env.VITE_BACKEND_URL}${trip.cover_image}`}
                        className="rounded-top-3 overflow-hidden object-fit-cover position-relative"
                        style={{
                            height: '160px',
                        }}
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
                {user && trip.original_trip_id && (
                    <Badge
                        bg="danger"
                        text="light"
                        className="position-absolute"
                        style={{ bottom: '10px', right: '10px' }}
                    >
                        <i className="fa-solid fa-code-fork me-1"></i>
                        Copiado
                    </Badge>
                )}
            </div>

            <Card.Body className="d-flex flex-column">
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

                <Stack direction="horizontal" gap={2} className="mt-auto">
                    <Badge bg="light" text="dark">
                        <i className="fa-solid fa-calendar-days me-1"></i>
                        {trip.total_days}{' '}
                        {trip.total_days === 1 ? 'día' : 'días'}
                    </Badge>
                    {/* {user && trip.original_trip_id && (
                        <Badge bg="info" text="dark" className="ms-auto">
                            <i className="fa-solid fa-code-fork me-1"></i>
                            Copiado
                        </Badge>
                    )} */}
                </Stack>
                <Badge
                    bg="primary"
                    className="d-flex justify-content-between w-100 mt-2"
                    style={{ fontSize: '0.7rem', opacity: 0.7 }}
                >
                    <div>
                        <i className="fa-solid fa-user me-1"></i>
                        {trip?.author.firstname} {trip?.author.lastname}
                    </div>
                    <div className="ms-auto">
                        <i className="fa-regular fa-clock me-1"></i>
                        {new Date(trip.updated_at).toLocaleDateString('es-ES')}
                    </div>
                </Badge>
            </Card.Body>

            <Card.Footer className="bg-transparent border-top border-1">
                <Stack direction="horizontal" gap={1}>
                    {publicView && isOwner ? (
                        <TooltipButton
                            variant="outline-warning"
                            size="sm"
                            tooltip="Editar viaje"
                            onClick={() =>
                                navigate(
                                    `/user-dashboard?tab=trip-detail&tripId=${trip.id}`,
                                )
                            }
                        >
                            <i className="fa-solid fa-pen"></i>
                        </TooltipButton>
                    ) : (
                        <TooltipButton
                            variant="outline-primary"
                            size="sm"
                            tooltip="Ver viaje"
                            onClick={() =>
                                navigate(
                                    publicView
                                        ? `/trips/public/${trip.id}`
                                        : `/user-dashboard?tab=trip-detail&tripId=${trip.id}`,
                                )
                            }
                        >
                            <i className="fa-solid fa-eye"></i>
                        </TooltipButton>
                    )}
                    {!showForkButton && (
                        <div className="ms-auto d-flex gap-1">
                            <TooltipButton
                                variant="outline-warning"
                                size="sm"
                                tooltip="Editar"
                                onClick={() => onEdit(trip)}
                            >
                                <i className="fa-solid fa-pen"></i>
                            </TooltipButton>
                            <TooltipButton
                                variant="outline-danger"
                                size="sm"
                                tooltip="Eliminar"
                                onClick={() => onDelete(trip.id)}
                            >
                                <i className="fa-solid fa-trash"></i>
                            </TooltipButton>
                        </div>
                    )}
                    {showForkButton && !isOwner && user && (
                        <Button
                            variant={
                                alreadyForked ? 'outline-secondary' : 'success'
                            }
                            size="sm"
                            className="ms-auto"
                            disabled={alreadyForked}
                            onClick={() => !alreadyForked && onFork(trip.id)}
                        >
                            <i className="fa-solid fa-code-fork me-1"></i>
                            {alreadyForked ? 'Ya copiado' : 'Copiar'}
                        </Button>
                    )}
                </Stack>
            </Card.Footer>
        </Card>
    );
};
