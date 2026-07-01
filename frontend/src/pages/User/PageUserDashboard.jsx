import React, { useState } from 'react';
import {
    Container,
    Row,
    Col,
    Nav,
    Button,
    Offcanvas,
    Card,
    ProgressBar,
} from 'react-bootstrap';
import { UserAvatar } from '../../modules/UserDashboard/components/UserAvatar';
import { useAuth } from '../../context/auth/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SidebarContent } from '../../modules/UserDashboard/components/SidebarContent';
import PageUserHome from './PageUserHome';
import PageUserProfile from './PageUserProfile';
import PageUserFavorites from './PageUserFavorites';
import PageUserTrips from './PageUserTrips';
import { TripDetail } from '../../modules/Trips/components/TripDetail';

const PageUserDashboard = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'dashboard';
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const setActiveTab = (tab) => {
        setSearchParams({ tab });
        setShowMobileMenu(false);
    };

    const menuItems = [
        { id: 'dashboard', label: 'Resumen', iconClass: 'fa-chart-pie' },
        { id: 'trips', label: 'Mis viajes', iconClass: 'fa-map' },
        { id: 'favorites', label: 'Favoritos', iconClass: 'fa-heart' },
        { id: 'profile', label: 'Mi Perfil', iconClass: 'fa-user' },
    ];

    return (
        <div className="d-flex vw-100 overflow-hidden bg-light">
            <aside
                className="d-none d-lg-block border-end border-light"
                style={{ width: '260px', minWidth: '260px' }}
            >
                <SidebarContent
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    setShowMobileMenu={setShowMobileMenu}
                    menuItems={menuItems}
                />
            </aside>

            <Offcanvas
                show={showMobileMenu}
                onHide={() => setShowMobileMenu(false)}
                className="p-0"
                style={{ width: '260px' }}
            >
                <Offcanvas.Body className="p-0">
                    <SidebarContent
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setShowMobileMenu={setShowMobileMenu}
                        menuItems={menuItems}
                    />
                </Offcanvas.Body>
            </Offcanvas>

            <div className="d-flex flex-column flex-grow-1 overflow-hidden">
                <header
                    className="d-block d-lg-none d-flex align-items-center justify-content-between bg-white border-bottom border-light px-4"
                    style={{ height: '64px', minHeight: '64px' }}
                >
                    <div className="d-flex align-items-center gap-3">
                        <Button
                            variant="light"
                            onClick={() => setShowMobileMenu(true)}
                            className="d-lg-none p-1 border-0 bg-transparent text-secondary"
                        >
                            <i className="fa-solid fa-bars fs-4"></i>
                        </Button>
                    </div>
                </header>

                <main className="flex-grow-1 overflow-auto p-4">
                    <Container fluid="xl" className="mx-auto p-0">
                        {activeTab === 'dashboard' && <PageUserHome />}
                        {activeTab === 'favorites' && <PageUserFavorites />}
                        {activeTab === 'trips' && <PageUserTrips />}
                        {activeTab === 'trip-detail' && (
                            <TripDetail
                                tripId={Number(searchParams.get('tripId'))}
                            />
                        )}
                        {activeTab === 'profile' && <PageUserProfile />}

                        {![
                            'dashboard',
                            'profile',
                            'favorites',
                            'trips',
                            'trip-detail',
                        ].includes(activeTab) && (
                            <div
                                className="d-flex align-items-center justify-content-center border border-2 border-dashed text-muted"
                                style={{
                                    height: '300px',
                                    borderRadius: '16px',
                                }}
                            >
                                Sección {activeTab} en desarrollo.
                            </div>
                        )}
                    </Container>
                </main>
            </div>
        </div>
    );
};

export default PageUserDashboard;
