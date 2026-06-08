import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { AccessibilityMap } from "../modules/AccessibilityMap/components/AccessibilityMap";
import { AccessibilityDetails } from '../modules/AccessibilityMap/components/AccessibilityDetails'
import { FilterPanel } from '../modules/FilterPanel/components/FilterPanel'
import { useEffect } from "react";

export const PageMaps = () => {
    const { state, dispatch } = useGlobalReducer()
    const { places, selectedFeature } = state;
    const [showSidebar, setShowSidebar] = useState(true)

    const handleToggleSidebar = () => setShowSidebar(!showSidebar)

    const handleClose = () => {
        dispatch({ type: 'SET_SELECTED_FEATURE', payload: null })
    }

    useEffect(() => {
        const interval = setInterval(() => {
            window.dispatchEvent(new Event('resize'))
        }, 10)

        const timer = setTimeout(() => {
            clearInterval(interval)
            window.dispatchEvent(new Event('resize'))
        }, 300)

        return () => {
            clearInterval(interval)
            clearTimeout(timer)
        }
    }, [showSidebar])

    return (
        <div className="d-flex flex-grow-1 position-relative">
            <section className="h-100 flex-grow-1 position-relative z-1 overflow-auto">
                <AccessibilityMap />
            </section>

            <FilterPanel />

            {selectedFeature && (
                <AccessibilityDetails feature={selectedFeature} onClose={handleClose} />
            )}
        </div>
    );
};
