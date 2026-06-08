import { Button } from 'react-bootstrap'

export const UserAvatar = () => {
    const user = {
        name: "Carlos Mendoza",
        email: "carlos.m@empresa.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
        plan: "Usuario Premium"
    };

    return (
        <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
                <img src={user.avatar} alt={user.name} className="rounded-circle object-fit-cover border" style={{ width: '36px', height: '36px' }} />
                <div className="d-none d-sm-block text-start" style={{ lineHeight: '1.2' }}>
                    <p className="small mb-0 fw-semibold text-dark">{user.name}</p>
                    <span className="text-primary fw-medium" style={{ fontSize: '0.75rem' }}>{user.plan}</span>
                </div>
            </div>
        </div>
    )
}
