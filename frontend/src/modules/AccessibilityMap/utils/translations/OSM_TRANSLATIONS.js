export const OSM_TRANSLATIONS = {
    tagLabels: {
        'wheelchair:description': 'Descripción de accesibilidad',
        'wheelchair:access': 'Acceso para silla de ruedas',
        'entrance:wheelchair': 'Entrada accesible',
        'door:width': 'Ancho de la puerta',
        'door:automatic': 'Puerta automática',
        'door:bell': 'Timbre de asistencia',
        kerb: 'Bordillo',
        incline: 'Inclinación',
        tactile_paving: 'Pavimento táctil',
        'toilets:wheelchair': 'Baño accesible',
        'wheelchair:boarding': 'Acceso al transporte',
        step_free: 'Sin escalones',
        lift: 'Ascensor',
        escalator: 'Escalera mecánica',
        opening_hours: 'Horario',
        phone: 'Teléfono',
        website: 'Sitio web',
        email: 'Correo electrónico',
        'addr:street': 'Calle',
        'addr:housenumber': 'Número',
        'addr:postcode': 'Código postal',
        'addr:city': 'Ciudad',
    },

    tagValues: {
        yes: 'Sí',
        no: 'No',
        limited: 'Parcial',
        unknown: 'Desconocido',

        kerb: {
            lowered: 'Rebajado',
            flush: 'A ras del suelo',
            raised: 'Elevado',
            rolled: 'Redondeado',
        },

        tactile_paving: {
            yes: 'Sí',
            no: 'No',
            partial: 'Parcial',
        },

        'door:automatic': {
            yes: 'Sí',
            no: 'No',
            sensor: 'Sensor',
            button: 'Botón',
        },

        surface: {
            asphalt: 'Asfalto',
            cobblestone: 'Adoquines',
            gravel: 'Gravilla',
            ground: 'Tierra',
            grass: 'Césped',
            sand: 'Arena',
        },

        smoothness: {
            excellent: 'Excelente',
            good: 'Buena',
            intermediate: 'Intermedia',
            bad: 'Mala',
            very_bad: 'Muy mala',
            horrible: 'Intransitable',
        },
    },

    categories: {
        // Gastronomía
        restaurant: 'Restaurante',
        cafe: 'Cafetería',
        bar: 'Bar',
        pub: 'Pub',
        fast_food: 'Comida rápida',
        ice_cream: 'Heladería',
        food_court: 'Zona de restauración',

        // Alojamiento
        hotel: 'Hotel',
        hostel: 'Hostal',
        apartment: 'Apartamento turístico',
        motel: 'Motel',
        guest_house: 'Casa de huéspedes',
        camp_site: 'Camping',

        // Transporte
        bus_stop: 'Parada de autobús',
        bus_station: 'Estación de autobuses',
        station: 'Estación',
        subway_entrance: 'Entrada de metro',
        taxi: 'Parada de taxi',
        parking: 'Aparcamiento',
        bicycle_parking: 'Aparcamiento de bicicletas',

        // Cultura
        museum: 'Museo',
        art_gallery: 'Galería de arte',
        arts_centre: 'Centro de arte',
        theatre: 'Teatro',
        cinema: 'Cine',
        library: 'Biblioteca',
        community_centre: 'Centro cívico',
        place_of_worship: 'Lugar de culto',
        viewpoint: 'Mirador',
        attraction: 'Atracción turística',
        information: 'Punto de información',
        picnic_site: 'Zona de picnic',

        // Recreación / Ocio
        park: 'Parque',
        playground: 'Parque infantil',
        garden: 'Jardín',
        recreation_ground: 'Zona recreativa',
        common: 'Zona comunal',
        nightclub: 'Discoteca',

        // Deporte
        sports_centre: 'Centro deportivo',
        stadium: 'Estadio',
        pitch: 'Cancha deportiva',
        swimming_pool: 'Piscina',
        fitness_centre: 'Gimnasio',

        // Gobierno
        townhall: 'Ayuntamiento',
        courthouse: 'Juzgado',
        embassy: 'Embajada',
        government: 'Edificio gubernamental',
        police: 'Comisaría de policía',
        post_office: 'Oficina de correos',
        fire_station: 'Parque de bomberos',

        // Salud
        hospital: 'Hospital',
        clinic: 'Clínica',
        pharmacy: 'Farmacia',
        dentist: 'Dentista',
        doctors: 'Consulta médica',
        social_facility: 'Centro social',

        // Dinero
        bank: 'Banco',
        atm: 'Cajero automático',
        bureau_de_change: 'Casa de cambio',

        // Baños
        toilets: 'Baños públicos',

        // Tiendas
        supermarket: 'Supermercado',
        convenience: 'Tienda de conveniencia',
        bakery: 'Panadería',
        clothes: 'Tienda de ropa',
        mall: 'Centro comercial',

        otros: 'Otros',
    },

    icons: {
        // Gastronomía
        restaurant: 'fa-utensils',
        cafe: 'fa-mug-saucer',
        bar: 'fa-martini-glass',
        pub: 'fa-beer-mug-empty',
        fast_food: 'fa-burger',
        ice_cream: 'fa-ice-cream',
        food_court: 'fa-utensils',

        // Alojamiento
        hotel: 'fa-bed',
        hostel: 'fa-bed',
        apartment: 'fa-building',
        motel: 'fa-bed',
        guest_house: 'fa-house',
        camp_site: 'fa-campground',

        // Transporte
        bus_stop: 'fa-bus',
        bus_station: 'fa-bus',
        station: 'fa-train-subway',
        subway_entrance: 'fa-train-subway',
        taxi: 'fa-taxi',
        parking: 'fa-square-parking',
        bicycle_parking: 'fa-bicycle',

        // Cultura y turismo
        museum: 'fa-landmark',
        art_gallery: 'fa-palette',
        arts_centre: 'fa-palette',
        theatre: 'fa-masks-theater',
        cinema: 'fa-film',
        library: 'fa-book',
        community_centre: 'fa-people-roof',
        place_of_worship: 'fa-place-of-worship',
        attraction: 'fa-star',
        viewpoint: 'fa-binoculars',
        information: 'fa-circle-info',
        picnic_site: 'fa-tree',

        // Recreación / ocio
        park: 'fa-tree',
        playground: 'fa-child-reaching',
        garden: 'fa-seedling',
        recreation_ground: 'fa-person-walking',
        common: 'fa-person-walking',
        nightclub: 'fa-music',

        // Deporte
        sports_centre: 'fa-dumbbell',
        stadium: 'fa-futbol',
        pitch: 'fa-futbol',
        swimming_pool: 'fa-person-swimming',
        fitness_centre: 'fa-dumbbell',

        // Gobierno
        townhall: 'fa-building-columns',
        courthouse: 'fa-building-columns',
        embassy: 'fa-flag',
        government: 'fa-building-columns',
        police: 'fa-building-shield',
        post_office: 'fa-envelope',
        fire_station: 'fa-fire-extinguisher',

        // Salud
        hospital: 'fa-hospital',
        clinic: 'fa-stethoscope',
        pharmacy: 'fa-prescription-bottle-medical',
        dentist: 'fa-tooth',
        doctors: 'fa-stethoscope',
        social_facility: 'fa-hand-holding-heart',

        // Dinero
        bank: 'fa-building-columns',
        atm: 'fa-money-bill-wave',
        bureau_de_change: 'fa-money-bill-transfer',

        // Baños
        toilets: 'fa-restroom',

        // Tiendas
        supermarket: 'fa-cart-shopping',
        convenience: 'fa-store',
        bakery: 'fa-bread-slice',
        clothes: 'fa-shirt',
        mall: 'fa-store',

        otros: 'fa-circle-question',
        unknown: 'fa-circle-question',
    },
};

