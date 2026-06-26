import useTooltip from '../hooks/useTooltip';
import { Button } from 'react-bootstrap';

export const TooltipButton = ({
    tooltip,
    placement = 'bottom',
    children,
    ...props
}) => {
    const ref = useTooltip({ title: tooltip, placement, trigger: 'hover' });

    return (
        <Button ref={ref} {...props}>
            {children}
        </Button>
    );
};
