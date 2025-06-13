import mongoose from "mongoose";
export const connectDB =async()=>{
    await mongoose.connect('mongodb+srv://jaisx:%23Arshmeet12@cluster0.co5uwjq.mongodb.net/food-del').then(()=>console.log("DB Connected"))
}