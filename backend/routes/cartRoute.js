import express from "express"
import {addToCart,removeFromCart,getCart} from "../controllers/cartController.js"
import multer from "multer"
import fs from "fs"
import authMiddleware from "../middleware/auth.js";
const cartRouter = express.Router();

// Image storage engine
//const storage = multer.diskStorage({
//    destination: "uploads",
 //   filename: (req, file, cb) => {
 //       return cb(null, `${Date.now()}-${file.originalname}`); // ✅ Correct use of backticks
 //   }
//});

//const upload = multer({ storage: storage });
import userAuth from "../middleware/userAuth.js";

cartRouter.post("/add", userAuth, addToCart);
cartRouter.post("/remove", userAuth, removeFromCart);
cartRouter.post("/get", userAuth, getCart);


export default cartRouter;
