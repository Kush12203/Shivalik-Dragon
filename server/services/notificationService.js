const {
    sendEmail
} = require(
    "./emailService"
);


// =========================
// FORMAT CURRENCY
// =========================

const formatCurrency = (
    amount
) => {
    return Number(
        amount || 0
    ).toLocaleString(
        "en-IN",
        {
            maximumFractionDigits:
                2
        }
    );
};


// =========================
// ORDER ITEMS TEXT
// =========================

const getOrderItemsText = (
    order
) => {
    return order.items
        .map(
            item =>
                `${item.productName} - ${item.quantity} ${item.unit}`
        )
        .join(", ");
};


// =========================
// ORDER ITEMS HTML
// =========================

const getOrderItemsHtml = (
    order
) => {
    return order.items
        .map(
            item => `
                <tr>

                    <td
                        style="
                            padding:10px;
                            border-bottom:
                                1px solid #e5e7eb;
                        "
                    >
                        ${item.productName}
                    </td>


                    <td
                        style="
                            padding:10px;
                            border-bottom:
                                1px solid #e5e7eb;
                            text-align:center;
                        "
                    >
                        ${item.quantity}
                        ${item.unit}
                    </td>


                    <td
                        style="
                            padding:10px;
                            border-bottom:
                                1px solid #e5e7eb;
                            text-align:right;
                        "
                    >
                        ₹${formatCurrency(
                            item.price
                        )}
                    </td>


                    <td
                        style="
                            padding:10px;
                            border-bottom:
                                1px solid #e5e7eb;
                            text-align:right;
                        "
                    >
                        ₹${formatCurrency(
                            item.subtotal
                        )}
                    </td>

                </tr>
            `
        )
        .join("");
};


// =========================
// CUSTOMER EMAIL TEMPLATE
// =========================

const orderEmailTemplate = ({
    customerName,
    title,
    message,
    order
}) => {

    return `
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
                            ${title}
                        </h2>


                        <p>
                            Hi
                            ${customerName ||
                            "Customer"},
                        </p>


                        <p>
                            ${message}
                        </p>


                        <div
                            style="
                                margin:24px 0;
                                padding:18px;
                                border-radius:12px;
                                background:#f0fdf4;
                            "
                        >

                            <strong>
                                Order:
                            </strong>

                            ${order.orderNumber}

                            <br />
                            <br />


                            <strong>
                                Status:
                            </strong>

                            ${order.orderStatus}

                            <br />
                            <br />


                            <strong>
                                Payment:
                            </strong>

                            ${order.paymentStatus}

                            <br />
                            <br />


                            <strong>
                                Total:
                            </strong>

                            ₹${formatCurrency(
                                order.totalAmount
                            )}

                        </div>


                        <table
                            style="
                                width:100%;
                                border-collapse:
                                    collapse;
                            "
                        >

                            <thead>

                                <tr
                                    style="
                                        background:
                                            #f8faf9;
                                    "
                                >

                                    <th
                                        style="
                                            padding:10px;
                                            text-align:left;
                                        "
                                    >
                                        Product
                                    </th>


                                    <th
                                        style="
                                            padding:10px;
                                        "
                                    >
                                        Quantity
                                    </th>


                                    <th
                                        style="
                                            padding:10px;
                                            text-align:right;
                                        "
                                    >
                                        Price
                                    </th>


                                    <th
                                        style="
                                            padding:10px;
                                            text-align:right;
                                        "
                                    >
                                        Total
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                ${getOrderItemsHtml(
                                    order
                                )}

                            </tbody>

                        </table>


                        <p
                            style="
                                margin-top:28px;
                                color:#64748b;
                                font-size:13px;
                            "
                        >
                            Thank you for ordering
                            from Shivalik Dragon.
                        </p>

                    </div>

                </div>

            </body>

        </html>
    `;
};


// =========================
// CUSTOMER EMAIL
// =========================

const notifyCustomer =
    async ({
        customer,
        order,
        title,
        message
    }) => {

        if (
            !customer ||
            !customer.email
        ) {
            console.log(
                "Customer email skipped: email missing."
            );

            return;
        }


        await sendEmail({
            to:
                customer.email,

            subject:
                `${title} - ${order.orderNumber}`,

            html:
                orderEmailTemplate({
                    customerName:
                        customer.fullName ||
                        customer.username,

                    title,

                    message,

                    order
                })
        });
    };


// =========================
// ADMIN ORDER TEMPLATE
// =========================

