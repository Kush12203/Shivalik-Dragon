import api from "./api";


// =========================
// GET CUSTOMERS
// =========================

export const getCustomers = (
    params = {}
) => {
    return api.get(
        "/customers",
        {
            params
        }
    );
};


// =========================
// GET CUSTOMER PROFILE
// =========================

export const getCustomerProfile = (
    id
) => {
    return api.get(
        `/customers/${id}`
    );
};