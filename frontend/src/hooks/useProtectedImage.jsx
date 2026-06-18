import { useState, useEffect } from 'react';

export const useProtectedImage = (imageUrl, token) => {
    const [blobUrl, setBlobUrl] = useState(null);

    useEffect(() => {
        if (!imageUrl || !token) return;

        let objectUrl = null;

        fetch(imageUrl, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error('No autorizado');
                return res.blob();
            })
            .then((blob) => {
                objectUrl = URL.createObjectURL(blob);
                setBlobUrl(objectUrl);
            })
            .catch(() => setBlobUrl(null));

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [imageUrl, token]);

    return blobUrl;
};
