import { createContext, useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./carts.css";
import { toast } from "react-toastify";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import nprogress from "nprogress";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';

export const CartContext = createContext();

function Carts() {
    window.bootstrap = bootstrap;
    const user_Id = localStorage.getItem("userId");
    const token = localStorage.getItem("authtoken");
    const navigate = useNavigate();

    const [Cartproducts, setCartproducts] = useState([]);
    const { setCartCount } = useContext(CartContext);
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [productToRemove, setProductToRemove] = useState(null);

    const totalQuantity = Cartproducts.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = Cartproducts.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    useEffect(() => {
        async function fetchCart() {
            try {
                NProgress.start();
                const res = await axios.get('http://localhost:8080/products/fetchcart', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { user_id: user_Id }
                });

                let cartItems = res.data.products.map(item => ({
                    ...item,
                    img: typeof item.img === "string" ? JSON.parse(item.img) : item.img
                }));

                setCartproducts(cartItems);
                setCartCount(cartItems.length);
            } catch (err) {
                console.error(err);
                toast.error("Error fetching cart.");
            } finally {
                NProgress.done();
            }
        }

        fetchCart();
    }, [user_Id]);

    const confirmRemove = (product) => {
        setProductToRemove(product);
        const modal = new window.bootstrap.Modal(document.getElementById("confirmModal"));
        modal.show();
    };

    const removeConfirmedProduct = async () => {
        if (!productToRemove) return;

        try {
            NProgress.start();
            const res = await axios.delete("http://localhost:8080/products/removeProductOnCart", {
                headers: { Authorization: `Bearer ${token}` },
                params: { cart_id: productToRemove.CartID }
            });

            toast.info(res.data.message);

            setCartproducts(prev => {
                const updated = prev.filter(item => item.CartID !== productToRemove.CartID);
                setCartCount(updated.length);
                return updated;
            });

            setSelectedProductIds(prev =>
                prev.filter(id => id !== (productToRemove.id || productToRemove._id))
            );
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Error removing product.");
        } finally {
            setProductToRemove(null);
            NProgress.done();
        }
    };

    const updateCartQuantity = async (newQuantity, cart_id, index) => {
        try {
            NProgress.start();
            if (newQuantity === 0) {
                confirmRemove(Cartproducts[index]);
                return;
            }

            await axios.put('http://localhost:8080/products/updatequantity', {
                user_Id, cart_id, newQuantity
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Failed to update cart:", err);
            toast.error("Failed to update quantity.");
        } finally {
            NProgress.done();
        }
    };

    const Quantityhandling = (type, index) => {
        setCartproducts(products =>
            products.map((item, i) => {
                if (i !== index) return item;
                const newQuantity = type === 'inc' ? item.quantity + 1 : Math.max(0, item.quantity - 1);
                updateCartQuantity(newQuantity, item.CartID, index);
                return { ...item, quantity: newQuantity };
            })
        );
    };

    const handleCheckboxChange = (product) => {
        const productId = product.id || product._id;

        setSelectedProductIds(prev => {
            const updated = prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId];

            setSelectAllChecked(updated.length === Cartproducts.length);
            return updated;
        });
    };

    const selectAll = () => {
        if (selectAllChecked) {
            setSelectedProductIds([]);
            setSelectAllChecked(false);
        } else {
            const allIds = Cartproducts.map(item => item.id || item._id);
            setSelectedProductIds(allIds);
            setSelectAllChecked(true);
        }
    };

    const orderartIteams = () => {
        const selectedItems = Cartproducts.filter(product =>
            selectedProductIds.includes(product.id || product._id)
        );

        const productIds = selectedItems.map(product => product.id || product._id);
        const totalPrice = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

        navigate('/ordercomformation', {
            state: {
                user_id: user_Id,
                product_ids: productIds,
                selectedProducts: selectedItems,
                price: totalPrice
            }
        });
    };

    const selectedItems = Cartproducts.filter(product =>
        selectedProductIds.includes(product.id || product._id)
    );

    const selectedTotalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="root mt-24">
            <Navbar fixedTop={true} />

            {Cartproducts.length === 0 ? (
                <div className="empty-cart-wrapper d-flex flex-column justify-content-center align-items-center vh-100 text-center">
                    <img
                        src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png"
                        alt="Empty Cart"
                        className="empty-cart-img mb-4 animate__animated animate__fadeInDown"
                        style={{ width: "300px", maxWidth: "90%" }}
                    />
                    <h2 className="fw-bold animate__animated animate__fadeInUp animate__delay-1s">Your cart is empty!</h2>
                    <p className="text-muted animate__animated animate__fadeInUp animate__delay-2s">
                        Looks like you haven’t added anything to your cart yet.
                    </p>
                    <a href="/dashboard" className="btn btn-outline-primary mt-3 animate__animated animate__zoomIn animate__delay-3s">
                        Shop Now
                    </a>
                </div>
            ) : (
                <div className="cart-container container mt-4 justify-content-between d-flex">
                    <div className="col-9">
                        <table className="table table-striped table-bordered w-200 shadow-lg bg-white rounded-4 overflow-hidden">
                            <thead className="table-dark">
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={selectAllChecked}
                                            onChange={selectAll}
                                        /> Select All
                                    </th>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Price (₹)</th>
                                    <th>Quantity</th>
                                    <th>Total (₹)</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Cartproducts.map((product, index) => (
                                    <tr key={product._id || index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedProductIds.includes(product.id || product._id)}
                                                onChange={() => handleCheckboxChange(product)}
                                            />
                                        </td>
                                        <td>
                                            <img
                                                src={Array.isArray(product.img) ? product.img[0] : product.img}
                                                alt={product.title}
                                                className="rounded shadow-sm"
                                                style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                            />
                                        </td>
                                        <td>{product.title}</td>
                                        <td>{product.price}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => Quantityhandling('dec', index)}>−</button>
                                                <span>{product.quantity}</span>
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => Quantityhandling('inc', index)}>+</button>
                                            </div>
                                        </td>
                                        <td>{(product.price * product.quantity).toFixed(2)}</td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => confirmRemove(product)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {selectedProductIds.length > 0 && (
                        <div className="order-summary-box alert alert-primary d-flex flex-column justify-content-between align-items-start mt-3 rounded-4 shadow-lg p-4 h-100 animate__animated animate__fadeInRight">
                            <div>
                                <h5 className="fw-bold">Order Summary</h5>
                                <p>Items: {selectedProductIds.length}</p>
                                <p>Total Qty: {totalQuantity}</p>
                                <p>Total Price: ₹{selectedTotalPrice.toFixed(2)}</p>
                            </div>
                            <button onClick={orderartIteams} className="btn btn-success w-100 mt-2">
                                Buy Now
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            <div className="modal fade" id="confirmModal" tabIndex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-warning">
                            <h5 className="modal-title" id="confirmModalLabel">Confirm Removal</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to remove this product from your cart?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={removeConfirmedProduct}>Yes, Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Carts;