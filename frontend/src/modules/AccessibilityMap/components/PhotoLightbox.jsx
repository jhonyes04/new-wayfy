import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from 'react-bootstrap';

export const PhotoLightbox = ({ photos, initialIndex, onClose }) => {
    const [current, setCurrent] = useState(initialIndex);

    const goTo = (index) => {
        if (index < 0) index = photos.length - 1;
        if (index >= photos.length) index = 0;
        setCurrent(index);
    };

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'ArrowLeft') goTo(current - 1);
            if (e.key === 'ArrowRight') goTo(current + 1);
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [current]);

    return createPortal(
        <div
            className="position-absolute top-50 start-50 translate-middle rounded-4 w-75 h-75"
            style={{
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(8px)',
                zIndex: 9999,
            }}
            onClick={onClose}
        >
            <div
                className="w-100 h-100 d-flex align-items-center justify-content-center"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={photos[current].src}
                    alt={photos[current].caption || 'foto'}
                    style={{
                        width: '80%',
                        height: '80%',
                        objectFit: 'contain',
                    }}
                />
            </div>

            {photos.length > 1 && (
                <Button
                    variant="dark"
                    className="position-absolute top-50 start-0 translate-middle-y ms-2"
                    style={{ zIndex: 10 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        goTo(current - 1);
                    }}
                >
                    <i className="fa-solid fa-chevron-left"></i>
                </Button>
            )}

            {photos.length > 1 && (
                <Button
                    variant="dark"
                    className="position-absolute top-50 end-0 translate-middle-y me-2"
                    style={{ zIndex: 10 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        goTo(current + 1);
                    }}
                >
                    <i className="fa-solid fa-chevron-right"></i>
                </Button>
            )}

            <Button
                variant="dark"
                className="position-absolute top-0 end-0 m-3"
                style={{ zIndex: 10 }}
                onClick={onClose}
            >
                <i className="fa-solid fa-xmark fs-5"></i>
            </Button>

            {photos.length > 1 && (
                <span
                    className="position-absolute bottom-0 start-50 translate-middle-x text-white mb-3"
                    style={{ fontSize: '0.85rem', zIndex: 10 }}
                >
                    {current + 1} / {photos.length}
                </span>
            )}
        </div>,
        document.body,
    );
};
