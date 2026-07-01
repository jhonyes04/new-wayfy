import { Link } from 'react-router-dom';
import imgLight from '../assets/img/portada.png';
import { Button, Col, Container, Row } from 'react-bootstrap';

const PageHome = () => {
    return (
        <div className="w-100 bg-transparent">
            <main className="my-3">
                <Container>
                    <div className="d-flex align-items-center gap-4">
                        <h1 className="display-3 fw-bold text-gray">
                            Tu viaje
                        </h1>
                        <h4 className="display-5 text-primary">sin barreras</h4>
                    </div>
                    <Row className="align-items-center g-5">
                        <Col lg={6} className="text-center text-lg-start">
                            <p className="lead text-secondary">
                                Centralizamos rutas y alojamiento validados por
                                la comunidad. Planifica tu próxima aventura con
                                la confianza de contar con datos reales sobre
                                accesibilidad.
                            </p>

                            <div className="d-flex flex-column flex-md-row row-cols-1 row-cols-md-3 text-center gap-2 my-4">
                                <div className="d-flex flex-column align-items-center card-surface p-3 rounded-3 shadow-sm border">
                                    <div className="fs-3">
                                        <i className="fa-solid fa-shield-halved text-primary mb-3"></i>
                                    </div>
                                    <div>
                                        <h5 className="mb-1">
                                            Validación Real
                                        </h5>
                                        <p className="text-muted mb-0">
                                            Verificados por personas con
                                            movilidad reducida.
                                        </p>
                                    </div>
                                </div>
                                <div className="d-flex flex-column align-items-center card-surface p-3 rounded-3 shadow-sm border">
                                    <div className="fs-3">
                                        <i className="fa-solid fa-user text-primary mb-3"></i>
                                    </div>
                                    <div>
                                        <h5 className="mb-1">
                                            Inteligencia Colectiva
                                        </h5>
                                        <p className="text-muted mb-0">
                                            Comparte rutas y consejos útiles en
                                            tiempo real.
                                        </p>
                                    </div>
                                </div>
                                <div className="d-flex flex-column align-items-center card-surface p-3 rounded-3 shadow-sm border">
                                    <div className="fs-3">
                                        <i className="fa-solid fa-wheelchair-move text-primary mb-3"></i>
                                    </div>
                                    <div>
                                        <h5 className="mb-1">Control Total</h5>
                                        <p className="text-muted mb-0">
                                            Asegura tu independencia en cada
                                            viaje.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 text-center w-100">
                                <Button
                                    as={Link}
                                    to="/map"
                                    variant="primary"
                                    size="lg"
                                    className="px-5 py-3 rounded-pill fw-bold shadow"
                                >
                                    Empezar a explorar
                                </Button>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="position-relative p-2 card-surface rounded-4 shadow border">
                                <img
                                    src={imgLight}
                                    alt="Mapa conceptual de rutas accesibles"
                                    className="img-fluid rounded-3"
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </main>
        </div>
    );
};

export default PageHome;
