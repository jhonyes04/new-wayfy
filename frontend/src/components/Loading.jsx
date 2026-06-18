export const Loading = ({ label }) => {
    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
            <Spinner animation="border" variant="primary" role="status">
                <span className="visually-hidden">{label}</span>
            </Spinner>
        </Container>
    );
}
