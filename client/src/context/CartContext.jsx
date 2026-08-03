import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import api from "../services/api";

import {
    useAuth
} from "./AuthContext";

const CartContext =
    createContext(null);

const GUEST_STORAGE_KEY =
    "shivalikDragonGuestCart";

// =========================
// READ GUEST CART
// =========================

const readGuestCart = () => {
    try {
        const stored =
            localStorage.getItem(
                GUEST_STORAGE_KEY
            );

        return stored
            ? JSON.parse(
                  stored
              )
            : [];
    } catch {
        return [];
    }
};

// =========================
// SAVE GUEST CART
// =========================

const saveGuestCart = (
    items
) => {
    try {
        localStorage.setItem(
            GUEST_STORAGE_KEY,
            JSON.stringify(
                items
            )
        );
    } catch (error) {
        console.error(
            "Unable to save guest cart:",
            error
        );
    }
};

// =========================
// NORMALIZE SERVER CART
// =========================

const normalizeServerCart = (
    cart
) => {
    if (
        !cart ||
        !Array.isArray(
            cart.items
        )
    ) {
        return [];
    }

    return cart.items
        .filter(
            item =>
                item.product
        )
        .map(
            item => ({
                cartItemId:
                    item._id,

                product:
                    item.product,

                quantity:
                    Number(
                        item.quantity ||
                            0
                    )
            })
        );
};