export const formatOpeningHours = (value) => {
    if (!value) return '';

    let v = value
        .replace(/\bMo\b/g, 'Lun')
        .replace(/\bTu\b/g, 'Mar')
        .replace(/\bWe\b/g, 'Mié')
        .replace(/\bTh\b/g, 'Jue')
        .replace(/\bFr\b/g, 'Vie')
        .replace(/\bSa\b/g, 'Sáb')
        .replace(/\bSu\b/g, 'Dom');

    v = v
        .replace(/Lun-Vie/g, 'Lunes a Viernes')
        .replace(/Sáb-Dom/g, 'Sábado y Domingo')
        .replace(/Lun-Dom/g, 'Lunes a Domingo');

    v = v
        .replace(/\bLun\b/g, 'Lunes')
        .replace(/\bMar\b/g, 'Martes')
        .replace(/\bMié\b/g, 'Miércoles')
        .replace(/\bJue\b/g, 'Jueves')
        .replace(/\bVie\b/g, 'Viernes')
        .replace(/\bSáb\b/g, 'Sábado')
        .replace(/\bDom\b/g, 'Domingo');

    v = v.replace(/;/g, ' · ');

    return v.trim();
};

export const translateValue = (key, value) => {
    const dict = OSM_TRANSLATIONS.tagValues;

    if (dict[key] && dict[key][value]) return dict[key][value];
    if (dict[value]) return dict[value];

    if (key === 'door:width' && !isNaN(Number(value))) return `${value} cm`;

    if (key === 'opening_hours') {
        return formatOpeningHours(value);
    }

    return value;
};

