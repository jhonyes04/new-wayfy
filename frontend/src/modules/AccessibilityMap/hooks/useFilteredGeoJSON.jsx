import { useMemo } from 'react';

const useFilteredGeoJSON = (
    geojson,
    activeFilters,
    activeCategories,
    communityWheelchairMap,
) => {
    return useMemo(() => {
        if (!geojson || !geojson.features) return null;

        const filters = activeFilters || [];
        const categories = activeCategories || [];

        const features = geojson.features
            .map((f) => {
                const osmId = String(f.properties.id);
                const communityValue = communityWheelchairMap?.[osmId];
                if (!communityValue) return f;
                return {
                    ...f,
                    properties: { ...f.properties, wheelchair: communityValue },
                };
            })
            .filter((f) => {
                const wheelchair = f.properties.wheelchair;
                const normalizedAccess = ['yes', 'limited', 'no'].includes(
                    wheelchair,
                )
                    ? wheelchair
                    : 'unknown';

                const matchesAccess = filters.includes(normalizedAccess);
                const matchesCategory = categories.includes(
                    f.properties.category,
                );

                return matchesAccess && matchesCategory;
            });

        return {
            ...geojson,
            features,
        };
    }, [geojson, activeFilters, activeCategories, communityWheelchairMap]);
};

export default useFilteredGeoJSON;
