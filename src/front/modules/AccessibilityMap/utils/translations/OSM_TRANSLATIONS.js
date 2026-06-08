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
        restaurant: 'Restaurante',
        cafe: 'Cafetería',
        bar: 'Bar',
        fast_food: 'Comida rápida',
        supermarket: 'Supermercado',
        museum: 'Museo',
        art_gallery: 'Galería de arte',
        park: 'Parque',
        hospital: 'Hospital',
        clinic: 'Clínica',
        pharmacy: 'Farmacia',
        bus_stop: 'Parada de autobús',
        station: 'Estación',
        subway_entrance: 'Entrada de metro',
        hotel: 'Hotel',
        hostel: 'Hostal',
        camp_site: 'Camping',
        sports_centre: 'Centro deportivo',
        stadium: 'Estadio',
        toilets: 'Baños públicos',
        government: 'Edificio gubernamental',
        otros: 'Otros',
    },

    icons: {
        restaurant: 'fa-utensils',
        cafe: 'fa-mug-saucer',
        bar: 'fa-martini-glass',
        fast_food: 'fa-burger',
        ice_cream: 'fa-ice-cream',

        supermarket: 'fa-cart-shopping',
        bakery: 'fa-bread-slice',
        clothes: 'fa-shirt',
        mall: 'fa-store',

        museum: 'fa-landmark',
        art_gallery: 'fa-palette',
        attraction: 'fa-star',
        viewpoint: 'fa-binoculars',

        hospital: 'fa-hospital',
        clinic: 'fa-stethoscope',
        pharmacy: 'fa-prescription-bottle-medical',

        bus_stop: 'fa-bus',
        station: 'fa-train-subway',
        subway_entrance: 'fa-train-subway',
        taxi: 'fa-taxi',

        park: 'fa-tree',
        playground: 'fa-child-reaching',
        sports_centre: 'fa-dumbbell',
        stadium: 'fa-futbol',

        government: 'fa-building-columns',
        townhall: 'fa-building-columns',

        toilets: 'fa-restroom',

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
    const cat = OSM_TRANSLATIONS.categories[key] || key;
    return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
};

export const getCategoryIcon = (key) =>
    OSM_TRANSLATIONS.icons[key] || 'fa-circle-question';
