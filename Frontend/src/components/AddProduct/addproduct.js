import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function AddProduct() {

    const token = localStorage.getItem("authtoken");

    const navigate = useNavigate();
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

    // Generic text input handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle thumbnail file
    const handleThumbnailChange = (e) => {
        setProductData((prevData) => ({
            ...prevData,
            thumbnail: e.target.files[0]
        }));
    };

    // Handle multiple images
    const handleImagesChange = (e) => {
        setProductData((prevData) => ({
            ...prevData,
            images: Array.from(e.target.files)
        }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", productData.title);
        formData.append("brand", productData.brand);
        formData.append("description", productData.description);
        formData.append("category", productData.category);
        formData.append("price", productData.price);
        formData.append("discount", productData.discount);
        formData.append("rating", productData.rating);

        // Append thumbnail "images" matches field name
        if (productData.thumbnail) {
            formData.append("thumbnail", productData.thumbnail);
        }
        productData.images.forEach(img => {
            formData.append("images", img);
        });


        try {
            for (let [key, value] of formData.entries()) {
                //  console.log(` product data  ${key}:`, value);
            }
            const res = await axios.post('http://localhost:8080/addproduct/newproduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Product added successfully");
            //console.log("API Response:", res.data);
            navigate('/dashboard')
        } catch (err) {
            console.error("API Error:", err);
            toast.error(err);
        }
    };


    return (
        <>
            <Navbar fixedTop={true} />
            <div className="container mt-5 add-product-form">
                <h2 className="text-center mb-4">Add New Product</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Title</label>
                            <input type="text" name="title" className="form-control" value={productData.title} onChange={handleChange} placeholder="Enter product title" required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Brand</label>
                            <input type="text" name="brand" className="form-control" value={productData.brand} onChange={handleChange} placeholder="Enter brand name" required />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea name="description" className="form-control" rows="3" value={productData.description} onChange={handleChange} placeholder="Write a brief description" required></textarea>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label">Category</label>
                            <select name="category" className="form-select" value={productData.category} onChange={handleChange} required>
                                <option value="">Select</option>
                                <option value="electronics">Electronics</option>
                                <option value="fashion">Fashion</option>
                                <option value="home">Home</option>
                                <option value="books">Books</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Price (₹)</label>
                            <input type="number" name="price" className="form-control" value={productData.price} onChange={handleChange} placeholder="e.g. 499" required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Discount Price (₹)</label>
                            <input type="number" name="discount" className="form-control" value={productData.discount} onChange={handleChange} placeholder="e.g. 349" />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Rating (0–5)</label>
                            <input type="number" name="rating" className="form-control" value={productData.rating} onChange={handleChange} step="0.1" max="5" placeholder="e.g. 4.5" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Thumbnail Image</label>
                            <input type="file" className="form-control" accept="image/*" onChange={handleThumbnailChange} required />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Additional Images</label>
                        <input type="file" className="form-control" multiple accept="image/*" onChange={handleImagesChange} />
                    </div>

                    <button type="submit" className="btn btn-primary w-50  d-block mx-auto" >
                        Add Product
                    </button>
                </form>
            </div>
        </>
    );
}

export default AddProduct;
