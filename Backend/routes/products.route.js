import express from "express"
import { fetchproducts } from "../Controller/Allproducts.controller.js"
import { detailfecth } from '../Controller/fetchdetails.controller.js'
import { carts, fetchcarts, removeproduct, updatedProductQuantity } from "../Controller/addtoCarts.controller.js"
import { verifyToken } from "../middleware/auth.middleware.js"
import { orderAllproduct, fetchorder, fetchsingleorder } from "../Controller/Order.controller.js"
import { checkRole } from "../middleware/checkRole.js"

const routes = express.Router();
routes.get("/fetchproducts", verifyToken, fetchproducts);

//routes.get('/fetchproducts', verifyToken, fetchproducts)   //all product fect on databse show the fe
routes.post('/fecthdetails', verifyToken, detailfecth);                 //fecth product detials clickon product
routes.post('/addtocart', verifyToken, carts);                          //add to cart insert the database
routes.get('/fetchcart', verifyToken, fetchcarts);         // fecth carts product on show the frontend
routes.delete('/removeProductOnCart', verifyToken, removeproduct);
routes.put('/updatequantity', verifyToken, updatedProductQuantity); //update quntity
routes.post('/order', verifyToken, orderAllproduct);
routes.get('/fetchMyorder', verifyToken, fetchorder);
routes.get('/fetchsingleproductdetials', verifyToken, fetchsingleorder)


export default routes;












