import React, { useState } from 'react';
import { Container, Row, Col, Nav, Button, Offcanvas, Card, ProgressBar } from 'react-bootstrap';
import { UserAvatar } from '../../modules/UserDashboard/components/UserAvatar'
import useTooltip, { } from '../../hooks/useTooltip'

export const PageUserDashboard = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');

    const tooltipRef = useTooltip({
        title: 'Cerrar sesión',
        placement: 'bottom',
        trigger: 'hover'
    })

    const user = {
        name: "Carlos Mendoza",
        email: "carlos.m@empresa.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
        plan: "Usuario Premium"
    };

    // Mapeo de ítems con clases CSS de FontAwesome v6
    const menuItems = [
        { id: 'dashboard', label: 'Inicio', iconClass: 'fa-chart-pie' },
        { id: 'profile', label: 'Mi Perfil', iconClass: 'fa-user' },
        { id: 'trips', label: 'Mis viajes', iconClass: 'fa-route' },
        { id: 'favorites', label: 'Favoritos', iconClass: 'fa-heart' },
    ];

    const SidebarContent = () => (
        <div className="d-flex flex-column h-100 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <UserAvatar />

                <i ref={tooltipRef} className="fa-solid fa-right-from-bracket fs-4 text-danger" style={{ cursor: 'pointer' }}></i>
            </div>

            <Nav className="flex-column flex-grow-1 gap-1">
                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <Button
                            key={item.id}
                            variant={isActive ? 'success' : 'light'}
                            onClick={() => { setActiveTab(item.id); setShowMobileMenu(false); }}
                            className={`d-flex align-items-center gap-3 w-100 text-start border-0 px-3 py-2 ${isActive ? '' : 'text-dark bg-transparent'}`}
                            style={{ borderRadius: '10px' }}
                        >
                            <i className={`fa-solid ${item.iconClass} fa-fw fs-5`}></i>
                            <span className="small fw-medium">{item.label}</span>
                        </Button>
                    );
                })}
            </Nav>
        </div>
    );

    return (
        <div className="d-flex vw-100 overflow-hidden bg-light">
            {/* IZQUIERDA */}
            <aside className="d-none d-lg-block border-end border-light" style={{ width: '260px', minWidth: '260px' }}>
                <SidebarContent />
            </aside>

            <Offcanvas show={showMobileMenu} onHide={() => setShowMobileMenu(false)} className="p-0" style={{ width: '260px' }}>
                <Offcanvas.Body className="p-0">
                    <SidebarContent />
                </Offcanvas.Body>
            </Offcanvas>

            {/* DERECHA */}
            <div className="d-flex flex-column flex-grow-1 overflow-hidden">
                <header className="d-block d-lg-none d-flex align-items-center justify-content-between bg-white border-bottom border-light px-4" style={{ height: '64px', minHeight: '64px' }}>
                    <div className="d-flex align-items-center gap-3">
                        <Button variant="light" onClick={() => setShowMobileMenu(true)} className="d-lg-none p-1 border-0 bg-transparent text-secondary">
                            <i className="fa-solid fa-bars fs-4"></i>
                        </Button>
                    </div>
                </header>

                <main className="flex-grow-1 overflow-auto p-4">
                    <Container fluid="xl" className="mx-auto p-0">
                        {activeTab === 'dashboard' && (
                            <Row className="g-4">
                                <Col xs={12} sm={6} lg={4}>
                                    <Card className="border-light h-100 shadow-sm" style={{ borderRadius: '16px' }}>
                                        <Card.Body className="p-4">
                                            <span className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem', trackingMultiplier: '1.2' }}>Consumo de API</span>
                                            <h3 className="h2 fw-bold text-dark mt-1 mb-3">74.2%</h3>
                                            <ProgressBar now={74.2} variant="primary" style={{ height: '8px', borderRadius: '4px' }} />
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col xs={12} sm={6} lg={4}>
                                    <Card className="border-light h-100 shadow-sm" style={{ borderRadius: '16px' }}>
                                        <Card.Body className="p-4">
                                            <span className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem' }}>Días restantes</span>
                                            <h3 className="h2 fw-bold text-dark mt-1 mb-1">24 Días</h3>
                                            <span className="text-success small fw-medium">Siguiente renovación: 28 Jun</span>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col xs={12} lg={4}>
                                    <Card className="border-light h-100 shadow-sm" style={{ borderRadius: '16px' }}>
                                        <Card.Body className="p-4">
                                            <span className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem' }}>Soporte Activo</span>
                                            <h3 className="h2 fw-bold text-dark mt-1 mb-1">0 Tickets</h3>
                                            <span className="text-muted small">No requieres atención inmediata.</span>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        )}

                        {activeTab === 'profile' && (
                            <Card className="border-light shadow-sm" style={{ borderRadius: '16px' }}>
                                <Card.Body className="p-4">
                                    <h3 className="h5 fw-bold text-dark border-bottom pb-3 mb-3">Información de la Cuenta</h3>
                                    <p className="text-secondary small mb-2"><strong>Nombre Completo:</strong> {user.name}</p>
                                    <p className="text-secondary small mb-0"><strong>Email:</strong> {user.email}</p>
                                </Card.Body>
                            </Card>
                        )}

                        {!['dashboard', 'profile'].includes(activeTab) && (
                            <div className="d-flex align-items-center justify-content-center border border-2 border-dashed text-muted" style={{ height: '300px', borderRadius: '16px' }}>
                                Sección {activeTab} en desarrollo.
                            </div>
                        )}

                    </Container>
                </main>
            </div>
        </div>
    );
}