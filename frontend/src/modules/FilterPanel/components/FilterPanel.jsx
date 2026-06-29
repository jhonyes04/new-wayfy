import { FilterAccessibility } from './FilterAccessibility';
import { FilterCategories } from './FilterCategories';
import '../css/FilterPanel.css';

export const FilterPanel = () => {
    return (
        <div className="position-absolute end-0 ms-5 z-1">
            <div
                className="d-flex flex-column gap-3 p-2 overflow-auto scroll-dark"
                style={{
                    background: 'rgba(0,0,0,0.65)',
                    pointerEvents: 'auto',
                    maxHeight: 'calc(100vh - 140px)',
                }}
            >
                <FilterAccessibility />
                <hr className="text-light m-0" />
                <FilterCategories />
            </div>
        </div>
    );
};
