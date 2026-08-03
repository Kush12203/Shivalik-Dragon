const nodemailer =
    require("nodemailer");

// =========================
// MAIL TRANSPORTER
// =========================

const transporter =
    nodemailer.createTransport({
        service: "gmail",

        auth: {
            user:
                process.env.EMAIL_USER,

            pass:
                process.env.EMAIL_PASSWORD
        }
    });

// =========================
// SEND CONTACT MESSAGE
// =========================

exports.sendContactMessage =
    async (
        req,
        res
    ) => {
        try {
            const {
                fullName,
                email,
                phone,
                reason,
                message
            } = req.body;

            if (
                !fullName ||
                !email ||
                !reason ||
                !message
            ) {
                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "Please complete all required fields."
                    });
            }

            const adminEmail =
                process.env
                    .ADMIN_NOTIFICATION_EMAIL ||
                process.env
                    .EMAIL_USER;

            // =========================
            // EMAIL TO ADMIN
            // =========================

            await transporter.sendMail({
                from:
                    `"Shivalik Dragon Website" <${process.env.EMAIL_USER}>`,

                to:
                    adminEmail,

                replyTo:
                    email,

                subject:
                    `New Contact Message - ${reason}`,

                html: `
                    <div
                        style="
                            font-family: Arial, sans-serif;
                            max-width: 650px;
                            margin: auto;
                            color: #193326;
                        "
                    >
                        <h2>
                            New Contact Message
                        </h2>

                        <p>
                            A visitor submitted
                            the contact form on
                            Shivalik Dragon.
                        </p>

                        <div
                            style="
                                margin-top: 20px;
                                padding: 18px;
                                border-radius: 12px;
                                background: #f4faf6;
                            "
                        >
                            <p>
                                <strong>Name:</strong>
                                ${fullName}
                            </p>

                            <p>
                                <strong>Email:</strong>
                                ${email}
                            </p>

                            <p>
                                <strong>Phone:</strong>
                                ${phone || "Not provided"}
                            </p>

                            <p>
                                <strong>Reason:</strong>
                                ${reason}
                            </p>

                            <p>
                                <strong>Message:</strong>
                            </p>

                            <p
                                style="
                                    white-space: pre-line;
                                "
                            >
                                ${message}
                            </p>
                        </div>

                        <p
                            style="
                                margin-top: 20px;
                                color: #708078;
                                font-size: 13px;
                            "
                        >
                            You can reply directly
                            to this email to respond
                            to ${fullName}.
                        </p>
                    </div>
                `
            });

            // =========================
            // ACKNOWLEDGEMENT TO USER
            // =========================

            await transporter.sendMail({
                from:
                    `"Shivalik Dragon" <${process.env.EMAIL_USER}>`,

                to:
                    email,

                subject:
                    "We received your message - Shivalik Dragon",

                html: `
                    <div
                        style="
                            font-family: Arial, sans-serif;
                            max-width: 650px;
                            margin: auto;
                            color: #193326;
                        "
                    >
                        <h2>
                            Thanks for contacting
                            Shivalik Dragon
                        </h2>

                        <p>
                            Hi ${fullName},
                        </p>

                        <p>
                            We have received your
                            message regarding
                            <strong>${reason}</strong>.
                        </p>

                        <p>
                            Our team will get back
                            to you as soon as
                            possible.
                        </p>

                        <div
                            style="
                                margin-top: 22px;
                                padding: 16px;
                                border-radius: 12px;
                                background: #f4faf6;
                            "
                        >
                            <strong>
                                Your message
                            </strong>

                            <p
                                style="
                                    white-space: pre-line;
                                    color: #66756c;
                                "
                            >
                                ${message}
                            </p>
                        </div>

                        <p
                            style="
                                margin-top: 24px;
                            "
                        >
                            Regards,<br/>
                            <strong>
                                Shivalik Dragon
                            </strong>
                        </p>
                    </div>
                `
            });

            return res
                .status(200)
                .json({
                    success: true,

                    message:
                        "Message sent successfully."
                });

        } catch (error) {
            console.error(
                "Contact message error:",
                error
            );

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        "Unable to send your message right now."
                });
        }
    };