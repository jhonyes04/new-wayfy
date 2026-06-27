import React from 'react';
import { Modal } from 'react-bootstrap';
import { TripDayMap } from './TripDayMap';

export const ModalTripDayMap = ({ show, onHide, day }) => {
    return (
        <Modal show={show} onHide={onHide} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title className="d-flex align-items-center text-primary">
                    <i className="fa-solid fa-route me-2"></i>
                    <h3 className="m-0">
                        {day?.title ?? `Día ${day?.day_number}`}
                    </h3>
                    {day?.date && (
                        <span className="text-muted fs-6 fw-normal ms-2 align-self-end">
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
