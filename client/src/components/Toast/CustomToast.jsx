import {
    CheckCircle2,
    CircleAlert,
    Info,
    X
} from "lucide-react";

import toast from "react-hot-toast";

import "./customToast.css";

export default function CustomToast({
    t,
    type = "success",
    message
}) {
    const icon =
        type === "success"
            ? (
                <CheckCircle2
                    size={22}
                />
            )
            : type === "error"
                ? (
                    <CircleAlert
                        size={22}
                    />
                )
                : (
                    <Info
                        size={22}
                    />
                );

    return (
        <div
            className={`custom-toast custom-toast-${type} ${
                t.visible
                    ? "custom-toast-show"
                    : "custom-toast-hide"
            }`}
        >
            <div className="custom-toast-icon">
                {icon}
            </div>

            <div className="custom-toast-content">
                <span className="custom-toast-label">
                    {type === "success"
                        ? "Success"
                        : type === "error"
                            ? "Something went wrong"
                            : "Notice"}
                </span>

                <p>
                    {message}
                </p>
            </div>

            <button
                type="button"
                className="custom-toast-close"
                onClick={() =>
                    toast.dismiss(
                        t.id
                    )
                }
                aria-label="Close notification"
            >
                <X
                    size={18}
                />
            </button>
        </div>
    );
}