import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth/AuthContext';
import { Container, Spinner } from 'react-bootstrap';

export const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (!user) return <Navigate to="/login" replace />;
    if (!user.is_admin) return <Navigate to="/" replace />;

    return <Outlet />;
};
