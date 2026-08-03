import {
    useEffect,
    useState
} from "react";
import dragonFruitHero from "../../assets/images/dragon-fruit-hero.png";
import {
    Minus,
    Plus,
    ShoppingBag,
    Sparkles
} from "lucide-react";

import {
    motion
} from "framer-motion";

import toast from "react-hot-toast";

import api from "../../services/api";

import {
    useCart
} from "../../context/CartContext";

import "./products.css";

export default function Products() {
    const {
        addToCart
    } = useCart();

    const [
        products,
        setProducts
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        quantities,
        setQuantities
    ] = useState({});

    const loadProducts =
        async () => {
            try {
                setLoading(
                    true
                );

                const response =
                    await api.get(
                        "/products"
                    );

                const list =
                    response.data
                        .products ||
                    [];

                setProducts(
                    list
                );

                const initialQuantities =
                    {};

                list.forEach(
                    product => {
                        initialQuantities[
                            product._id
                        ] = 1;
                    }
                );

                setQuantities(
                    initialQuantities
                );
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to load products."
                );
            } finally {
                setLoading(
                    false
                );
            }
        };

    useEffect(() => {
        loadProducts();
    }, []);

    const changeQuantity = (
        productId,
        amount,
        stock
    ) => {
        setQuantities(
            current => {
                const currentValue =
                    Number(
                        current[
                            productId
                        ] || 1
                    );

                let next =
                    currentValue +
                    amount;

                if (
                    next <
                    1
                ) {
                    next = 1;
                }

                if (
                    stock > 0 &&
                    next >
                        stock
                ) {
                    next =
                        stock;
                }

                return {
                    ...current,

                    [productId]:
                        next
                };
            }
        );
    };

const handleAdd =
    async (
        product
    ) => {
        const quantity =
            Number(
                quantities[
                    product._id
                ] || 1
            );

        if (
            !product.isAvailable
        ) {
            toast.error(
                "This product is currently unavailable."
            );

            return;
        }

        if (
            product.stock ===
            0
        ) {
            toast.error(
                "This product is out of stock."
            );

            return;
        }

        try {
            await addToCart(
                product,
                quantity
            );

            toast.success(
                `${product.name} added to cart.`
            );
        } catch (error) {
            toast.error(
                error.response?.data
                    ?.message ||
                    "Unable to add product to cart."
            );
        }
    };

    if (loading) {
        return (
            <div className="products-loading">
                <div className="products-loader" />

                <span>
                    Loading products...
                </span>
            </div>
        );
    }

    return (
        <section className="products-page">
            <div className="products-glow products-glow-left" />
            <div className="products-glow products-glow-right" />

            <div className="products-container">
                <motion.div
                    className="products-header"
                    initial={{
                        opacity: 0,
                        y: 20
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                >
                    <div className="products-badge">
                        <Sparkles
                            size={
                                15
                            }
                        />

                        Fresh Selection
                    </div>

                    <h1>
                        Explore our
                        <span>
                            {" "}
                            products.
                        </span>
                    </h1>

                    <p>
                        Choose your quantity,
                        add products to your cart
                        and place your order when
                        you're ready.
                    </p>
                </motion.div>

                {products.length ===
                0 ? (
                    <div className="products-empty">
                        <ShoppingBag
                            size={
                                38
                            }
                        />

                        <h3>
                            No products
                            available
                        </h3>

                        <p>
                            Products will
                            appear here once
                            they are added.
                        </p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map(
                            (
                                product,
                                index
                            ) => (
                                <motion.article
                                    key={
                                        product._id
                                    }
                                    className="product-card"
                                    initial={{
                                        opacity:
                                            0,

                                        y:
                                            25
                                    }}
                                    animate={{
                                        opacity:
                                            1,

                                        y:
                                            0
                                    }}
                                    transition={{
                                        delay:
                                            index *
                                            0.07
                                    }}
                                    whileHover={{
                                        y:
                                            -7
                                    }}
                                >
                                    <div className="product-image-area">
    <img
    src={
        product.slug === "dragon-fruit"
            ? dragonFruitHero
            : product.images &&
              product.images.length > 0
            ? product.images[0]
            : dragonFruitHero
    }
    alt={product.name}
/>

    {product.isFeatured && (
        <span className="featured-chip">
            Featured
        </span>
    )}
</div>

                                    <div className="product-content">
                                        <div className="product-top-row">
                                            <div>
                                                <span className="product-category">
                                                    {product.category ||
                                                        "Product"}
                                                </span>

                                                <h2>
                                                    {
                                                        product.name
                                                    }
                                                </h2>
                                            </div>

                                            <div className="product-price">
                                                ₹
                                                {
                                                    product.price
                                                }

                                                <span>
                                                    /
                                                    {
                                                        product.unit
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        <p className="product-description">
                                            {product.shortDescription ||
                                                product.description ||
                                                "Fresh product available for ordering."}
                                        </p>

                                       <div className="product-status-row">
    <span
        className={
            product.isAvailable &&
            product.stock !== 0
                ? "stock-status available"
                : "stock-status unavailable"
        }
    >
        {product.isAvailable &&
        product.stock !== 0
            ? "Available"
            : "Unavailable"}
    </span>
</div>

                                        <div className="product-actions">
                                            <div className="quantity-control">
                                                <button
                                                    onClick={() =>
                                                        changeQuantity(
                                                            product._id,
                                                            -1,
                                                            product.stock
                                                        )
                                                    }
                                                >
                                                    <Minus
                                                        size={
                                                            15
                                                        }
                                                    />
                                                </button>

                                                <span>
                                                    {quantities[
                                                        product
                                                            ._id
                                                    ] ||
                                                        1}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        changeQuantity(
                                                            product._id,
                                                            1,
                                                            product.stock
                                                        )
                                                    }
                                                >
                                                    <Plus
                                                        size={
                                                            15
                                                        }
                                                    />
                                                </button>
                                            </div>

                                            <button
                                                className="add-cart-button"
                                                onClick={() =>
                                                    handleAdd(
                                                        product
                                                    )
                                                }
                                                disabled={
                                                    !product.isAvailable ||
                                                    product.stock ===
                                                        0
                                                }
                                            >
                                                <ShoppingBag
                                                    size={
                                                        17
                                                    }
                                                />

                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </motion.article>
                            )
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}