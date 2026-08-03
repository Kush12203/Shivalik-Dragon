const {
    sendEmail
} = require(
    "../services/emailService"
);


// =========================
// ESCAPE HTML
// =========================

const escapeHtml = (
    value = ""
) => {
    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
};


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


            // =========================
            // VALIDATION
            // =========================

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


            const cleanName =
                String(
                    fullName
                )
                    .trim()
                    .slice(
                        0,
                        100
                    );

            const cleanEmail =
                String(
                    email
                )
                    .trim()
                    .toLowerCase()
                    .slice(
                        0,
                        150
                    );

            const cleanPhone =
                String(
                    phone || ""
                )
                    .trim()
                    .slice(
                        0,
                        30
                    );

            const cleanReason =
                String(
                    reason
                )
                    .trim()
                    .slice(
                        0,
                        100
                    );

            const cleanMessage =
                String(
                    message
                )
                    .trim()
                    .slice(
                        0,
                        2000
                    );


            if (
                !cleanName ||
                !cleanEmail ||
                !cleanReason ||
                !cleanMessage
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


            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !emailRegex.test(
                    cleanEmail
                )
            ) {
                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "Please enter a valid email address."
                    });
            }


            const adminEmail =
                process.env
                    .ADMIN_NOTIFICATION_EMAIL;

            if (!adminEmail) {
                console.error(
                    "ADMIN_NOTIFICATION_EMAIL is not configured."
                );

                return res
                    .status(500)
                    .json({
                        success:
                            false,

                        message:
                            "Unable to send your message right now."
                    });
            }


            // =========================
            // SAFE VALUES FOR HTML
            // =========================

            const safeName =
                escapeHtml(
                    cleanName
                );

            const safeEmail =
                escapeHtml(
                    cleanEmail
                );

            const safePhone =
                escapeHtml(
                    cleanPhone ||
                        "Not provided"
                );

            const safeReason =
                escapeHtml(
                    cleanReason
                );

            const safeMessage =
                escapeHtml(
                    cleanMessage
                );


            // =========================
            // EMAIL TO ADMIN
            // =========================

            await sendEmail({
                to:
                    adminEmail,

                replyTo:
                    cleanEmail,

                subject:
                    `New Contact Message - ${cleanReason}`,

                html: `
                    <div
                        style="
                            font-family:
                                Arial,
                                Helvetica,
                                sans-serif;
                            max-width:650px;
                            margin:auto;
                            color:#193326;
                        "
                    >
                        <div
                            style="
                                background:#166534;
                                padding:22px;
                                border-radius:
                                    16px 16px 0 0;
                            "
                        >
                            <h2
                                style="
                                    color:white;
                                    margin:0;
                                "
                            >
                                New Contact Message
                            </h2>
                        </div>

                        <div
                            style="
                                padding:24px;
                                background:#ffffff;
                                border-radius:
                                    0 0 16px 16px;
                            "
                        >
                            <p>
                                A visitor submitted
                                the contact form on
                                Shivalik Dragon.
                            </p>

                            <div
                                style="
                                    margin-top:20px;
                                    padding:18px;
                                    border-radius:12px;
                                    background:#f4faf6;
                                "
                            >
                                <p>
                                    <strong>
                                        Name:
                                    </strong>

                                    ${safeName}
                                </p>

                                <p>
                                    <strong>
                                        Email:
                                    </strong>

                                    ${safeEmail}
                                </p>

                                <p>
                                    <strong>
                                        Phone:
                                    </strong>

                                    ${safePhone}
                                </p>

                                <p>
                                    <strong>
                                        Reason:
                                    </strong>

                                    ${safeReason}
                                </p>

                                <p>
                                    <strong>
                                        Message:
                                    </strong>
                                </p>

                                <p
                                    style="
                                        white-space:
                                            pre-line;
                                    "
                                >
                                    ${safeMessage}
                                </p>
                            </div>

                            <p
                                style="
                                    margin-top:20px;
                                    color:#708078;
                                    font-size:13px;
                                "
                            >
                                Reply directly to this
                                email to respond to
                                ${safeName}.
                            </p>
                        </div>
                    </div>
                `
            });


            // =========================
            // ACKNOWLEDGEMENT
            // =========================

            await sendEmail({
                to:
                    cleanEmail,

                subject:
                    "We received your message - Shivalik Dragon",

                html: `
                    <div
                        style="
                            font-family:
                                Arial,
                                Helvetica,
                                sans-serif;
                            max-width:650px;
                            margin:auto;
                            color:#193326;
                        "
                    >

                        <div
                            style="
                                background:#166534;
                                padding:22px;
                                border-radius:
                                    16px 16px 0 0;
                            "
                        >
                            <h2
                                style="
                                    color:white;
                                    margin:0;
                                "
                            >
                                Shivalik Dragon
                            </h2>
                        </div>

                        <div
                            style="
                                padding:24px;
                                background:white;
                                border-radius:
                                    0 0 16px 16px;
                            "
                        >
                            <h2>
                                Thanks for contacting us
                            </h2>

                            <p>
                                Hi ${safeName},
                            </p>

                            <p>
                                We have received your
                                message regarding
                                <strong>
                                    ${safeReason}
                                </strong>.
                            </p>

                            <p>
                                Our team will get back
                                to you as soon as
                                possible.
                            </p>

                            <div
                                style="
                                    margin-top:22px;
                                    padding:16px;
                                    border-radius:12px;
                                    background:#f4faf6;
                                "
                            >
                                <strong>
                                    Your message
                                </strong>

                                <p
                                    style="
                                        white-space:
                                            pre-line;
                                        color:#66756c;
                                    "
                                >
                                    ${safeMessage}
                                </p>
                            </div>

                            <p
                                style="
                                    margin-top:24px;
                                "
                            >
                                Regards,
                                <br />

                                <strong>
                                    Shivalik Dragon
                                </strong>
                            </p>
                        </div>
                    </div>
                `
            });


            return res
                .status(200)
                .json({
                    success:
                        true,

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
                    success:
                        false,

                    message:
                        "Unable to send your message right now."
                });
        }
    };