export const CartProvider = ({
    children
}) => {
    const {
        user,
        authLoading
    } = useAuth();

    const [
        items,
        setItems
    ] = useState(
        []
    );

    const [
        cartLoading,
        setCartLoading
    ] = useState(
        true
    );

    const initializedUserRef =
        useRef(null);

    // =========================
    // FETCH SERVER CART
    // =========================

    const fetchServerCart =
        async () => {
            const response =
                await api.get(
                    "/cart"
                );

            const normalized =
                normalizeServerCart(
                    response.data.cart
                );

            setItems(
                normalized
            );

            return normalized;
        };

    // =========================
    // MERGE GUEST CART
    // =========================

    const mergeGuestCart =
        async () => {
            const guestItems =
                readGuestCart();

            if (
                guestItems.length ===
                0
            ) {
                return;
            }

            for (
                const item
                of guestItems
            ) {
                if (
                    !item.product?._id ||
                    !item.quantity
                ) {
                    continue;
                }

                await api.post(
                    "/cart",
                    {
                        productId:
                            item.product
                                ._id,

                        quantity:
                            Number(
                                item.quantity
                            )
                    }
                );
            }

            // Guest cart has now
            // moved to logged-in cart.

            localStorage.removeItem(
                GUEST_STORAGE_KEY
            );
        };

    // =========================
    // AUTH CHANGE
    // =========================

    useEffect(() => {
        if (authLoading) {
            return;
        }

        const loadCart =
            async () => {
                setCartLoading(
                    true
                );

                try {
                    // =========================
                    // LOGGED IN
                    // =========================

                    if (user) {
                        const userId =
                            user._id;

                        /*
                            Only merge guest cart
                            once when switching
                            into this logged-in
                            session.
                        */

                        if (
                            initializedUserRef
                                .current !==
                            userId
                        ) {
                            await mergeGuestCart();

                            initializedUserRef.current =
                                userId;
                        }

                        await fetchServerCart();

                        return;
                    }

                    // =========================
                    // GUEST
                    // =========================

                    initializedUserRef.current =
                        null;

                    setItems(
                        readGuestCart()
                    );
                } catch (error) {
                    console.error(
                        "Load cart error:",
                        error
                    );

                    if (!user) {
                        setItems(
                            readGuestCart()
                        );
                    } else {
                        setItems(
                            []
                        );
                    }
                } finally {
                    setCartLoading(
                        false
                    );
                }
            };

        loadCart();
    }, [
        user?._id,
        authLoading
    ]);

    // =========================
    // ADD TO CART
    // =========================

    const addToCart =
        async (
            product,
            quantity = 1
        ) => {
            const numericQuantity =
                Number(
                    quantity
                );

            if (
                !numericQuantity ||
                numericQuantity <=
                    0
            ) {
                return;
            }

            // =========================
            // GUEST
            // =========================

            if (!user) {
                setItems(
                    currentItems => {
                        const existing =
                            currentItems.find(
                                item =>
                                    item
                                        .product
                                        ._id ===
                                    product._id
                            );

                        let updatedItems;

                        if (existing) {
                            updatedItems =
                                currentItems.map(
                                    item =>
                                        item
                                            .product
                                            ._id ===
                                        product._id
                                            ? {
                                                  ...item,

                                                  quantity:
                                                      Number(
                                                          item.quantity
                                                      ) +
                                                      numericQuantity
                                              }
                                            : item
                                );
                        } else {
                            updatedItems =
                                [
                                    ...currentItems,

                                    {
                                        product,

                                        quantity:
                                            numericQuantity
                                    }
                                ];
                        }

                        saveGuestCart(
                            updatedItems
                        );

                        return updatedItems;
                    }
                );

                return;
            }

            // =========================
            // LOGGED IN
            // =========================

            const response =
                await api.post(
                    "/cart",
                    {
                        productId:
                            product._id,

                        quantity:
                            numericQuantity
                    }
                );

            setItems(
                normalizeServerCart(
                    response.data.cart
                )
            );
        };

    // =========================
    // UPDATE QUANTITY
    // =========================

    const updateQuantity =
        async (
            productId,
            quantity
        ) => {
            const numericQuantity =
                Number(
                    quantity
                );

            if (
                !numericQuantity ||
                numericQuantity <=
                    0
            ) {
                return;
            }

            // =========================
            // GUEST
            // =========================

            if (!user) {
                setItems(
                    currentItems => {
                        const updatedItems =
                            currentItems.map(
                                item =>
                                    item
                                        .product
                                        ._id ===
                                    productId
                                        ? {
                                              ...item,

                                              quantity:
                                                  numericQuantity
                                          }
                                        : item
                            );

                        saveGuestCart(
                            updatedItems
                        );

                        return updatedItems;
                    }
                );

                return;
            }

            // =========================
            // LOGGED IN
            // =========================

            const existingItem =
                items.find(
                    item =>
                        item.product
                            ._id ===
                        productId
                );

            if (
                !existingItem ||
                !existingItem.cartItemId
            ) {
                return;
            }

            const response =
                await api.put(
                    `/cart/${existingItem.cartItemId}`,
                    {
                        quantity:
                            numericQuantity
                    }
                );

            setItems(
                normalizeServerCart(
                    response.data.cart
                )
            );
        };

    // =========================
    // REMOVE ITEM
    // =========================

    const removeFromCart =
        async (
            productId
        ) => {
            // =========================
            // GUEST
            // =========================

            if (!user) {
                setItems(
                    currentItems => {
                        const updatedItems =
                            currentItems.filter(
                                item =>
                                    item
                                        .product
                                        ._id !==
                                    productId
                            );

                        saveGuestCart(
                            updatedItems
                        );

                        return updatedItems;
                    }
                );

                return;
            }

            // =========================
            // LOGGED IN
            // =========================

            const existingItem =
                items.find(
                    item =>
                        item.product
                            ._id ===
                        productId
                );

            if (
                !existingItem ||
                !existingItem.cartItemId
            ) {
                return;
            }

            const response =
                await api.delete(
                    `/cart/${existingItem.cartItemId}`
                );

            setItems(
                normalizeServerCart(
                    response.data.cart
                )
            );
        };

    // =========================
    // CLEAR CART
    // =========================

    const clearCart =
        async () => {
            // =========================
            // GUEST
            // =========================

            if (!user) {
                localStorage.removeItem(
                    GUEST_STORAGE_KEY
                );

                setItems([]);

                return;
            }

            // =========================
            // LOGGED IN
            // =========================

            try {
                await api.delete(
                    "/cart"
                );
            } catch (error) {
                console.error(
                    "Clear server cart error:",
                    error
                );
            }

            setItems([]);
        };

    // =========================
    // REFRESH CART
    // =========================

    const refreshCart =
        async () => {
            if (user) {
                return fetchServerCart();
            }

            const guestItems =
                readGuestCart();

            setItems(
                guestItems
            );

            return guestItems;
        };

    // =========================
    // ITEM COUNT
    // =========================

    const itemCount =
        useMemo(
            () =>
                items.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        Number(
                            item.quantity ||
                                0
                        ),
                    0
                ),
            [items]
        );

    // =========================
    // SUBTOTAL
    // =========================

    const subtotal =
        useMemo(
            () =>
                items.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        Number(
                            item.product
                                ?.price ||
                                0
                        ) *
                            Number(
                                item.quantity ||
                                    0
                            ),
                    0
                ),
            [items]
        );

    return (
        <CartContext.Provider
            value={{
                items,
                itemCount,
                subtotal,
                cartLoading,

                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                refreshCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(
        CartContext
    );
};