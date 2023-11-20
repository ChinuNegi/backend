import express from "express";
import * as userController from "../controller/usercontroller.js"
import { signupValidation,loginValidation } from "../middleware/validator.js";




const router=express.Router()

router.post("/save",signupValidation,userController.save)
router.get("/fetch",userController.fetch)
router.delete("/delete",userController.deleteUser)
router.patch('/update',userController.updateUser);
router.post('/login',loginValidation,userController.login);






export default router;