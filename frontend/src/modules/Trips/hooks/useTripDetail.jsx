import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/auth/AuthContext';
import { tripsApi } from '../services/trips.api';
import { favoritesApi } from '../../AccessibilityMap/services/favorites.api';
import { toast } from 'react-toastify';

export const useTripDetail = (tripId) => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTrip = useCallback(async () => {
        try {
            const data = await tripsApi.getTrip(tripId, token);
            setTrip(data);
        } catch (err) {
            toast.error(err.message);
            navigate('/trips');
        } finally {
            setLoading(false);
        }
    }, [tripId, token]);

    useEffect(() => {
        fetchTrip();
    }, [fetchTrip]);

    const isOwner = String(trip?.user_id) === String(user?.id);

    const handleDeleteDay = async (dayId) => {
        try {
            await tripsApi.deleteDay(tripId, dayId, token);
            setTrip((prev) => ({
                ...prev,
                days: prev.days.filter((d) => d.id !== dayId),
            }));
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleGenerateDays = async (startDate, endDate) => {
        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(endDate + 'T00:00:00');
        const existing = new Set((trip.days || []).map((d) => d.date));

        const newDays = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const iso = d.toISOString().split('T')[0];

            if (!existing.has(iso)) newDays.push(iso);
        }

        for (const date of newDays) {
            try {
                const dayNumber =
                    (trip.days?.length || 0) + newDays.indexOf(date) + 1;
                const data = await tripsApi.addDay(
                    tripId,
                    {
                        date,
                        day_number: dayNumber,
                        title: `Día ${dayNumber}`,
                    },
                    token,
                );

                setTrip((prev) => ({
                    ...prev,
                    days: [...(prev.days || []), { ...data.day, places: [] }],
                }));
            } catch (error) {
                toast.error(`Error al crear día ${date}`);
            }
        }
        toast.success(
            `${newDays.length} día${newDays.length > 1 ? 's' : ''} generado${newDays.length > 1 ? 's' : ''}`,
        );
    };

    const handleSaveDate = async (targetDayId, date) => {
        try {
            const data = await tripsApi.updateDay(
                tripId,
                targetDayId,
                { date: date || null },
                token,
            );
            setTrip((prev) => ({
                ...prev,
                days: prev.days.map((d) =>
                    d.id === targetDayId ? { ...d, date: data.day.date } : d,
                ),
            }));
        } catch (err) {
            toast.error(err.message);
            throw err;
        }
    };

    const handleAddPlace = async (
        dayId,
        favoriteId,
        placeNotes,
        visitTime,
        visitTimeEnd,
        favorites,
    ) => {
        const fav = favorites.find((f) => f.id === Number(favoriteId));
        if (!fav) return;
        try {
            const data = await tripsApi.addPlace(
                tripId,
                dayId,
                {
                    favorite_id: fav.id,
                    place_name: fav.place_name,
                    latitude: fav.latitude,
                    longitude: fav.longitude,
                    osm_id: fav.osm_id,
                    sub_type: fav.sub_type,
                    notes: placeNotes,
                    visit_time: visitTime || null,
                    visit_time_end: visitTimeEnd || null,
                },
                token,
            );
            setTrip((prev) => ({
                ...prev,
                days: prev.days.map((d) =>
                    d.id === dayId
                        ? { ...d, places: [...(d.places || []), data.place] }
                        : d,
                ),
            }));
            toast.success('Lugar añadido');
        } catch (err) {
            toast.error(err.message);
            throw err;
        }
    };

    const handleUpdatePlace = async (
        dayId,
        placeId,
        visitTime,
        visitTimeEnd,
    ) => {
        const pad = (d) => String(d).padStart(2, '0');
        const toTimeStr = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
        try {
            const data = await tripsApi.updatePlace(
                tripId,
                dayId,
                placeId,
                {
                    visit_time: toTimeStr(visitTime),
                    visit_time_end: toTimeStr(visitTimeEnd),
                },
                token,
            );
            setTrip((prev) => ({
                ...prev,
                days: prev.days.map((d) =>
                    d.id === dayId
                        ? {
                              ...d,
                              places: d.places.map((p) =>
                                  p.id === placeId ? data.place : p,
                              ),
                          }
                        : d,
                ),
            }));
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDeletePlace = async (dayId, placeId) => {
        try {
            await tripsApi.deletePlace(tripId, dayId, placeId, token);
            setTrip((prev) => ({
                ...prev,
                days: prev.days.map((d) =>
                    d.id === dayId
                        ? {
                              ...d,
                              places: d.places.filter((p) => p.id !== placeId),
                          }
                        : d,
                ),
            }));
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleUpdateCover = async (file) => {
        try {
            const data = await tripsApi.updateCover(tripId, file, token);
            setTrip((prev) => ({
                ...prev,
                cover_image: data.trip.cover_image,
            }));
            toast.success('Imagen actualizada');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDeleteCover = async () => {
        try {
            const data = await tripsApi.deleteCover(tripId, token);
            setTrip((prev) => ({
                ...prev,
                cover_image: data.trip.cover_image,
            }));
            toast.success('Imagen eliminada');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const loadFavorites = async () => {
        if (!user) return [];
        try {
            const data = await favoritesApi.getUserFavorites(user.id, token);
            return data.favorites || [];
        } catch {
            return [];
        }
    };

    return {
        trip,
        loading,
        isOwner,
        handleDeleteDay,
        handleGenerateDays,
        handleSaveDate,
        handleAddPlace,
        handleUpdatePlace,
        handleDeletePlace,
        handleUpdateCover,
        handleDeleteCover,
        loadFavorites,
    };
};
