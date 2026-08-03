const nodemailer =
    require("nodemailer");

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
// SEND EMAIL
// =========================

const sendEmail = async ({
    to,
    subject,
    html
}) => {
    if (
        !to ||
        !process.env.EMAIL_USER ||
        !process.env.EMAIL_PASSWORD
    ) {
        console.log(
            "Email skipped: configuration or recipient missing."
        );

        return;
    }

    try {
        await transporter.sendMail({
            from: {
                name:
                    "Shivalik Dragon",

                address:
                    process.env.EMAIL_USER
            },

            to,

            subject,

            html
        });

        console.log(
            `Email sent to ${to}`
        );
    } catch (error) {
        console.error(
            "Email sending failed:",
            error.message
        );

        throw error;
    }
};

// =========================
// PASSWORD RESET EMAIL
// =========================

const sendPasswordResetEmail =
    async ({
        to,
        resetUrl
    }) => {
        const html = `
            <!DOCTYPE html>

            <html>
                <body
                    style="
                        margin:0;
                        padding:0;
                        background:#f4f8f5;
                        font-family:
                            Arial,
                            Helvetica,
                            sans-serif;
                        color:#17231b;
                    "
                >
                    <div
                        style="
                            max-width:620px;
                            margin:30px auto;
                            padding:20px;
                        "
                    >

                        <div
                            style="
                                background:#166534;
                                padding:24px;
                                border-radius:
                                    16px 16px 0 0;
                            "
                        >
                            <h1
                                style="
                                    margin:0;
                                    color:white;
                                    font-size:24px;
                                "
                            >
                                Shivalik Dragon
                            </h1>
                        </div>

                        <div
                            style="
                                background:white;
                                padding:30px;
                                border-radius:
                                    0 0 16px 16px;
                            "
                        >

                            <h2
                                style="
                                    margin-top:0;
                                    color:#166534;
                                "
                            >
                                Reset your password
                            </h2>

                            <p>
                                We received a request
                                to reset your password.
                            </p>

                            <p>
                                Click the button below
                                to create a new password.
                            </p>

                            <div
                                style="
                                    margin:
                                        28px 0;
                                    text-align:
                                        center;
                                "
                            >
                                <a
                                    href="${resetUrl}"
                                    style="
                                        display:inline-block;
                                        padding:
                                            14px 24px;
                                        background:
                                            #166534;
                                        color:white;
                                        text-decoration:
                                            none;
                                        border-radius:
                                            10px;
                                        font-weight:
                                            bold;
                                    "
                                >
                                    Reset Password
                                </a>
                            </div>

                            <p
                                style="
                                    color:#64748b;
                                    font-size:13px;
                                "
                            >
                                This link will expire
                                in 15 minutes.
                            </p>

                            <p
                                style="
                                    color:#64748b;
                                    font-size:13px;
                                "
                            >
                                If you did not request
                                a password reset,
                                you can safely ignore
                                this email.
                            </p>

                        </div>
                    </div>
                </body>
            </html>
        `;

        await sendEmail({
            to,

            subject:
                "Reset your Shivalik Dragon password",

            html
        });
    };

module.exports = {
    sendEmail,
    sendPasswordResetEmail
};