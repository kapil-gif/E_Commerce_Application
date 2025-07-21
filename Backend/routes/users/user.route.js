import express from "express";
import { login, signup, forgetpassword, updatePassword } from "../../Controller/user.controller.js";

const routes = express.Router();

routes.post('/login', login);
routes.post('/signup', signup);
routes.post('/forget-password', forgetpassword);
routes.put('/update_password', updatePassword)
export default routes; 
