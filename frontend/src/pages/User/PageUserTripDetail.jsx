import { useParams } from 'react-router-dom';
import { TripDetail } from '../../modules/Trips/components/TripDetail';

export const PageUserTripDetail = () => {
    const { tripId } = useParams();
    return (
        <div className="container py-4">
            <TripDetail tripId={Number(tripId)} />
        </div>
    );
};
