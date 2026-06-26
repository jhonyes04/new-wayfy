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
            <Card.Body className="text-center p-4">
                <i className={`${icon} text-${variant} fa-3x`}></i>

                <div>
                    <h4 className="text-primary">{label}</h4>
                    {loading ? (
                        <Spinner
                            animation="border"
                            size="sm"
                            variant={variant}
                        />
                    ) : (
                        <Badge bg="dark" pill className="fs-2 fw-bold">
                            {count}
                        </Badge>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};
