import urlLogoLight from '../assets/img/logo2.png';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { ButtonMenu } from './ButtonMenu';
import { UserAvatar } from '../modules/UserDashboard/components/UserAvatar';
import { useAuth } from '../context/auth/AuthContext';

const menuElements = [
    { link: '/', label: 'Home', icon: 'fa-home' },
    { link: '/map', label: 'Mapa', icon: 'fa-location-dot' },
    { link: '/trips/public', label: 'Viajes de la comunidad', icon: 'fa-map' },
    { link: '/hotels', label: 'Hoteles', icon: 'fa-hotel' },
    { link: '/restaurants', label: 'Restaurantes', icon: 'fa-utensils' },
    { link: '/transports', label: 'Transportes', icon: 'fa-bus' },
    { link: '/entertainment', label: 'Entretenimiento', icon: 'fa-star' },
];

export const Navbar = () => {
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg bg-dark border-0">
            <div className="container-fluid container-lg">
                <Link to={'/'} className="navbar-brand me-2">
                    <img
                        src={urlLogoLight}
                        alt="logo"
                        width={100}
                        className="img-fluid"
                    />
                </Link>

                <button
                    type="button"
                    className="navbar-toggler border-0 order-2 ms-2"
                    onClick={() => setMostrarMenu(!mostrarMenu)}
                    aria-expanded={mostrarMenu}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="d-flex align-items-center gap-2 gap-sm-3 ms-auto order-1 order-lg-3">
                    {user ? (
                        <Dropdown align="end">
                            <Dropdown.Toggle
                                as="div"
                                style={{ cursor: 'pointer' }}
                                bsPrefix="dropdown-toggle-custom"
                            >
                                <UserAvatar textColor="light" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu
                                variant="dark"
                                className="bg-dark mt-2"
                            >
                                <Dropdown.Item
                                    as={Link}
                                    to="/user-dashboard"
                                    className="fw-bold"
                                >
                                    <i className="fa-solid fa-gauge me-2"></i>
                                    Mi panel
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                    onClick={handleLogout}
                                    className="text-danger fw-bold"
                                >
                                    <i className="fa-solid fa-right-from-bracket me-2"></i>
                                    Cerrar sesión
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <Link
                            to="/login"
                            className="btn btn-secondary btn-circle"
                        >
                            <i className="fa-regular fa-user"></i>
                        </Link>
                    )}
                </div>

                <div
                    className={`collapse navbar-collapse order-3 order-lg-2 ${mostrarMenu ? 'show' : ''}`}
                    id="navbarContent"
                >
                    <div className="navbar-nav flex-row flex-wrap justify-content-center mx-auto gap-2 gap-lg-4 mt-3 mt-lg-0">
                        {menuElements.map((element, index) => (
                            <ButtonMenu
                                link={element.link}
                                label={element.label}
                                icon={element.icon}
                                key={index}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};
