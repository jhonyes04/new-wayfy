import { useEffect, useRef, useState } from 'react';
import { Modal, Form, Button, Stack } from 'react-bootstrap';

export const TripFormModal = ({
    show,
    onHide,
    onSubmit,
    initialData = null,
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [deleteExistingCover, setDeleteExistingCover] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setIsPublic(initialData.is_public || false);
            setCoverPreview(
                initialData.cover_image
                    ? `${import.meta.env.VITE_BACKEND_URL}${initialData.cover_image}`
                    : null,
            );
        } else {
            setTitle('');
            setDescription('');
            setIsPublic(false);
            setCoverPreview(null);
        }
        setCoverFile(null);
        setDeleteExistingCover(false);
    }, [initialData, show]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
        setDeleteExistingCover(false);
        e.target.value = '';
    };

    const handleRemoveCover = () => {
        setCoverFile(null);
        setCoverPreview(null);
        if (initialData?.cover_image) setDeleteExistingCover(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit(
            { title: title.trim(), description: description.trim(), is_public: isPublic },
            coverFile,
            deleteExistingCover,
        );
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="fa-solid fa-route me-2 text-primary"></i>
                    {initialData ? 'Editar viaje' : 'Nuevo viaje'}
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Nombre del viaje{' '}
                            <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            required
                            placeholder="Ej. Roma en 5 días"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Describe brevemente tu viaje..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Imagen de portada</Form.Label>
                        {coverPreview ? (
                            <div className="position-relative mb-2">
                                <img
                                    src={coverPreview}
                                    alt="Portada"
                                    className="w-100 rounded-3"
                                    style={{ height: '160px', objectFit: 'cover' }}
                                />
                                <Stack
                                    direction="horizontal"
                                    gap={2}
                                    className="position-absolute top-0 end-0 p-2"
                                >
                                    <Button
                                        size="sm"
                                        variant="light"
                                        onClick={() => fileInputRef.current.click()}
                                        title="Cambiar imagen"
                                    >
                                        <i className="fa-solid fa-camera"></i>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={handleRemoveCover}
                                        title="Eliminar imagen"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </Button>
                                </Stack>
                            </div>
                        ) : (
                            <div
                                className="d-flex flex-column align-items-center justify-content-center rounded-3 border border-2 border-dashed text-muted"
                                style={{ height: '120px', cursor: 'pointer' }}
                                onClick={() => fileInputRef.current.click()}
                            >
                                <i className="fa-solid fa-image fa-2x mb-2 opacity-40"></i>
                                <span className="small">Añadir imagen de portada</span>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="d-none"
                            accept=".jpg,.jpeg,.png,.webp"
                            onChange={handleFileChange}
                        />
                    </Form.Group>

                    <Form.Check
                        type="switch"
                        id="is-public-switch"
                        label={
                            <span>
                                <i
                                    className={`fa-solid ${isPublic ? 'fa-globe' : 'fa-lock'} me-2`}
                                ></i>
                                {isPublic
                                    ? 'Viaje público (visible para la comunidad)'
                                    : 'Viaje privado'}
                            </span>
                        }
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={onHide}>
                        Cancelar
                    </Button>
                    <Button
                        variant="success"
                        type="submit"
                        disabled={!title.trim()}
                    >
                        {initialData ? 'Guardar cambios' : 'Crear viaje'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};
