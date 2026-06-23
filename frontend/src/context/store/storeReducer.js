export const storeReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_LOCATION':
            return {
                ...state,
                viewState: { ...state.viewState, ...action.payload },
            };

        case 'SET_SELECTED_LOCATION':
            return { ...state, selectedLocation: action.payload };

        case 'ADD_PLACE':
            return { ...state, places: [...state.places, action.payload] };
        case 'REMOVE_PLACE':
            return {
                ...state,
                places: state.places.filter((p) => p.id !== action.payload),
            };

        case 'SET_FAVORITES':
            return { ...state, favorites: action.payload };

        case 'ADD_FAVORITE':
            return {
                ...state,
                favorites: [...state.favorites, action.payload],
            };
        case 'REMOVE_FAVORITE':
            return {
                ...state,
                favorites: state.favorites.filter(
                    (fav) => String(fav.id) !== String(action.payload),
                ),
            };

        case 'SET_ACTIVE_FILTERS':
            return { ...state, activeFilters: action.payload };
        case 'SET_ACTIVE_CATEGORIES':
            return { ...state, activeCategories: action.payload };

        case 'SET_SELECTED_FEATURE':
            return { ...state, selectedFeature: action.payload };

        case 'SET_AI_QUERY_INFO':
            return { ...state, aiQueryInfo: action.payload };

        case 'SET_THEME': {
            const newTheme = action.payload;
            localStorage.setItem('theme', newTheme);
            return {
                ...state,
                theme: newTheme,
            };
        }

        case 'SET_LISTENING':
            return { ...state, isListening: action.payload };

        case 'SET_PROCESSING':
            return { ...state, isProcessing: action.payload };

        default:
            return state;
    }
};
