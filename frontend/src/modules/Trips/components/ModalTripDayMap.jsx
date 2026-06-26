import React from 'react';
import { Modal } from 'react-bootstrap';
import { TripDayMap } from './TripDayMap';

export const ModalTripDayMap = ({ show, onHide, day }) => {
    return (
        <Modal show={show} onHide={onHide} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="fa-solid fa-route me-2 text-primary"></i>
                    {day?.title ?? `Día ${day?.day_number}`}
                    {day?.date && (
                        <span className="text-muted fs-6 fw-normal ms-2">
                            {new Date(
                                day.date + 'T00:00:00',
                            ).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                            })}
                        </span>
                    )}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TripDayMap day={day} height="450px" />
            </Modal.Body>
        </Modal>
    );
};
