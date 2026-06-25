import { useRef } from 'react';
import { Button, Stack } from 'react-bootstrap';

export const TripCoverImage = ({ trip, isOwner, onUpload, onDelete }) => {
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) onUpload(file);
        e.target.value = '';
    };

    return (
        <div className="mb-3">
            {trip.cover_image ? (
                <div className="position-relative">
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${trip.cover_image}`}
                        alt={trip.title}
                        className="w-100 rounded-3 shadow-sm"
                        style={{ height: '200px', objectFit: 'cover' }}
                    />
                    {isOwner && (
                        <Stack
                            direction="horizontal"
                            gap={2}
                            className="position-absolute top-0 end-0 p-2"
                        >
                            <Button
                                size="sm"
                                variant="danger"
                                onClick={onDelete}
                                title="Eliminar imagen"
                            >
                                <i className="fa-solid fa-trash"></i>
                            </Button>
                        </Stack>
                    )}
                </div>
            ) : (
                isOwner && (
                    <div
                        className="rounded-3 border border-2 border-dashed d-flex flex-column align-items-center justify-content-center text-muted"
                        style={{ height: '140px', cursor: 'pointer' }}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <i className="fa-solid fa-image fa-2x mb-2 opacity-50"></i>
                        <span className="small">Añadir imagen de portada</span>
                    </div>
                )
            )}
            <input
                type="file"
                ref={fileInputRef}
                className="d-none"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleChange}
            />
        </div>
    );
};
