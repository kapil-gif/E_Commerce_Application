import fetchdata from "../models/fetchproducts.model..js";

export const fetchproducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const allproducts = await fetchdata(offset, limit);
        //console.log("all product fetch constolerr: ", allproducts);

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "All Products",
            allproducts
        });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to fetch products"
        });
    }
};
