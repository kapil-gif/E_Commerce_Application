import pool from "../config/DbConnection.config.js";



export function productOrder(user_Id) {

    //insert the order_items data 
    const orderItemquery = `INSERT INTO order_items (user_id, product_id, product_title, product_img, quantity, price)
SELECT 
    c.userId, 
    c.productId, 
    p.title, 
    p.img,             
    c.quantity, 
    p.price
FROM cart c
JOIN products p ON c.productId = p.id
WHERE c.userId = ?;
`
    // console.log("prodcy order in model user id :", user_Id);

    return new Promise((resolve, reject) => {
        pool.execute(orderItemquery, [user_Id], (err, result) => {
            if (err) {
                console.log(err);
                return reject(err)
            }
            //  console.log(result);
            return resolve(result);

        })
    })

}

export async function fetchMyorder(user_id) {
    const fetchproductByuserID = `select * from order_items where user_id=?`;
    // console.log("order model user id :", user_id);

    return new Promise((resolve, reject) => {
        pool.query(fetchproductByuserID, [user_id], (err, result) => {
            if (err) {
                console.log("err in model :", err);
                return reject(err)
            }
            // console.log("result :", result);
            return resolve(result)
        });
    })
}


export async function comformationOrder(detials) {
    const conformationorderdetils = `INSERT INTO orders (user_id, total_amount, payment_method, shipping_address, billing_address)
VALUES (?, ?, ?, ?, ?);`
    return new Promise((resolve, reject) => {
        const user_id = detials.user_id;
        const total_amount = detials.total_amount;
        const payment_method = detials.payment_method;
        const shipping_address = detials.shipping_address;
        const billing_address = detials.billing_address;

        //`model  in : user_id: ${user_id}, total_amount: ${total_amount}, payment_method: ${payment_method}, shipping_address: ${shipping_address}, billing_address: ${billing_address}`);

        pool.execute(conformationorderdetils, [user_id, total_amount, payment_method, shipping_address, billing_address],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                // console.log("confromation Api respoce result model:", result);

                return resolve(result)
            })
    })
}


export async function insertorderdata(details) {
    // console.log("details in indert order :", details);

    const insertQuery = `
        INSERT INTO order_items (
            order_id,
            user_id,
            product_id,
            product_title,
            product_img,
            quantity,
            price
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const selectQuery = `
      SELECT 
    orders.id AS order_id,
    orders.user_id,
    user.full_name,
    user.last_name,
    user.email,
    user.mobile_no,
    orders.shipping_address,
    orders.billing_address,
    orders.payment_method,
    orders.total_amount,
    order_items.product_id,
    order_items.product_title,
    order_items.product_img,
    order_items.quantity,
    order_items.price,
    order_items.total,
    products.title AS product_title,
    products.price AS product_price,
    products.img AS product_img,
    products.brand,
    products.category
FROM orders
JOIN user ON orders.user_id = user.id
JOIN order_items ON orders.id = order_items.order_id
JOIN products ON order_items.product_id = products.id
WHERE orders.id = ?`
        ;


    const {
        order_id,
        user_id,
        product_id,
        product_title,
        product_img,
        quantity,
        price
    } = details;

    return new Promise((resolve, reject) => {
        // Step 1: Insert the order item
        pool.execute(
            insertQuery,
            [order_id, user_id, product_id, product_title, product_img, quantity, price],
            (err, result) => {
                if (err) {
                    console.error("DB Insert Error:", err);
                    return reject(err);
                }

                // Step 2: Run the SELECT query for full user + product + order info
                pool.execute(selectQuery, [order_id], (selectErr, selectResult) => {
                    if (selectErr) {
                        console.error("DB Select Error:", selectErr);
                        return reject(selectErr);
                    }

                    // Send both insert result and full data
                    return resolve({
                        insertResult: result,
                        fulluserdata: selectResult
                    });
                });
            }
        );
    });
}




export async function fetchsigledataorder(order_id) {
    const fetchproductByuserID = `SELECT
  oi.*,
  o.user_id AS order_user_id,
  o.total_amount,
  o.payment_method,
  o.shipping_address,
  o.billing_address
FROM order_items AS oi
JOIN orders AS o
  ON oi.order_id = o.id
WHERE oi.order_id = ?;
`;
    // console.log("order model order  id :", order_id);

    return new Promise((resolve, reject) => {
        pool.query(fetchproductByuserID, [order_id], (err, result) => {
            if (err) {
                console.log("err in model :", err);
                return reject(err)
            }
            //console.log("result :", result);
            return resolve(result)
        });
    })
}


export async function orderCancle(order_id) {
    const fetchproductByuserID = `DELETE FROM order_items WHERE order_id = ?`;
    //  console.log("order model user id :", order_id);

    return new Promise((resolve, reject) => {
        pool.query(fetchproductByuserID, [order_id], (err, result) => {
            if (err) {
                console.log("err in model :", err);
                return reject(err)
            }
            //console.log("result :", result);
            return resolve(result)
        });
    })
}


export async function removeCartorderSuccesss(product_id) {
    // console.log("cart id remove sucesss order in cart in model :", product_id);

    const deletesuucesuery = `DELETE FROM cart WHERE productId =?`

    return new Promise((resolve, reject) => {
        pool.query(deletesuucesuery, [product_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        })
    })
}