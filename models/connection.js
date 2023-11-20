import mongoose from "mongoose"
const url="mongodb://127.0.0.1:27017/newtask"
mongoose.connect(url)
console.log("mongodb connected successfully")