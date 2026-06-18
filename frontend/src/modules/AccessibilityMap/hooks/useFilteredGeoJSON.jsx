import { useMemo } from 'react';

const useFilteredGeoJSON = (
    geojson,
    activeFilters,
    activeCategories,
) => {
    return useMemo(() => {
        if (!geojson || !geojson.features) return null;

        const filters = activeFilters || [];
        const categories = activeCategories || [];

        const features = geojson.features.filter((f) => {
            const wheelchair = f.properties.wheelchair;
            const normalizedAccess = ['yes', 'limited', 'no'].includes(
                wheelchair,
            )
                ? wheelchair
                : 'unknown';

            const matchesAccess = filters.includes(normalizedAccess);

            const matchesCategory = categories.includes(f.properties.category);

            return matchesAccess && matchesCategory;
        });

        return {
            ...geojson,
            features,
        };
    }, [geojson, activeFilters, activeCategories]);
};

export default useFilteredGeoJSON