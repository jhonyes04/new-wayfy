import { Card } from 'react-bootstrap';

export const ModalForms = ({ children }) => {
    return (
        <Card className="col-11 col-sm-8 col-md-6 col-lg-4 modal-dark scroll-dark">
            {children}
        </Card>
    );
};
