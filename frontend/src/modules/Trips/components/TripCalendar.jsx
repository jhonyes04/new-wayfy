import { useCallback, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { getCategoryStyle } from '../../AccessibilityMap/utils/translations/OSM_TRANSLATIONS';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const DnDCalendar = withDragAndDrop(Calendar);

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales: { es },
});

const MESSAGES = {
    today: 'Hoy',
    previous: 'Anterior',
    next: 'Siguiente',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    noEventsInRange: 'No hay lugares en este rango',
};

const daysToEvents = (days) =>
    days.flatMap((day) => {
        if (!day.date) return [];
        return (day.places || []).map((place) => {
            const start = place.visit_time
                ? new Date(`${day.date}T${place.visit_time}:00`)
                : new Date(`${day.date}T09:00:00`);
            const end = place.visit_time_end
                ? new Date(`${day.date}T${place.visit_time_end}:00`)
                : new Date(start.getTime() + 60 * 60 * 1000);
            return {
                id: place.id,
                dayId: day.id,
                title: place.place_name,
                start,
                end,
                allDay: false,
                resource: { day, place },
            };
        });
    });

// const CalendarEvent = ({ event }) => {
//     const { icon } = getCategoryStyle(event.resource?.place?.sub_type);
//     const pad = (n) => String(n).padStart(2, '0');
//     const fmt = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

//     return (
//         <div
//             className="d-flex align-items-center gap-1 px-1 overflow-hidden h-100"
//             style={{ fontSize: '0.5rem', lineHeight: 1.2 }}
//         >
//             <i className={`fa-solid ${icon} flex-shrink-0`}></i>
//             <span
//                 className="text-truncate flex-grow-1"
//                 style={{ fontSize: '0.8rem' }}
//             >
//                 {event.title}
//             </span>
//             <span
//                 className="flex-shrink-0"
//                 style={{ opacity: 0.85, fontSize: '0.8rem' }}
//             >
//                 {fmt(event.start)}–{fmt(event.end)}
//             </span>
//         </div>
//     );
// };

export const TripCalendar = ({
    days,
    isOwner,
    onUpdatePlace,
    onDeletePlace,
    onSelectedSlot,
}) => {
    const events = useMemo(() => daysToEvents(days), [days]);

    const defaultDate = useMemo(() => {
        const first = days.find((d) => d.date);
        return first ? new Date(`${first.date}T00:00:00`) : new Date();
    }, [days]);

    const handleEventDrop = useCallback(
        ({ event, start, end }) => {
            if (!isOwner) {
                toast.warn('No tienes permiso para editar este viaje');
                return;
            }
            onUpdatePlace(event.dayId, event.id, start, end);
        },
        [isOwner, onUpdatePlace],
    );

    const handleEventResize = useCallback(
        ({ event, start, end }) => {
            if (!isOwner) {
                toast.warn('No tienes permiso para editar este viaje');
                return;
            }
            onUpdatePlace(event.dayId, event.id, start, end);
        },
        [isOwner, onUpdatePlace],
    );

    const CalendarEvent = ({ event }) => {
        const { icon } = getCategoryStyle(event.resource?.place?.sub_type);
        const pad = (n) => String(n).padStart(2, '0');
        const fmt = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

        return (
            <div
                className="d-flex align-items-center gap-1 px-1 overflow-hidden h-100"
                style={{ fontSize: '0.5rem', lineHeight: 1.2 }}
            >
                <i className={`fa-solid ${icon} flex-shrink-0`}></i>
                <span
                    className="text-truncate flex-grow-1"
                    style={{ fontSize: '0.8rem' }}
                >
                    {event.title}
                </span>
                <span
                    className="flex-shrink-0"
                    style={{ opacity: 0.85, fontSize: '0.8rem' }}
                >
                    {fmt(event.start)}–{fmt(event.end)}
                </span>
                {isOwner && (
                    <button
                        className="btn btn-link text-light p-0 flex-shrink-0"
                        style={{ opacity: 0.8, lineHeight: 1 }}
                        title="Eliminar lugar"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeletePlace(event.dayId, event.id);
                        }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                )}
            </div>
        );
    };

    return (
        <Card className="shadow-sm border-0">
            <Card.Body style={{ height: 650 }}>
                <DnDCalendar
                    localizer={localizer}
                    events={events}
                    defaultView="day"
                    views={['day', 'week', 'month', 'agenda']}
                    defaultDate={defaultDate}
                    messages={MESSAGES}
                    culture="es"
                    style={{ height: '100%' }}
                    draggableAccessor={() => isOwner}
                    resizable={isOwner}
                    onEventDrop={handleEventDrop}
                    onEventResize={handleEventResize}
                    selectable={isOwner}
                    onSelectSlot={onSelectedSlot}
                    step={15}
                    timeslots={4}
                    eventPropGetter={(event) => {
                        const { color } = getCategoryStyle(
                            event.resource?.place?.sub_type,
                        );
                        return {
                            style: {
                                backgroundColor: color,
                                borderRadius: '6px',
                                border: 'none',
                                color: '#fff',
                                fontSize: '0.82rem',
                            },
                        };
                    }}
                    formats={{ eventTimeRangeFormat: () => '' }}
                    components={{ event: CalendarEvent }}
                    tooltipAccessor={(e) =>
                        `${e.title}\n${format(e.start, 'HH:mm')} - ${format(e.end, 'HH:mm')}`
                    }
                />
            </Card.Body>
        </Card>
    );
};
