import { Button } from 'react-bootstrap'
import { useAuth } from '../../../context/auth/AuthContext'
import { memo } from 'react'

const UserAvatarComponent = () => {
    const { user } = useAuth()

    return (
        <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
                <img src={user.avatar} alt={user.firstname} className="rounded-circle object-fit-cover border btn-circle" />
                <div className="d-none d-sm-block text-start" style={{ lineHeight: '1.2' }}>
                    <p className="small mb-0 fw-semibold text-dark">{user.firstname}</p>
                    <span className="text-muted fw-medium" style={{ fontSize: '0.75rem' }}>{user.lastname}</span>
                </div>
            </div>
        </div>
    )
}

export const UserAvatar = memo(UserAvatarComponent)