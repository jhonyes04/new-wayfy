import { useRef } from 'react';
import { Button, Col, Image, Badge } from 'react-bootstrap';

export const AvatarSection = ({ avatarPreview, user, handleAvatarChange }) => {
    const fileInputRef = useRef(null);

    return (
        <Col
            xs={12}
            lg={4}
            className="d-flex flex-column align-items-center text-center border-end-lg border-light pe-lg-4 justify-content-start pt-3"
        >
            <div className="position-relative d-inline-block mb-3">
                <Image
                    src={avatarPreview}
                    roundedCircle
                    className="shadow border border-5 border-success objectFit"
                    width={150}
                    height={150}
                />

                <Button
                    variant="primary"
                    size="sm"
                    className="position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center rounded-circle p-2 shadow"
                    onClick={() => fileInputRef.current.click()}
                    type="button"
                >
                    <i className="fa-solid fa-camera text-white"></i>
                </Button>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="d-none"
                    accept=".jpg, .jpeg, .png, .webp"
                    onChange={handleAvatarChange}
                />
            </div>
            <p className="text-muted small mb-4">
                Gestiona tus datos de acceso y preferencias de movilidad desde
                un solo lugar.
            </p>

            <div className="d-flex gap-2">
                <Badge
                    bg={user?.is_active ? 'success' : 'danger'}
                    className="w-100"
                >
                    {user?.is_active ? 'Cuenta activa' : 'Cuenta desactivada'}
                </Badge>
                <Badge bg={user?.is_admin ? 'dark' : 'primary'}>
                    <i
                        className={`fa-solid ${user?.is_admin ? 'fa-user-shield' : 'fa-user'} me-2`}
                    ></i>
                    {user?.is_admin ? 'Administrador' : 'Usuario'}
                </Badge>
            </div>
        </Col>
    );
};