const adminOrderTemplate =
    ({
        customer,
        order
    }) => {

        return `
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
                                        6px 0 0;
                                    color:#d1fae5;
                                "
                            >
                                New Order Notification
                            </p>

                        </div>


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
                                New Order Received
                            </h2>


                            <div
                                style="
                                    padding:18px;
                                    border-radius:12px;
                                    background:#f0fdf4;
                                "
                            >

                                <p>
                                    <strong>
                                        Order:
                                    </strong>

                                    ${order.orderNumber}
                                </p>


                                <p>
                                    <strong>
                                        Customer:
                                    </strong>

                                    ${
                                        customer?.fullName ||
                                        customer?.username ||
                                        "-"
                                    }
                                </p>


                                <p>
                                    <strong>
                                        Email:
                                    </strong>

                                    ${
                                        customer?.email ||
                                        "-"
                                    }
                                </p>


                                <p>
                                    <strong>
                                        Phone:
                                    </strong>

                                    ${
                                        customer?.phone ||
                                        "-"
                                    }
                                </p>


                                <p>
                                    <strong>
                                        Items:
                                    </strong>

                                    ${getOrderItemsText(
                                        order
                                    )}
                                </p>


                                <p>
                                    <strong>
                                        Status:
                                    </strong>

                                    ${order.orderStatus}
                                </p>


                                <p>
                                    <strong>
                                        Payment:
                                    </strong>

                                    ${order.paymentStatus}
                                </p>


                                <p
                                    style="
                                        margin-bottom:0;
                                    "
                                >
                                    <strong>
                                        Amount:
                                    </strong>

                                    <span
                                        style="
                                            color:#166534;
                                            font-size:18px;
                                            font-weight:bold;
                                        "
                                    >
                                        ₹${formatCurrency(
                                            order.totalAmount
                                        )}
                                    </span>
                                </p>

                            </div>


                            <h3
                                style="
                                    margin-top:25px;
                                "
                            >
                                Order Items
                            </h3>


                            <table
                                style="
                                    width:100%;
                                    border-collapse:
                                        collapse;
                                "
                            >

                                <thead>

                                    <tr
                                        style="
                                            background:
                                                #f8faf9;
                                        "
                                    >

                                        <th
                                            style="
                                                padding:10px;
                                                text-align:left;
                                            "
                                        >
                                            Product
                                        </th>


                                        <th
                                            style="
                                                padding:10px;
                                            "
                                        >
                                            Quantity
                                        </th>


                                        <th
                                            style="
                                                padding:10px;
                                                text-align:right;
                                            "
                                        >
                                            Price
                                        </th>


                                        <th
                                            style="
                                                padding:10px;
                                                text-align:right;
                                            "
                                        >
                                            Total
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    ${getOrderItemsHtml(
                                        order
                                    )}

                                </tbody>

                            </table>


                            <p
                                style="
                                    margin-top:25px;
                                    color:#64748b;
                                    font-size:13px;
                                "
                            >
                                Open the Admin Dashboard
                                to manage this order.
                            </p>

                        </div>

                    </div>

                </body>

            </html>
        `;
    };


// =========================
// ORDER PLACED
// =========================

exports.notifyOrderPlaced =
    async (
        customer,
        order
    ) => {

        // =========================
        // CUSTOMER EMAIL
        // =========================

        try {

            await notifyCustomer({
                customer,

                order,

                title:
                    "Order Received",

                message:
                    `Your order ${order.orderNumber} has been received successfully.`
            });

        } catch (error) {

            console.error(
                "Customer order email failed:",
                error.message
            );
        }


        // =========================
        // ADMIN EMAIL
        // =========================

        try {

            const adminEmail =
                process.env
                    .ADMIN_NOTIFICATION_EMAIL;


            if (!adminEmail) {

                console.log(
                    "Admin order email skipped: ADMIN_NOTIFICATION_EMAIL missing."
                );

                return;
            }


            await sendEmail({
                to:
                    adminEmail,

                subject:
                    `New Order ${order.orderNumber} - ₹${formatCurrency(
                        order.totalAmount
                    )}`,

                html:
                    adminOrderTemplate({
                        customer,
                        order
                    })
            });


            console.log(
                `Admin notified for order ${order.orderNumber}`
            );

        } catch (error) {

            console.error(
                "Admin order email failed:",
                error.message
            );
        }
    };


// =========================
// ORDER STATUS
// =========================

exports.notifyOrderStatus =
    async (
        customer,
        order
    ) => {

        const statusMessages = {

            Pending:
                "Your order has been received and is awaiting confirmation.",

            Confirmed:
                "Your order has been confirmed.",

            Ready:
                "Your order is ready.",

            Completed:
                "Your order has been completed.",

            Cancelled:
                "Your order has been cancelled."
        };


        const message =
            statusMessages[
                order.orderStatus
            ] ||
            `Your order status is now ${order.orderStatus}.`;


        try {

            await notifyCustomer({
                customer,

                order,

                title:
                    `Order ${order.orderStatus}`,

                message
            });

        } catch (error) {

            console.error(
                "Customer status email failed:",
                error.message
            );
        }
    };


// =========================
// PAYMENT STATUS
// =========================

exports.notifyPaymentStatus =
    async (
        customer,
        order
    ) => {

        const message =
            `Payment status for your order ${order.orderNumber} has been updated to ${order.paymentStatus}.`;


        try {

            await notifyCustomer({
                customer,

                order,

                title:
                    `Payment ${order.paymentStatus}`,

                message
            });

        } catch (error) {

            console.error(
                "Customer payment email failed:",
                error.message
            );
        }
    };