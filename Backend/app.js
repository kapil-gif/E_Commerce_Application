import express from "express"
import dotenv from "dotenv"
import userroutes from "./routes/user.route.js"
import productsroutes from "./routes/products.route.js"
import cors from "cors";
import Wishlistroutes from "./routes/wishlist.route.js";
import orders from "./routes/order.routes.js"
import profileupdate from "./routes/profile.routes.js";
import addproduct from "./routes/addproduct.routes.js"
import path from "path"
import { fileURLToPath } from "url";
import admin from "./routes/admin.routes.js"
//import adminRoutes from './routes/admin.routes.js'; // ✅ CORRECT

//import { insertDummyProducts } from "./models/insertDummyApi.model.js";
dotenv.config();//usingt the env file 

const app = express();
const port = process.env.port || 8080;

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/Images', express.static(path.join(__dirname, 'public/Images')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) //test on postman send data on body>json
//insertDummyProducts();
app.use('/user', userroutes);
app.use('/products', productsroutes);
app.use('/wishlistproduct', Wishlistroutes)
app.use('/order', orders);
app.use('/profile', profileupdate); //searchbox
app.use('/addproduct', addproduct);
app.use('/admin', admin);

app.listen(port, (req, res) => {
    console.log(`Server run on : http://localhost:${port}`);

});