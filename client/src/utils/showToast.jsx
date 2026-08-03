import toast from "react-hot-toast";

import CustomToast from "../components/Toast/CustomToast";


const showToast = (
    message,
    type = "success"
) => {
    toast.custom(
        t => (
            <CustomToast
                t={t}
                type={type}
                message={message}
            />
        ),
        {
            duration:
                type === "error"
                    ? 4500
                    : 3200
        }
    );
};


export const successToast = (
    message
) => {
    showToast(
        message,
        "success"
    );
};


export const errorToast = (
    message
) => {
    showToast(
        message,
        "error"
    );
};


export const infoToast = (
    message
) => {
    showToast(
        message,
        "info"
    );
};