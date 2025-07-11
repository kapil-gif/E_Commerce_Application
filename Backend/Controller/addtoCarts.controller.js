import { addtocart, checkProductInCart, fetchcart, removeproductOncart, updatedQuantity } from "../models/addToCart.js";

export const carts = async (req, res) => {
    try {
        const { product_id, user_id, quantity } = req.body;
        // console.log("request body :", req.body);
        // const product_id = req.body.user_Id
        const pprice = Number(req.body.price);
        // console.log("procut price ", pprice);

        //console.log(`product_id : ${product_id}, user_id : ${user_id}, quantity: ${quantity} price :${pprice}`);

        // Check if product is already in cart
        const exists = await checkProductInCart(user_id, product_id);
        if (exists) {
            return res.status(409).json({
                success: false,
                message: "Product already in cart"
            });
        }

        //  Add to cart if not exists
        const result = await addtocart({ user_id, product_id, quantity, pprice });
        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            result
        });

    } catch (error) {
        console.error("Add to cart error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

export const fetchcarts = async (req, res) => {
    const user_id = req.user.id;

    try {
        const fetchproducts = await fetchcart(user_id);
        return res.status(200).json({
            success: true,
            code: "200",
            message: "Cart fetched",
            products: fetchproducts,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            code: "500",
            message: "Error fetching cart",
            error,
        });
    }
};

export const removeproduct = (req, res) => {
    try {
        const cart_id = req.query.cart_id;
        // console.log("remove product on cart in controller", cart_id);
        removeproductOncart(cart_id);
        return res.status(200).json({
            success: true, code: "200", message: "procust remove on cart"
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            code: "500",
            message: "Not remove the product",
            error,
        });
    }


}
export const updatedProductQuantity = async (req, res) => {
    // console.log("update quntity critencial :", req.body);

    try {
        const { newQuantity, cart_id, user_Id } = req.body;

        //"Request body in controller:", req.body);

        const user_id = Number(user_Id);
        const quantity = newQuantity;

        // console.log("user id in controller after conversion:", user_id, quantity);
        // console.log("after change:", quantity, cart_id, user_id);

        if (!user_id || !cart_id || !quantity) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        await updatedQuantity(quantity, cart_id, user_id);

        return res.status(200).json({
            success: true,
            code: "200",
            message: "Quantity updated successfully"
        });

    } catch (error) {
        console.error("Error updating quantity:", error);
        return res.status(500).json({
            success: false,
            code: "500",
            message: "Failed to update quantity",
            error
        });
    }
};
;


