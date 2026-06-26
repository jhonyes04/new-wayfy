import { Card, Spinner, Badge } from 'react-bootstrap';

export const StatCard = ({
    icon,
    label,
    count,
    loading,
    variant = 'primary',
}) => {
    return (
        <Card className="shadow-sm h-100 border-start border-1">
            <Card.Body className="text-center p-4 d-flex flex-column h-100">
                <i className={`${icon} text-${variant} fa-3x`}></i>

                <div className="d-flex flex-column flex-grow-1">
                    <h4 className="text-primary">{label}</h4>
                    <div className="mt-auto">
                        {loading ? (
                            <Spinner
                                animation="border"
                                size="sm"
                                variant={variant}
                            />
                        ) : (
                            <div className="border border-2 border-dark rounded-pill bg-light fs-2 fw-bold">
                                {count}
                            </div>
                        )}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};
