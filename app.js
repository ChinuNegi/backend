import express from "express"
import bodyParser from "body-parser"
import userRouter from "./routes/user.router.js"
const app=express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use("/user",userRouter)



app.listen(3001)
console.log("server invoked at port 3001")