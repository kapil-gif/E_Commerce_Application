import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./product.css";
import Navbar from "../Navbar/Navbar";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function ProductDetails() {
    const { id } = useParams();
    const [productDetails, setProductDetails] = useState([]);
    const [imgs, setImgs] = useState([]);
    const token = localStorage.getItem("authtoken");
    const [mainImg, setMainImg] = useState();
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [selectedImg, setSelectedImg] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        NProgress.start();
        axios
            .post("http://localhost:8080/products/fecthdetails", { id }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                const details = response.data.res_details || [];
                setProductDetails(details);

                const allImgs = details.flatMap((item) => {
                    try {
                        if (Array.isArray(item.img)) return item.img;
                        if (typeof item.img === "string") return JSON.parse(item.img);
                    } catch {
                        return [];
                    }
                });

                setImgs(allImgs);
                if (allImgs.length > 0) {
                    setMainImg(allImgs[0]);
                }
                setLoading(false);
                NProgress.done();
            })
            .catch((err) => {
                console.error("Error fetching product details:", err);
                setLoading(false);
                NProgress.done();
            });
    }, [id, token]);

    const addtoCart = async (product) => {
        const user_id = localStorage.getItem("userId");
        const product_id = parseInt(product.id);
        const qty = 1;
        const productprice = product.price;

        try {
            const res = await axios.post(
                'http://localhost:8080/products/addtocart',
                { product_id, user_id, quantity: qty, price: productprice },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success(res.data.message || "Added to cart successfully!");
        } catch (err) {
            if (err.response?.status === 409) {
                toast.info("This product is already in your cart.");
            } else if (err.response?.status === 401) {
                toast.warn("Please login first.");
            } else {
                toast.error("Failed to add to cart. Try again.");
            }
        }
    };


    const moveconfrompage = (product) => {
        const selectedItem = {
            product_id: product.id || product.product_id,
            title: product.title || product.name,
            img: product.img,
            price: product.price,
            category: product.category,
            user_id: userId,
            quantity: 1
        };

        navigate('/ordercomformation', {
            state: {
                user_id: userId,
                product_ids: [selectedItem.product_id],
                selectedProducts: [selectedItem],
                price: selectedItem.price
            }
        });
    };

    const showimg = (img) => {
        setSelectedImg(getImageUrl(img));
        setShow(true);
    };

    const getImageUrl = (imgPath) => {
        if (!imgPath) return "https://via.placeholder.com/250";
        return imgPath.startsWith("http")
            ? imgPath
            : `http://localhost:8080/Images/${imgPath}`;
    };

    if (loading) {
        return (
            <>
                <Navbar fixedTop={true} />
                <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                    <div className="spinner-border text-primary" role="status" style={{ width: "4rem", height: "4rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar fixedTop={true} />
            <div className="product-details-page">
                <h1 className="text-center mt-5 mb-4">Product Details</h1>
                <div className="container mb-5">
                    <div className="row g-4">
                        {productDetails.map((detail, index) => (
                            <div className="col-12" key={detail._id || index}>
                                <div className="card shadow p-3 flex-md-row flex-column align-items-center product-card">
                                    <img
                                        src={getImageUrl(mainImg)}
                                        alt="Main Product"
                                        className="img-fluid rounded product-image"
                                        onClick={() => showimg(mainImg)}
                                        style={{ maxWidth: "300px", cursor: "pointer" }}
                                    />

                                    <div className="flex-grow-1 ms-md-3 mt-3 mt-md-0">
                                        <h4>{detail.title || detail.name}</h4>
                                        <p>{detail.description || "No description available."}</p>
                                        <p><strong>Category:</strong> {detail.category}</p>
                                        <p><strong>Price:</strong> ₹{detail.price}</p>
                                        {detail.discount_price && (
                                            <p className="text-success">
                                                <strong>Discount Price:</strong> ₹{detail.discount_price}
                                            </p>
                                        )}

                                        {Array.isArray(detail.thumbnails) && detail.thumbnails.length > 0 && (
                                            <div className="mt-2">
                                                <strong>Thumbnails:</strong>
                                                <div className="d-flex flex-wrap gap-2 mt-1">
                                                    {detail.thumbnails.map((thumb, idx) => (
                                                        <img key={idx} src={thumb} alt={`Thumbnail ${idx + 1}`} className="thumbnail" />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-4">
                                            <h5>All Product Images:</h5>
                                            <div className="d-flex flex-wrap gap-2">
                                                {Array.isArray(imgs) && imgs.map((img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={getImageUrl(img)}
                                                        alt={`Image ${idx + 1}`}
                                                        className="img-fluid rounded"
                                                        style={{
                                                            width: "70px",
                                                            height: "70px",
                                                            objectFit: "cover",
                                                            cursor: "pointer",
                                                            border: mainImg === img ? "2px solid #007bff" : "none"
                                                        }}
                                                        onClick={() => setMainImg(img)}
                                                    />
                                                ))}
                                            </div>

                                            <div className="mt-auto d-flex justify-content-between">
                                                <div className="ms-auto d-flex gap-3 mt-3">
                                                    <button className="btn btn-outline-primary" onClick={() => addtoCart(detail)}>
                                                        <i className="bi bi-cart-plus me-2"></i> Add to Cart
                                                    </button>
                                                    <button className="btn btn-primary" onClick={() => moveconfrompage(detail)}>
                                                        <i className="bi bi-lightning-fill me-2"></i> Buy Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal for image preview */}
                {show && (
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        role="dialog"
                        onClick={() => setShow(false)}
                        style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
                    >
                        <div
                            className="modal-dialog modal-dialog-centered"
                            role="document"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content bg-transparent border-0">
                                <div className="modal-body text-center">
                                    <img
                                        src={selectedImg || "https://via.placeholder.com/500"}
                                        alt="Zoomed"
                                        className="img-fluid rounded"
                                        style={{ maxHeight: "90vh" }}
                                    />
                                </div>
                                <div className="modal-footer justify-content-center border-0">
                                    <button className="btn btn-light" onClick={() => setShow(false)}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ProductDetails;
