import { NavLink } from 'react-router-dom';
import useTooltip from '../hooks/useTooltip';

export const ButtonMenu = ({ link, label, icon }) => {
    const tooltipRef = useTooltip({
        title: label,
        placement: 'bottom',
        trigger: 'hover',
    });

    return (
        <div className="text-center position-relative">
            <NavLink
                to={link}
                ref={tooltipRef}
                className={({ isActive }) =>
                    `btn menu-btn ${isActive ? 'btn-primary active' : 'btn-success'} btn-circle`
                }
            >
                <i className={`fa-solid ${icon}`}></i>
            </NavLink>
        </div>
    );
};
