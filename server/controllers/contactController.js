const ContactMessage =
    require(
        "../models/contactMessage"
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


            const messages =
                await ContactMessage
                    .find(
                        filter
                    )
                    .sort({
                        createdAt:
                            -1
                    });


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