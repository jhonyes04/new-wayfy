import { ProgressBar } from 'react-bootstrap';

export const passwordRequirements = [
    { id: 'length', label: 'Mínimo 8 caracteres', test: (p) => p.length >= 8 },
    {
        id: 'uppercase',
        label: 'Al menos una mayúscula',
        test: (p) => /[A-Z]/.test(p),
    },
    {
        id: 'lowercase',
        label: 'Al menos una minúscula',
        test: (p) => /[a-z]/.test(p),
    },
    { id: 'number', label: 'Al menos un número', test: (p) => /[0-9]/.test(p) },
    {
        id: 'special',
        label: 'Al menos un carácter especial',
        test: (p) => /[^A-Za-z0-9]/.test(p),
    },
];

const getStrength = (password) => {
    const passed = passwordRequirements.filter((r) => r.test(password)).length;
    if (passed <= 1) return { pct: 20, label: 'Muy débil', variant: 'danger' };
    if (passed === 2) return { pct: 40, label: 'Débil', variant: 'danger' };
    if (passed === 3) return { pct: 60, label: 'Media', variant: 'warning' };
    if (passed === 4) return { pct: 80, label: 'Fuerte', variant: 'success' };
    return { pct: 100, label: 'Muy fuerte', variant: 'success' };
};

const PasswordStrengthIndicator = ({ password }) => {
    if (!password) return null;

    const { pct, label, variant } = getStrength(password);

    return (
        <div className="px-1">
            <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted">Fortaleza</span>
                <span className={`small fw-semibold text-${variant}`}>
                    {label}
                </span>
            </div>
            <ProgressBar
                now={pct}
                variant={variant}
                style={{ height: '5px' }}
                className="rounded-pill mb-2"
            />
            <div className="d-flex flex-column gap-1">
                {passwordRequirements.map((req) => {
                    const ok = req.test(password);
                    return (
                        <div
                            key={req.id}
                            className={`d-flex align-items-center gap-2 small ${ok ? 'text-success' : 'text-muted'}`}
                        >
                            <i
                                className={`fa-solid ${ok ? 'fa-circle-check' : 'fa-circle-xmark'}`}
                                style={{ fontSize: '0.75rem' }}
                            />
                            {req.label}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PasswordStrengthIndicator;
