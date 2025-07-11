import pool from "../config/DbConnection.config.js"


export function fecthdetails(product_id) {
    // console.log("product id in model : ", product_id);

    const selectquery = "select * from products where id=?"
    return new Promise((resolve, reject) => {
        pool.query(selectquery, [product_id.id], (err, result) => {
            if (err) {
                console.log("Db error ", err);
                return reject(err)
            }
            resolve(result)
        });
    });

}



