export const translateTag = (key) => OSM_TRANSLATIONS.tagLabels[key] || key;

export const translateCategory = (key) => {
    if (!key) return 'Sin categoría';
    const cat = OSM_TRANSLATIONS.categories[key] || key;
    return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
};

export const getCategoryIcon = (key) =>
    OSM_TRANSLATIONS.icons[key] || 'fa-circle-question';

const SUB_TYPE_TO_CATEGORY = {
    // Gastronomía
    restaurant: 'gastronomia',
    cafe: 'gastronomia',
    bar: 'gastronomia',
    pub: 'gastronomia',
    fast_food: 'gastronomia',
    ice_cream: 'gastronomia',
    food_court: 'gastronomia',
    // Alojamiento
    hotel: 'alojamiento',
    hostel: 'alojamiento',
    apartment: 'alojamiento',
    motel: 'alojamiento',
    guest_house: 'alojamiento',
    camp_site: 'alojamiento',
    // Transporte
    bus_stop: 'transporte',
    bus_station: 'transporte',
    taxi: 'transporte',
    parking: 'transporte',
    bicycle_parking: 'transporte',
    // Cultura y turismo
    museum: 'cultura_turismo',
    art_gallery: 'cultura_turismo',
    arts_centre: 'cultura_turismo',
    theatre: 'cultura_turismo',
    cinema: 'cultura_turismo',
    library: 'cultura_turismo',
    place_of_worship: 'cultura_turismo',
    viewpoint: 'cultura_turismo',
    attraction: 'cultura_turismo',
    information: 'cultura_turismo',
    picnic_site: 'cultura_turismo',
    // Recreación
    park: 'recreacion',
    playground: 'recreacion',
    garden: 'recreacion',
    nightclub: 'recreacion',
    recreation_ground: 'recreacion',
    // Gobierno
    townhall: 'gobierno',
    courthouse: 'gobierno',
    embassy: 'gobierno',
    police: 'gobierno',
    post_office: 'gobierno',
    fire_station: 'gobierno',
    // Salud
    hospital: 'salud',
    clinic: 'salud',
    pharmacy: 'salud',
    dentist: 'salud',
    doctors: 'salud',
    social_facility: 'salud',
    // Dinero
    bank: 'dinero',
    atm: 'dinero',
    bureau_de_change: 'dinero',
    // Deporte
    sports_centre: 'deporte',
    stadium: 'deporte',
    pitch: 'deporte',
    swimming_pool: 'deporte',
    fitness_centre: 'deporte',
    // Tiendas
    supermarket: 'tiendas',
    convenience: 'tiendas',
    // Baños
    toilets: 'banos',
};

const CATEGORY_STYLES = {
    gastronomia: { color: '#e74c3c', icon: 'fa-utensils' },
    alojamiento: { color: '#8e44ad', icon: 'fa-bed' },
    transporte: { color: '#7f8c8d', icon: 'fa-bus' },
    cultura_turismo: { color: '#d35400', icon: 'fa-landmark' },
    recreacion: { color: '#27ae60', icon: 'fa-tree' },
    gobierno: { color: '#2980b9', icon: 'fa-building-columns' },
    salud: { color: '#c0392b', icon: 'fa-kit-medical' },
    dinero: { color: '#f39c12', icon: 'fa-coins' },
    deporte: { color: '#16a085', icon: 'fa-person-running' },
    tiendas: { color: '#e67e22', icon: 'fa-bag-shopping' },
    banos: { color: '#95a5a6', icon: 'fa-restroom' },
    otros: { color: '#0d6efd', icon: 'fa-location-dot' },
};

export const getCategoryStyle = (subType) => {
    const cat = SUB_TYPE_TO_CATEGORY[subType] || 'otros';
    return CATEGORY_STYLES[cat] || CATEGORY_STYLES.otros;
};
