import { useState } from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { AccessibilityMap } from '../modules/AccessibilityMap/components/AccessibilityMap';
import { AccessibilityDetails } from '../modules/AccessibilityMap/components/AccessibilityDetails';
import { FilterPanel } from '../modules/FilterPanel/components/FilterPanel';
import { useEffect } from 'react';

const PageMaps = () => {
    const { state, dispatch } = useGlobalReducer();
    const { places, selectedFeature } = state;
    const [showSidebar, setShowSidebar] = useState(true);

    const handleToggleSidebar = () => setShowSidebar(!showSidebar);

    const handleClose = () => {
        dispatch({ type: 'SET_SELECTED_FEATURE', payload: null });
    };

    useEffect(() => {
        const timeouts = [10, 150, 300].map((delay) =>
            setTimeout(() => window.dispatchEvent(new Event('resize')), delay),
        );

        return () => timeouts.forEach(clearTimeout);
    }, []);

    return (
        <div className="d-flex flex-grow-1 position-relative">
            <section className="h-100 flex-grow-1 position-relative z-1 overflow-auto">
                <AccessibilityMap />
            </section>

            <FilterPanel />

            {selectedFeature && (
                <AccessibilityDetails
                    feature={selectedFeature}
                    onClose={handleClose}
                />
            )}
        </div>
    );
};

export default PageMaps;
