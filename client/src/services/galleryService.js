import api from "./api";


// =========================
// PUBLIC
// =========================

export const getGalleryImages = (
    params = {}
) => {
    return api.get(
        "/gallery",
        {
            params
        }
    );
};


export const getGalleryImage = (
    id
) => {
    return api.get(
        `/gallery/${id}`
    );
};


// =========================
// ADMIN UPLOAD
// =========================

export const uploadGalleryImage = (
    formData
) => {
    return api.post(
        "/gallery",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data"
            }
        }
    );
};


// =========================
// ADMIN UPDATE
// =========================

export const updateGalleryImage = (
    id,
    data
) => {
    return api.put(
        `/gallery/${id}`,
        data
    );
};


// =========================
// ADMIN DELETE
// =========================

export const deleteGalleryImage = (
    id
) => {
    return api.delete(
        `/gallery/${id}`
    );
};