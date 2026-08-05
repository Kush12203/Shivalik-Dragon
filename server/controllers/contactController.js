const ContactMessage =
    require(
        "../models/contactMessage"
    );

const {
    sendEmail
} = require(
    "../services/emailService"
);


// =========================
// VALIDATE EMAIL
// =========================

const isValidEmail = (
    email
) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );
};


// =========================
// ESCAPE HTML
// =========================

const escapeHtml = (
    value = ""
) => {
    return String(
        value
    )
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
// ADMIN ENQUIRY EMAIL
// =========================

const sendAdminEnquiryEmail =
    async ({
        fullName,
        email,
        phone,
        reason,
        message
    }) => {

        const adminEmail =
            process.env
                .ADMIN_NOTIFICATION_EMAIL;


        if (!adminEmail) {
            console.log(
                "Admin enquiry email skipped: ADMIN_NOTIFICATION_EMAIL missing."
            );

            return;
        }


        const safeName =
            escapeHtml(
                fullName
            );

        const safeEmail =
            escapeHtml(
                email
            );

        const safePhone =
            escapeHtml(
                phone ||
                    "Not provided"
            );

        const safeReason =
            escapeHtml(
                reason
            );

        const safeMessage =
            escapeHtml(
                message
            );


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
                            max-width:650px;
                            margin:30px auto;
                            padding:20px;
                        "
                    >

                        <!-- =========================
                            HEADER
                        ========================= -->

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


                            <p
                                style="
                                    margin:
                                        7px 0 0;
                                    color:#d1fae5;
                                    font-size:13px;
                                "
                            >
                                Customer Enquiry
                            </p>

                        </div>


                        <!-- =========================
                            BODY
                        ========================= -->

                        <div
                            style="
                                background:white;
                                padding:28px;
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
                                New Contact Enquiry
                            </h2>


                            <p
                                style="
                                    line-height:1.6;
                                "
                            >
                                A new enquiry has been
                                submitted through the
                                Shivalik Dragon website.
                            </p>


                            <!-- =========================
                                CUSTOMER DETAILS
                            ========================= -->

                            <div
                                style="
                                    margin:24px 0;
                                    padding:18px;
                                    background:#f0fdf4;
                                    border-radius:12px;
                                "
                            >

                                <p
                                    style="
                                        margin:
                                            0 0 12px;
                                    "
                                >
                                    <strong>
                                        Customer:
                                    </strong>

                                    ${safeName}
                                </p>


                                <p
                                    style="
                                        margin:
                                            0 0 12px;
                                    "
                                >
                                    <strong>
                                        Email:
                                    </strong>

                                    ${safeEmail}
                                </p>


                                <p
                                    style="
                                        margin:
                                            0 0 12px;
                                    "
                                >
                                    <strong>
                                        Phone:
                                    </strong>

                                    ${safePhone}
                                </p>


                                <p
                                    style="
                                        margin:0;
                                    "
                                >
                                    <strong>
                                        Reason:
                                    </strong>

                                    ${safeReason}
                                </p>

                            </div>


                            <!-- =========================
                                MESSAGE
                            ========================= -->

                            <div
                                style="
                                    margin-top:20px;
                                "
                            >

                                <p
                                    style="
                                        margin-bottom:8px;
                                        font-weight:bold;
                                    "
                                >
                                    Message
                                </p>


                                <div
                                    style="
                                        padding:18px;
                                        background:#f8faf9;
                                        border:
                                            1px solid #e5e7eb;
                                        border-radius:12px;
                                        line-height:1.7;
                                        white-space:
                                            pre-wrap;
                                    "
                                >
                                    ${safeMessage}
                                </div>

                            </div>


                            <!-- =========================
                                FOOTER
                            ========================= -->

                            <p
                                style="
                                    margin-top:26px;
                                    color:#64748b;
                                    font-size:13px;
                                    line-height:1.6;
                                "
                            >
                                Open the Shivalik Dragon
                                Admin Panel to view and
                                manage this enquiry.
                            </p>

                        </div>

                    </div>

                </body>

            </html>
        `;


        await sendEmail({
            to:
                adminEmail,

            subject:
                `New Enquiry - ${reason}`,

            html
        });
    };


// =========================
// CREATE CONTACT MESSAGE
// PUBLIC
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
            // REQUIRED FIELDS
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


            // =========================
            // CLEAN INPUT
            // =========================

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
                    phone ||
                        ""
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
                        120
                    );


            const cleanMessage =
                String(
                    message
                )
                    .trim()
                    .slice(
                        0,
                        2500
                    );


            // =========================
            // VALIDATE CLEANED DATA
            // =========================

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


            // =========================
            // EMAIL VALIDATION
            // =========================

            if (
                !isValidEmail(
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


            // =========================
            // SAVE ENQUIRY
            // =========================

            const contactMessage =
                await ContactMessage.create(
                    {
                        fullName:
                            cleanName,

                        email:
                            cleanEmail,

                        phone:
                            cleanPhone,

                        reason:
                            cleanReason,

                        message:
                            cleanMessage
                    }
                );


            // =========================
            // ADMIN EMAIL
            //
            // DO NOT await this.
            // Email failure must never
            // make contact form fail.
            // =========================

            sendAdminEnquiryEmail({
                fullName:
                    cleanName,

                email:
                    cleanEmail,

                phone:
                    cleanPhone,

                reason:
                    cleanReason,

                message:
                    cleanMessage
            })
                .then(() => {

                    console.log(
                        `Admin notified for enquiry from ${cleanEmail}`
                    );

                })
                .catch(
                    error => {

                        console.error(
                            "Admin enquiry email failed:",
                            error.message
                        );

                    }
                );


            // =========================
            // RESPONSE
            // =========================

            return res
                .status(201)
                .json({
                    success:
                        true,

                    message:
                        "Message sent successfully.",

                    contactMessage
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


// =========================
// GET ALL CONTACT MESSAGES
// ADMIN
// =========================

exports.getContactMessages =
    async (
        req,
        res
    ) => {

        try {

            const {
                status,
                search
            } = req.query;


            const filter = {};


            // =========================
            // STATUS FILTER
            // =========================

            if (
                status ===
                "unread"
            ) {

                filter.isRead =
                    false;
            }


            if (
                status ===
                "read"
            ) {

                filter.isRead =
                    true;
            }


            if (
                status ===
                "resolved"
            ) {

                filter.isResolved =
                    true;
            }


            if (
                status ===
                "pending"
            ) {

                filter.isResolved =
                    false;
            }


            // =========================
            // SEARCH
            // =========================

            if (
                search &&
                search.trim()
            ) {

                const escapedSearch =
                    search
                        .trim()
                        .replace(
                            /[.*+?^${}()|[\]\\]/g,
                            "\\$&"
                        );


                const regex =
                    new RegExp(
                        escapedSearch,
                        "i"
                    );


                filter.$or = [

                    {
                        fullName:
                            regex
                    },

                    {
                        email:
                            regex
                    },

                    {
                        phone:
                            regex
                    },

                    {
                        reason:
                            regex
                    },

                    {
                        message:
                            regex
                    }

                ];
            }


            // =========================
            // FETCH MESSAGES
            // =========================

            const messages =
                await ContactMessage
                    .find(
                        filter
                    )
                    .sort({
                        createdAt:
                            -1
                    });


            // =========================
            // COUNTS
            // =========================

            const unreadCount =
                await ContactMessage
                    .countDocuments({
                        isRead:
                            false
                    });


            const unresolvedCount =
                await ContactMessage
                    .countDocuments({
                        isResolved:
                            false
                    });


            // =========================
            // RESPONSE
            // =========================

            return res
                .status(200)
                .json({
                    success:
                        true,

                    count:
                        messages.length,

                    unreadCount,

                    unresolvedCount,

                    messages
                });

        } catch (error) {

            console.error(
                "Get contact messages error:",
                error
            );


            return res
                .status(500)
                .json({
                    success:
                        false,

                    message:
                        "Unable to fetch enquiries."
                });
        }
    };


// =========================
// GET SINGLE MESSAGE
// ADMIN
// =========================

exports.getContactMessage =
    async (
        req,
        res
    ) => {

        try {

            const message =
                await ContactMessage
                    .findById(
                        req.params.id
                    );


            if (!message) {

                return res
                    .status(404)
                    .json({
                        success:
                            false,

                        message:
                            "Enquiry not found."
                    });
            }


            return res
                .status(200)
                .json({
                    success:
                        true,

                    message
                });

        } catch (error) {

            console.error(
                "Get contact message error:",
                error
            );


            if (
                error.name ===
                "CastError"
            ) {

                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "Invalid enquiry ID."
                    });
            }


            return res
                .status(500)
                .json({
                    success:
                        false,

                    message:
                        "Unable to fetch enquiry."
                });
        }
    };


// =========================
// MARK READ / UNREAD
// ADMIN
// =========================

exports.updateReadStatus =
    async (
        req,
        res
    ) => {

        try {

            const {
                isRead
            } = req.body;


            if (
                typeof isRead !==
                "boolean"
            ) {

                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "isRead must be true or false."
                    });
            }


            const message =
                await ContactMessage
                    .findByIdAndUpdate(
                        req.params.id,

                        {
                            isRead
                        },

                        {
                            new:
                                true
                        }
                    );


            if (!message) {

                return res
                    .status(404)
                    .json({
                        success:
                            false,

                        message:
                            "Enquiry not found."
                    });
            }


            return res
                .status(200)
                .json({
                    success:
                        true,

                    message:
                        "Read status updated.",

                    contactMessage:
                        message
                });

        } catch (error) {

            console.error(
                "Update read status error:",
                error
            );


            return res
                .status(500)
                .json({
                    success:
                        false,

                    message:
                        "Unable to update enquiry."
                });
        }
    };


// =========================
// MARK RESOLVED
// ADMIN
// =========================

exports.updateResolvedStatus =
    async (
        req,
        res
    ) => {

        try {

            const {
                isResolved
            } = req.body;


            if (
                typeof isResolved !==
                "boolean"
            ) {

                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "isResolved must be true or false."
                    });
            }


            const message =
                await ContactMessage
                    .findByIdAndUpdate(
                        req.params.id,

                        {
                            isResolved,

                            ...(isResolved
                                ? {
                                      isRead:
                                          true
                                  }
                                : {})
                        },

                        {
                            new:
                                true
                        }
                    );


            if (!message) {

                return res
                    .status(404)
                    .json({
                        success:
                            false,

                        message:
                            "Enquiry not found."
                    });
            }


            return res
                .status(200)
                .json({
                    success:
                        true,

                    message:
                        isResolved
                            ? "Enquiry resolved."
                            : "Enquiry reopened.",

                    contactMessage:
                        message
                });

        } catch (error) {

            console.error(
                "Update resolved status error:",
                error
            );


            return res
                .status(500)
                .json({
                    success:
                        false,

                    message:
                        "Unable to update enquiry."
                });
        }
    };


// =========================
// DELETE MESSAGE
// ADMIN
// =========================

exports.deleteContactMessage =
    async (
        req,
        res
    ) => {

        try {

            const message =
                await ContactMessage
                    .findByIdAndDelete(
                        req.params.id
                    );


            if (!message) {

                return res
                    .status(404)
                    .json({
                        success:
                            false,

                        message:
                            "Enquiry not found."
                    });
            }


            return res
                .status(200)
                .json({
                    success:
                        true,

                    message:
                        "Enquiry deleted successfully."
                });

        } catch (error) {

            console.error(
                "Delete contact message error:",
                error
            );


            return res
                .status(500)
                .json({
                    success:
                        false,

                    message:
                        "Unable to delete enquiry."
                });
        }
    };