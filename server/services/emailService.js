const {
    Resend
} = require("resend");


// =========================
// RESEND CLIENT
// =========================

const resend =
    new Resend(
        process.env.RESEND_API_KEY
    );


// =========================
// SEND EMAIL
// =========================

const sendEmail =
    async ({
        to,
        subject,
        html
    }) => {

        if (!to) {
            console.log(
                "Email skipped: recipient missing."
            );

            return;
        }


        if (
            !process.env
                .RESEND_API_KEY
        ) {
            console.log(
                "Email skipped: RESEND_API_KEY missing."
            );

            return;
        }


        const from =
            process.env.EMAIL_FROM ||
            "Shivalik Dragon <onboarding@resend.dev>";


        try {
            const {
                data,
                error
            } =
                await resend
                    .emails
                    .send({
                        from,

                        to: [
                            to
                        ],

                        subject,

                        html
                    });


            if (error) {
                console.error(
                    "Resend email error:",
                    error
                );

                throw new Error(
                    error.message ||
                    "Resend email failed."
                );
            }


            console.log(
                `Email sent to ${to}`,
                data?.id ||
                ""
            );


            return data;

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
// FUTURE USE
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
                                    margin:28px 0;
                                    text-align:center;
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
                                        font-weight:bold;
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