const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getAuthHeader = (token) => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
});

export const handleResponse = async (
    response,
    errorMessage = 'Error en la solicitud',
) => {
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const body = isJson
        ? await response.json()
        : { msg: `Error ${response.status} : ${response.statusText}` };

    if (!response.ok) throw new Error(body.msg || errorMessage);

    return body;
};

export { API_BASE_URL };
