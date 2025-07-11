import { addtowishmodel, removewishlistmodel, fetchwishlistproduct, fetchdetailsOrder } from "../models/wishlist.models.js";

export const AddtoWishlist = async (req, res) => {
    const user_id = req.body.userid;
    const product_id = req.body.productid;

    // console.log("wishlist product controller ", user_id, product_id);

    try {
        const responce = await addtowishmodel(user_id, product_id);
        if (responce) {
            return res.status(200).json({
                success: true,
                code: "200",
                message: "Product added to wishlist",
                responce
            });
        }
        return res.status(400).json({
            success: false,
            code: "400",
            message: "Product not added to wishlist"
        });

    } catch (error) {
        console.log("controller err ", error);

        //  Handle duplicate entry error (MySQL error code: ER_DUP_ENTRY = 1062)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                code: "409",
                message: "Duplicate entry: product already in wishlist"
            });
        }
        return res.status(500).json({
            success: false,
            code: "500",
            message: "Internal server error"
        });
    }
};


export const removewishlist = async (req, res) => {
    const user_id = req.body.userid;
    const product_id = req.body.productid;

    //  console.log("remove wishlist product controller", user_id, product_id);
    try {
        // console.log("remove wishlist product ", user_id, product_id);
        const removewishlistApi = await removewishlistmodel(user_id, product_id);

        if (removewishlistApi) {
            return res.status(200).json({
                success: true,
                code: "200",
                message: "Remove Product to wishlist",
                removewishlistApi

            });
        }
        return res.status(500).json({
            success: false,
            code: "500",
            message: "Remove Product wishlist",
            err
        });
    } catch (error) {
        console.log(error);
    }
}

export const fetchwishlist = async (req, res) => {
    //console.log("fetch the wishlist ");
    const user_id = req.query.user_id;
    //console.log("userid : in controller :", user_id);
    try {
        const fectchwishlistApi = await fetchwishlistproduct(user_id);
        if (fectchwishlistApi) {
            return res.status(200).json({
                success: true,
                code: "200",
                message: "Fetched wishlist successfully",
                fectchwishlistApi  // Normalize
            });

        }
        return res.status(400).json({
            success: false,
            code: "400",
            message: "Product not added to wishlist"
        });

    } catch (error) {
        console.log("controller err ", error);

        //  Handle duplicate entry error (MySQL error code: ER_DUP_ENTRY = 1062)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                code: "409",
                message: "Duplicate entry: product already in wishlist"
            });
        }
        return res.status(500).json({
            success: false,
            code: "500",
            message: "Internal server error"
        });
    }
};

export const fetchorderdetials = async () => {

    try {
        await fetchdetailsOrder();
    } catch (error) {
        console.log("error controller fetchorder details :", error);

    }

}