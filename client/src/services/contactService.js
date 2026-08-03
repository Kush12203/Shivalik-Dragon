import api from "./api";

export const getEnquiries = (
    params = {}
) => {
    return api.get(
        "/contact/admin",
        {
            params
        }
    );
};

export const getEnquiry = (
    id
) => {
    return api.get(
        `/contact/admin/${id}`
    );
};

export const updateEnquiryReadStatus = (
    id,
    isRead
) => {
    return api.patch(
        `/contact/admin/${id}/read`,
        {
            isRead
        }
    );
};

export const updateEnquiryResolvedStatus = (
    id,
    isResolved
) => {
    return api.patch(
        `/contact/admin/${id}/resolve`,
        {
            isResolved
        }
    );
};

export const deleteEnquiry = (
    id
) => {
    return api.delete(
        `/contact/admin/${id}`
    );
};