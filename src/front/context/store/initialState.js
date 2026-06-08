export const initialState = () => {
    const savedTheme = localStorage.getItem('theme');
    return {
        viewState: {
            longitude: -3.7038,
            latitude: 40.4168,
            zoom: 14,
        },
        places: [],
        favorites: [],
        selectedLocation: null,
        activeFilters: ['yes', 'limited'],
        activeCategories: [
            'gastronomia',
            'alojamiento',
            'transporte',
            'salud',
            'cultura_turismo',
            'recreacion',
            'deporte',
            'gobierno',
            'baños',
            'dinero',
            'tiendas',
            'otros',
        ],
        selectedFeature: null,
        theme: savedTheme || 'light',
        isListening: false,
        isProcessing: false,
    };
};
