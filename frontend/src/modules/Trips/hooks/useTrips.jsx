import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../context/auth/AuthContext';
import { tripsApi } from '../services/trips.api';
import { toast } from 'react-toastify';

export const useTrips = () => {
    const { token } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMyTrips = useCallback(async () => {
        setLoading(true);
        try {
            const data = await tripsApi.getMyTrips(token);
            setTrips(data.trips || []);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchMyTrips();
    }, [fetchMyTrips]);

    const createTrip = async (formData) => {
        try {
            const data = await tripsApi.createTrip(formData, token);
            setTrips((prev) => [data.trip, ...prev]);
            toast.success('Viaje creado correctamente');
            return data.trip;
        } catch (error) {
            toast.error(error.message);
        }
    };

    const updateTrip = async (tripId, formData) => {
        try {
            const data = await tripsApi.updateTrip(tripId, formData, token);
            setTrips((prev) =>
                prev.map((t) => (t.id === tripId ? data.trip : t)),
            );
            toast.success('Viaje actualizado');
            return data.trip;
        } catch (error) {
            toast.error(error.message);
        }
    };

    const uploadCover = async (tripId, file) => {
        try {
            const data = await tripsApi.updateCover(tripId, file, token);
            setTrips((prev) =>
                prev.map((t) =>
                    t.id === tripId
                        ? { ...t, cover_image: data.trip.cover_image }
                        : t,
                ),
            );
        } catch (error) {
            toast.error('Error al subir la imagen: ' + error.message);
        }
    };

    const removeCover = async (tripId) => {
        try {
            const data = await tripsApi.deleteCover(tripId, token);
            setTrips((prev) =>
                prev.map((t) =>
                    t.id === tripId ? { ...t, cover_image: null } : t,
                ),
            );
        } catch (error) {
            toast.error('Error al eliminar la imagen: ' + error.message);
        }
    };

    const deleteTrip = async (tripId) => {
        try {
            await tripsApi.deleteTrip(tripId, token);
            setTrips((prev) => prev.filter((t) => t.id !== tripId));
            toast.success('Viaje eliminado');
        } catch (error) {
            toast.error(error.message);
        }
    };

    return {
        trips,
        loading,
        fetchMyTrips,
        createTrip,
        updateTrip,
        uploadCover,
        removeCover,
        deleteTrip,
    };
};
