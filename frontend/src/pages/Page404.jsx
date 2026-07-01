import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const Page404 = () => {
    return (
        <Container
            className="d-flex flex-column align-items-center justify-content-center text-center py-5"
            style={{ minHeight: '70vh' }}
        >
            <div className="mb-4" style={{ fontSize: '6rem', lineHeight: 1 }}>
                <i className="fa-solid fa-map-location-dot text-primary"></i>
            </div>

            <h1 className="display-1 fw-bold text-primary mb-0">404</h1>
            <h2 className="fw-semibold text-secondary mb-3">
                Página no encontrada
            </h2>

            <p
                className="lead text-secondary mb-4"
                style={{ maxWidth: '480px' }}
            >
                Parece que esta ruta no está en el mapa. Es posible que la
                dirección sea incorrecta o que la página haya sido eliminada.
            </p>

            <div className="d-flex flex-column flex-sm-row gap-3">
                <Button
                    as={Link}
                    to="/"
                    variant="outline-primary"
                    size="lg"
                    className="px-4"
                >
                    <i className="fa-solid fa-house me-2"></i>
                    Volver al inicio
                </Button>
            </div>
        </Container>
    );
};

export default Page404;
