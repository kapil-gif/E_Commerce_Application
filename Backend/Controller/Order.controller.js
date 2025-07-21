import { productOrder, fetchMyorder, comformationOrder, insertorderdata, fetchsigledataorder, orderCancle, removeCartorderSuccesss } from "../models/order.model.js"
import { sendEmailToUser } from "../utils/sendEmail.js"

export const orderAllproduct = async (req, res) => {
    try {
        const user_Id = req.body.user_id;
        //console.log("request body :", req.body);

        const orderAllresponce = await productOrder(user_Id);
        // console.log("orderAllresponce", orderAllresponce);

        if (orderAllresponce) {
            return res.status(200).json({
                success: true,
                code: "200",
                message: "Your Order added",
                orderAllresponce
            });
        }

        return res.status(500).json({
            success: false,
            code: "500",
            message: "Your Order failed"
        });

    } catch (err) {
        console.error("Error placing order:", err);
        return res.status(500).json({
            success: false,
            code: "500",
            message: "Internal server error",
            error: err.message
        });
    }
};

export const fetchorder = async (req, res) => {
    try {
        const user_id = req.query.userid;
        // console.log("Query fetch order id:", req.query);

        const fetchOrder = await fetchMyorder(user_id); // Flat array

        if (!fetchOrder || fetchOrder.length === 0) {
            return res.status(404).json({
                success: false,
                code: "404",
                message: "No orders found for this user."
            });
        }

        // ✅ Grouping by order_id
        const groupedOrders = {};

        fetchOrder.forEach(orderItem => {
            const orderId = orderItem.order_id;

            if (!groupedOrders[orderId]) {
                groupedOrders[orderId] = {
                    order_id: orderId,
                    user_id: orderItem.user_id,
                    created_at: orderItem.created_at,
                    products: []
                };
            }

            groupedOrders[orderId].products.push({
                id: orderItem.id,
                product_id: orderItem.product_id,
                product_title: orderItem.product_title,
                product_img: orderItem.product_img,
                quantity: orderItem.quantity,
                price: orderItem.price,
                total: orderItem.total
            });
        });

        // Convert object to array
        const groupedOrdersArray = Object.values(groupedOrders);

        return res.status(200).json({
            success: true,
            code: "200",
            message: "Your grouped order list",
            orders: groupedOrdersArray
        });

    } catch (error) {
        console.error("Error in fetchorder controller:", error);
        return res.status(500).json({
            success: false,
            code: "500",
            message: "Failed to fetch your order list",
            error: error.message
        });
    }
};


export const comformorder = async (req, res) => {
    try {
        const details = req.body;
        // console.log("req body", req.body);

        const responce = await comformationOrder(details);

        if (responce) {
            // const emailData = {
            //     // pass all cart products
            //     product_adresss: {
            //         shipping_address: details.shipping_address,
            //         billing_address: details.billing_address,
            //         payment_method: details.payment_method,
            //         total_amount: details.total_amount
            //     }
            // };
            // console.log("email deta :", emailData);

            // await sendEmailToUser(emailData);

            return res.status(200).json({
                success: true,
                code: "200",
                message: "Your order successfully placed",
                responce
            });
        }
    } catch (error) {
        console.log("Confirmation Order error: ", error);
        res.status(500).json({
            success: false,
            code: "500",
            message: "Your order was not successful",
            error
        });
    }
};


export const insertorder = async (req, res) => {
    try {
        let items = req.body;
        // console.log("req body insert he order: ", req.body);

        if (!Array.isArray(items)) items = [items];
        if (items.length === 0) {
            return res.status(400).json({ success: false, message: "No order items" });
        }

        const results = [];

        for (const item of items) {
            //console.log("temas of insertorder :", item);

            const result = await insertorderdata(item);
            results.push(result); // collect each insert result

            // Optional: Send one email per item, or combine later
            await sendEmailToUser(result.fulluserdata);
        }

        // Respond after all items are inserted
        return res.status(200).json({
            success: true,
            message: "Order items inserted successfully",
            data: results
        });

    } catch (error) {
        console.error("Insert order items error:", error);
        return res.status(500).json({ success: false, message: "Order not successful", error });
    }
};



export const fetchsingleorder = async (req, res) => {
    try {
        const order_id = req.query.orderItemId;
        //console.log("user id in fecthOrder controller :", order_id);
        const fetchOrder = await fetchsigledataorder(order_id);
        //console.log("Fetech Api response backend Controller: ", fetchOrder);

        if (fetchOrder) {
            return res.status(200).json({
                success: true,
                code: "200",
                message: "your order list",
                fetchOrder
            })
        } else {
            return res.status(500).json({
                success: false,
                code: "500",
                message: "feild fetch your order list",
                err
            })
        }
    } catch (error) {
        console.log(error);

    }

}

export const cancleOrder = async (req, res) => {
    try {
        const order_id = req.query.orderId;
        //console.log("order id in cancleOrder controller :", order_id);
        const cancleOrderRes = await orderCancle(order_id);
        // console.log("Fetech Api response : ", cancleOrderRes);

        if (cancleOrderRes) {
            return res.status(200).json({
                success: true,
                code: "200",
                message: "your order cancle",
                cancleOrderRes
            })
        } else {
            return res.status(500).json({
                success: false,
                code: "500",
                message: " your order not cancle",
                err
            })
        }
    } catch (error) {
        console.log(error);

    }

}


export const orderSuccRemoveCart = async (req, res) => {
    try {
        // console.log("cart_id in controller : ", req.body);
        const product_id = req.body.product_id;
        const deletesuucessOrder = await removeCartorderSuccesss(product_id);

        if (deletesuucessOrder) {
            res.status(200).json({
                success: true,
                code: "200",
                message: "remove on cart after order successfull",
                deletesuucessOrder
            })
        } else {
            res.status(500).json({
                success: false,
                code: "500",
                message: " Not remove on cart after order successfull",
                error
            })
        }

    } catch (error) {
        console.log(" success order remove cart order : ", error);

    }
}