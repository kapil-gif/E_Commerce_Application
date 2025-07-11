import { searchCaterogry } from "../models/search.model.js";

export const searchbotton = async (req, res) => {
    try {
        // console.log(" request body : ", req.query.category);

        const category = req.query.category;
        // console.log("Category in search controller:", category);

        const results = await searchCaterogry(category);

        if (results && results.length > 0) {
            return res.status(200).json({
                success: true,
                code: "200",
                message: "Products found for the given category",
                data: results,
            });
        } else {
            return res.status(404).json({
                success: false,
                code: "404",
                message: "No products found for the given category",
            });
        }

    } catch (error) {
        console.error("Error in search box:", error.message);
        return res.status(500).json({
            success: false,
            code: "500",
            message: "Failed to search product",
            error: error.message,
        });
    }
};
