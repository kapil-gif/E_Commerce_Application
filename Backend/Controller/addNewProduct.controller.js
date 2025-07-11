
import { AddNewProduct } from "../models/addproduct.model.js"


export const addnewproduct = async (req, res) => {
    try {
        const {
            title,
            brand,
            description,
            category,
            price,
            discount,
            rating
        } = req.body;

        const thumbnail = req.files['thumbnail']?.[0]?.filename || null;
        const images = req.files['images']?.map(file => file.filename) || [];

        const data = {
            title,
            brand,
            description,
            category,
            price,
            discountPercentage: discount,
            thumbnail,
            img: JSON.stringify(images), // store as JSON string or join with comma
            rating
        };
        //console.log("product data in controler : ", data);

        const response = await AddNewProduct(data);
        res.status(200).json({
            success: true,
            message: "Product added successfully",
            result: response
        });

    } catch (err) {
        console.error("Controller error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
