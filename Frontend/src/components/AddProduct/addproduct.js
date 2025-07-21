import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './addproduct.css';
import Navbar from "../Navbar/Navbar";
function AddProduct() {
    const token = localStorage.getItem("authtoken");
    const navigate = useNavigate();

    const [customCategory, setCustomCategory] = useState(false);
    const [errors, setErrors] = useState({});
    const [productData, setProductData] = useState({
        title: '',
        brand: '',
        description: '',
        category: '',
        price: '',
        discount: '',
        rating: '',
        thumbnail: null,
        images: []
    });

    const validate = () => {
        const err = {};
        if (!/^[a-zA-Z0-9\s]{3,50}$/.test(productData.title)) {
            err.title = "Title must be 3-50 characters with letters/numbers only.";
        }
        if (!/^[\w\s.,!()'-]{10,300}$/.test(productData.description)) {
            err.description = "Description must be 10–300 characters with valid punctuation.";
        }
        if (!productData.price || Number(productData.price) <= 0) {
            err.price = "Price must be a positive number.";
        }
        if (productData.discount && Number(productData.discount) < 0) {
            err.discount = "Discount cannot be negative.";
        }
        if (productData.rating && (Number(productData.rating) < 0 || Number(productData.rating) > 5)) {
            err.rating = "Rating must be between 0 and 5.";
        }
        if (!productData.thumbnail) {
            err.thumbnail = "Thumbnail is required.";
        }
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleThumbnailChange = (e) => {
        setProductData(prev => ({
            ...prev,
            thumbnail: e.target.files[0]
        }));
    };

    const handleImagesChange = (e) => {
        setProductData(prev => ({
            ...prev,
            images: Array.from(e.target.files)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const formData = new FormData();
        for (const key in productData) {
            if (key === 'images') {
                productData.images.forEach(img => formData.append("images", img));
            } else {
                formData.append(key, productData[key]);
            }
        }

        try {
            const res = await axios.post('http://localhost:8080/addproduct/newproduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("🎉 Product added successfully!");
            navigate('/admin/myporducts');


        } catch (err) {
            // if (err.data.error === "ER_WARN_DATA_OUT_OF_RANGE" || err.code === 'ER_WARN_DATA_OUT_OF_RANGE') {
            //     toast.info("⚠️ Discount value is out of allowed range.");
            // }

            console.error("error in fronthend ",);
            toast.error(err.response.data.error);
        }
    };

    return (
        <>
            <Navbar fixedTop={true} />

            <div className="container mt-5 add-product-container">
                <div className="card p-4 shadow-lg rounded-4 glass-effect animate-fadeIn">
                    <h2 className="text-center text-gradient mb-4">🛒 Add New Product</h2>

                    <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Title <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    name="title"
                                    className={`form-control shadow-sm ${errors.title ? 'is-invalid' : ''}`}
                                    value={productData.title}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Brand <span className="text-danger">*</span></label>
                                <input type="text" name="brand" className="form-control shadow-sm" value={productData.brand} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Description <span className="text-danger">*</span></label>
                            <textarea
                                name="description"
                                className={`form-control shadow-sm ${errors.description ? 'is-invalid' : ''}`}
                                rows="3"
                                value={productData.description}
                                onChange={handleChange}
                                required
                            />
                            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">Category <span className="text-danger">*</span></label>
                                <select
                                    name="category"
                                    className="form-select shadow-sm"
                                    value={customCategory ? "other" : productData.category}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setCustomCategory(value === "other");
                                        setProductData(prev => ({
                                            ...prev,
                                            category: value === "other" ? "" : value
                                        }));
                                    }}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="fashion">Fashion</option>
                                    <option value="home">Home</option>
                                    <option value="books">Books</option>
                                    <option value="other">Other</option>
                                </select>

                                {customCategory && (
                                    <input
                                        type="text"
                                        name="customCategory"
                                        className="form-control mt-2 shadow-sm"
                                        placeholder="Enter custom category"
                                        value={productData.category}
                                        onChange={(e) =>
                                            setProductData(prev => ({
                                                ...prev,
                                                category: e.target.value
                                            }))
                                        }
                                        required
                                    />
                                )}
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Price (₹) <span className="text-danger">*</span></label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="price"
                                    className={`form-control shadow-sm ${errors.price ? 'is-invalid' : ''}`}
                                    value={productData.price}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Discount Price (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="discount"
                                    className={`form-control shadow-sm ${errors.discount ? 'is-invalid' : ''}`}
                                    value={productData.discount}
                                    onChange={handleChange}
                                />
                                {errors.discount && <div className="invalid-feedback">{errors.discount}</div>}
                            </div>
                        </div>

                        <div className="row mb-3">

                            <div className="col-md-6">
                                <label className="form-label">Thumbnail Image <span className="text-danger">*</span></label>
                                <input type="file" className={`form-control shadow-sm ${errors.thumbnail ? 'is-invalid' : ''}`} accept="image/*" onChange={handleThumbnailChange} required />
                                {errors.thumbnail && <div className="invalid-feedback">{errors.thumbnail}</div>}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Additional Images</label>
                            <input type="file" className="form-control shadow-sm" accept="image/*" multiple onChange={handleImagesChange} />
                        </div>

                        <div className="text-center mt-4">
                            <button type="submit" className="btn btn-gradient w-50 fw-bold shadow animate-bounce">
                                <i className="bi bi-plus-circle me-2"></i> Add Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AddProduct;
