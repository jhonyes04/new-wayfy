import { Button } from 'react-bootstrap';
import { useAuth } from '../../../context/auth/AuthContext';
import { memo } from 'react';
import { useProtectedImage } from '../../../hooks/useProtectedImage';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const UserAvatarComponent = ({ textColor = 'light' }) => {
    const { user, token } = useAuth();
    const avatarUrl = user?.avatar ? `${API_BASE_URL}${user.avatar}` : null;
    const blobUrl = useProtectedImage(avatarUrl, token);

    return (
        <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
                <img
                    src={blobUrl || ''}
                    alt={user?.firstname}
                    className="rounded-circle object-fit-cover border btn-circle"
                />
                <div
                    className="d-none d-sm-block text-start"
                    style={{ lineHeight: '1.2' }}
                >
                    <p className={`small mb-0 fw-semibold text-${textColor}`}>
                        {user?.firstname}
                    </p>
                    <span
                        className="text-muted fw-medium"
                        style={{ fontSize: '0.75rem' }}
                    >
                        {user?.lastname}
                    </span>
                </div>
            </div>
        </div>
    );
};

export const UserAvatar = memo(UserAvatarComponent);
