import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import 'dotenv/config'
import orderRouter from "./routes/orderRoute.js"
import adminRouter from "./routes/adminRoute.js"


//app config
const app= express()
const port=4000

//middleware
app.use(express.json())
app.use(cors({
  origin: "https://foogroo-delivery.vercel.app", // your Vercel frontend domain
  credentials: true
}));

//db connection
connectDB();
app.get("/",(req,res)=>{
    res.send("API working")
})
import path from 'path';
app.use('/images', express.static(path.join(process.cwd(), 'uploads')));

//app.use('/images', express.static(path.join(process.cwd(), 'uploads')));
//api endpoint
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/admin", adminRouter)

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})
//mongodb+srv://jaisx:#Arshmeet12@cluster0.co5uwjq.mongodb.net/?
