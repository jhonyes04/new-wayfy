const OVERPASS_ENDPOINTS = [
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass-api.de/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];

async function safeJson(response) {
    const text = await response.text();

    if (!text || text.trimStart().startsWith('<')) {
        throw new Error('Overpass devolvió HTML/XML en vez de JSON');
    }

    return JSON.parse(text);
}

async function queryOverpass(query) {
    const body = new URLSearchParams({ data: query }).toString();

    for (const endpoint of OVERPASS_ENDPOINTS) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/x-www-form-urlencoded;charset=UTF-8',
                    Accept: 'application/json',
                },
                body,
            });

            const json = await safeJson(response);

            if (!json.elements || !Array.isArray(json.elements)) continue;

            return json.elements;
        } catch (err) {
            console.warn(`Fallo en ${endpoint}:`, err.message);
        }
    }

    throw new Error('Todos los endpoints de Overpass fallaron.');
}

export async function fetchWheelchairPlacesProgressive(bbox, onPartialData) {
    const [south, west, north, east] = bbox;

    const q1 = `
[out:json][timeout:25];
(
  node["wheelchair"](${south},${west},${north},${east});
  way["wheelchair"](${south},${west},${north},${east});
  relation["wheelchair"](${south},${west},${north},${east});
);
out body;
>;
out skel qt;
    `;

    const q2 = `
[out:json][timeout:40];
(
  node["amenity"](${south},${west},${north},${east});
  node["shop"](${south},${west},${north},${east});
  node["tourism"](${south},${west},${north},${east});
);
(
  ._;
  node(w)["wheelchair"];
  node(w)["wheelchair:description"];
  node(w)["wheelchair:access"];
  node(w)["entrance:wheelchair"];
  node(w)["door:width"];
  node(w)["door:automatic"];
  node(w)["door:bell"];
  node(w)["kerb"];
  node(w)["incline"];
  node(w)["tactile_paving"];
  node(w)["toilets:wheelchair"];
);
out body;
>;
out skel qt;
    `;

    const q3 = `
[out:json][timeout:40];
(
  node["public_transport"](${south},${west},${north},${east});
  node["building"]["building"!="yes"](${south},${west},${north},${east});
);
(
  ._;
  node(w)["wheelchair"];
  node(w)["wheelchair:boarding"];
  node(w)["step_free"];
  node(w)["lift"];
  node(w)["escalator"];
);
out body;
>;
out skel qt;
    `;

    try {
        const r1 = await queryOverpass(q1);
        onPartialData(r1);
    } catch (err) {
        console.warn('Error en fase 1:', err.message);
    }

    try {
        const r2 = await queryOverpass(q2);
        onPartialData(r2);
    } catch (err) {
        console.warn('Error en fase 2:', err.message);
    }

    try {
        const r3 = await queryOverpass(q3);
        onPartialData(r3);
    } catch (err) {
        console.warn('Error en fase 3:', err.message);
    }
}
