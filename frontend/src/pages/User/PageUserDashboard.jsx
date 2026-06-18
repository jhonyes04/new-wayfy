import React, { useState } from 'react';
import { Container, Row, Col, Nav, Button, Offcanvas, Card, ProgressBar } from 'react-bootstrap';
import { UserAvatar } from '../../modules/UserDashboard/components/UserAvatar'
import useTooltip, { } from '../../hooks/useTooltip'
import { useAuth } from '../../context/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SidebarContent } from '../../modules/UserDashboard/components/SidebarContent';
import { PageUserProfile } from './PageUserProfile';

export const PageUserDashboard = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const { logout, user } = useAuth()
    const navigate = useNavigate()

    const tooltipRef = useTooltip({
        title: 'Cerrar sesión',
        placement: 'bottom',
        trigger: 'hover'
    })

    const menuItems = [
        { id: 'dashboard', label: 'Inicio', iconClass: 'fa-chart-pie' },
        { id: 'profile', label: 'Mi Perfil', iconClass: 'fa-user' },
        { id: 'trips', label: 'Mis viajes', iconClass: 'fa-route' },
        { id: 'favorites', label: 'Favoritos', iconClass: 'fa-heart' },
    ];

    const handle_logout = () => {
        logout()
        navigate('/')
    }

    return (
        <div className="d-flex vw-100 overflow-hidden bg-light">
            {/* IZQUIERDA */}
            <aside className="d-none d-lg-block border-end border-light" style={{ width: '260px', minWidth: '260px' }}>
                <SidebarContent
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    setShowMobileMenu={setShowMobileMenu}
                    menuItems={menuItems}
                    handle_logout={handle_logout}
                    tooltipRef={tooltipRef}
                />
            </aside>

            <Offcanvas show={showMobileMenu} onHide={() => setShowMobileMenu(false)} className="p-0" style={{ width: '260px' }}>
                <Offcanvas.Body className="p-0">
                    <SidebarContent
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setShowMobileMenu={setShowMobileMenu}
                        menuItems={menuItems}
                        handle_logout={handle_logout}
                        tooltipRef={tooltipRef}
                    />
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
                            <PageUserProfile />
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