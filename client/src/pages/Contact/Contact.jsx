import {
    ArrowUpRight,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Send,
    Sparkles
} from "lucide-react";

import {
    useState
} from "react";

import {
    motion
} from "framer-motion";

import {
    useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../services/api";

import "./contact.css";

export default function Contact() {
    const navigate =
        useNavigate();

    const publicEmail =
        import.meta.env
            .VITE_PUBLIC_EMAIL ||
        "";

    const publicPhone =
        import.meta.env
            .VITE_PUBLIC_PHONE ||
        "";

    const whatsappNumber =
        import.meta.env
            .VITE_WHATSAPP_NUMBER ||
        "";

    const [
        form,
        setForm
    ] = useState({
        fullName: "",
        email: "",
        phone: "",
        reason:
            "General Enquiry",
        message: ""
    });

    const [
        sending,
        setSending
    ] = useState(false);

    const handleChange =
        event => {
            const {
                name,
                value
            } = event.target;

            setForm(
                current => ({
                    ...current,
                    [name]:
                        value
                })
            );
        };

    const handleSubmit =
        async event => {
            event.preventDefault();

            if (
                !form.fullName.trim() ||
                !form.email.trim() ||
                !form.reason ||
                !form.message.trim()
            ) {
                toast.error(
                    "Please complete all required fields."
                );

                return;
            }

            try {
                setSending(true);

                await api.post(
                    "/contact",
                    {
                        fullName:
                            form.fullName.trim(),

                        email:
                            form.email.trim(),

                        phone:
                            form.phone.trim(),

                        reason:
                            form.reason,

                        message:
                            form.message.trim()
                    }
                );

                toast.success(
                    "Message sent successfully."
                );

                setForm({
                    fullName: "",
                    email: "",
                    phone: "",
                    reason:
                        "General Enquiry",
                    message: ""
                });

            } catch (error) {
                console.error(
                    "Contact error:",
                    error
                );

                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to send message."
                );

            } finally {
                setSending(false);
            }
        };

    const handleEmail =
        () => {
            if (!publicEmail) {
                toast.error(
                    "Email is not configured."
                );

                return;
            }

            window.location.href =
                `mailto:${publicEmail}`;
        };

    const handlePhone =
        () => {
            if (!publicPhone) {
                toast.error(
                    "Phone number is not configured."
                );

                return;
            }

            window.location.href =
                `tel:+${publicPhone}`;
        };

    const handleWhatsApp =
        () => {
            if (
                !whatsappNumber
            ) {
                toast.error(
                    "WhatsApp number is not configured."
                );

                return;
            }

            const message =
                encodeURIComponent(
                    "Hi Shivalik Dragon! I would like to know more about your Dragon Fruit."
                );

            window.open(
                `https://wa.me/${whatsappNumber}?text=${message}`,
                "_blank",
                "noopener,noreferrer"
            );
        };

    const handleInstagram =
        () => {
            window.open(
                "https://www.instagram.com/shivalikdragon/",
                "_blank",
                "noopener,noreferrer"
            );
        };

    return (
        <section className="contact-page">

            <div className="contact-container">

                <motion.div
                    className="contact-header"
                    initial={{
                        opacity: 0,
                        y: 20
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                >
                    <div className="contact-badge">
                        <Sparkles
                            size={15}
                        />

                        GET IN TOUCH
                    </div>

                    <h1>
                        We'd love to
                        <strong>
                            {" "}
                            hear from you.
                        </strong>
                    </h1>

                    <p>
                        Questions about
                        products, orders or
                        visiting the farm?
                        Send us a message and
                        we'll get back to you.
                    </p>
                </motion.div>


                <div className="contact-grid">

                    {/* LEFT SIDE */}

                    <div className="contact-info-column">

                        {/* EMAIL */}

                        <button
                            type="button"
                            className="contact-info-card contact-info-action"
                            onClick={
                                handleEmail
                            }
                        >
                            <div className="contact-info-icon">
                                <Mail
                                    size={19}
                                />
                            </div>

                            <div>
                                <span>
                                    EMAIL
                                </span>

                                <strong>
                                    {publicEmail ||
                                        "Email Shivalik Dragon"}
                                </strong>

                                <p>
                                    Send us an email
                                    directly from
                                    your device.
                                </p>
                            </div>

                            <ArrowUpRight
                                className="contact-card-arrow"
                                size={16}
                            />
                        </button>


                        {/* PHONE */}

                        <button
                            type="button"
                            className="contact-info-card contact-info-action"
                            onClick={
                                handlePhone
                            }
                        >
                            <div className="contact-info-icon">
                                <Phone
                                    size={19}
                                />
                            </div>

                            <div>
                                <span>
                                    PHONE
                                </span>

                                <strong>
                                    {publicPhone
                                        ? `+${publicPhone}`
                                        : "Call Shivalik Dragon"}
                                </strong>

                                <p>
                                    Speak with us
                                    directly for
                                    quick enquiries.
                                </p>
                            </div>

                            <ArrowUpRight
                                className="contact-card-arrow"
                                size={16}
                            />
                        </button>


                        {/* LOCATION */}

                        <button
                            type="button"
                            className="contact-info-card contact-info-action"
                            onClick={() =>
                                navigate(
                                    "/location"
                                )
                            }
                        >
                            <div className="contact-info-icon">
                                <MapPin
                                    size={19}
                                />
                            </div>

                            <div>
                                <span>
                                    LOCATION
                                </span>

                                <strong>
                                    Shivalik Dragon Farm
                                </strong>

                                <p>
                                    View our farm on
                                    Google Maps and
                                    get directions.
                                </p>
                            </div>

                            <ArrowUpRight
                                className="contact-card-arrow"
                                size={16}
                            />
                        </button>


                        {/* INSTAGRAM */}

                        <button
                            type="button"
                            className="contact-info-card contact-info-action"
                            onClick={
                                handleInstagram
                            }
                        >
                            <div className="contact-info-icon contact-instagram-icon">
                                IG
                            </div>

                            <div>
                                <span>
                                    INSTAGRAM
                                </span>

                                <strong>
                                    @shivalikdragon
                                </strong>

                                <p>
                                    Follow us for farm
                                    updates, fresh harvests
                                    and Dragon Fruit content.
                                </p>
                            </div>

                            <ArrowUpRight
                                className="contact-card-arrow"
                                size={16}
                            />
                        </button>


                        {/* WHATSAPP */}

                        <div className="contact-whatsapp-card">

                            <MessageCircle
                                size={24}
                            />

                            <div>
                                <span>
                                    QUICK CONTACT
                                </span>

                                <h3>
                                    Prefer WhatsApp?
                                </h3>

                                <p>
                                    Start a conversation
                                    with Shivalik Dragon
                                    directly through
                                    WhatsApp.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleWhatsApp
                                }
                            >
                                <MessageCircle
                                    size={16}
                                />

                                Chat on WhatsApp

                                <ArrowUpRight
                                    size={15}
                                />
                            </button>

                        </div>

                    </div>


                    {/* FORM */}

                    <motion.form
                        className="contact-form-card"
                        onSubmit={
                            handleSubmit
                        }
                        initial={{
                            opacity: 0,
                            x: 20
                        }}
                        animate={{
                            opacity: 1,
                            x: 0
                        }}
                    >

                        <div className="contact-form-heading">
                            <span>
                                SEND A MESSAGE
                            </span>

                            <h2>
                                How can we help?
                            </h2>

                            <p>
                                Fill in the form
                                and your message
                                will be delivered
                                directly to us.
                            </p>
                        </div>


                        <div className="contact-form-grid">

                            <div className="contact-field">
                                <label>
                                    Full Name *
                                </label>

                                <input
                                    name="fullName"
                                    value={
                                        form.fullName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Your name"
                                    autoComplete="name"
                                />
                            </div>


                            <div className="contact-field">
                                <label>
                                    Email *
                                </label>

                                <input
                                    name="email"
                                    type="email"
                                    value={
                                        form.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="you@email.com"
                                    autoComplete="email"
                                />
                            </div>

                        </div>


                        <div className="contact-form-grid">

                            <div className="contact-field">
                                <label>
                                    Phone
                                </label>

                                <input
                                    name="phone"
                                    type="tel"
                                    value={
                                        form.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Phone number"
                                    autoComplete="tel"
                                />
                            </div>


                            <div className="contact-field">
                                <label>
                                    Reason *
                                </label>

                                <select
                                    name="reason"
                                    value={
                                        form.reason
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="General Enquiry">
                                        General Enquiry
                                    </option>

                                    <option value="Product Enquiry">
                                        Product Enquiry
                                    </option>

                                    <option value="Order Support">
                                        Order Support
                                    </option>

                                    <option value="Farm Visit">
                                        Farm Visit
                                    </option>

                                    <option value="Business Enquiry">
                                        Business Enquiry
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>
                                </select>
                            </div>

                        </div>


                        <div className="contact-field">
                            <label>
                                Message *
                            </label>

                            <textarea
                                name="message"
                                maxLength={1000}
                                value={
                                    form.message
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Tell us how we can help..."
                            />

                            <span className="contact-character-count">
                                {
                                    form.message.length
                                }
                                /1000
                            </span>
                        </div>


                        <button
                            type="submit"
                            className="contact-submit-button"
                            disabled={
                                sending
                            }
                        >
                            <Send
                                size={16}
                            />

                            {sending
                                ? "Sending..."
                                : "Send Message"}
                        </button>


                        <div className="contact-form-note">
                            <Mail
                                size={13}
                            />

                            You'll also receive
                            an email confirming
                            that we received your
                            message.
                        </div>

                    </motion.form>

                </div>

            </div>

        </section>
    );
}