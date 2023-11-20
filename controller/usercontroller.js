import "../models/connection.js";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator";
import userSchemaModel from "../models/userSchemaModel.js";
import sendEmail from "./email.controller.js";
import config from "../config/config.js"


const createToken = async (id) => {
    try {
        const token = jwt.sign({ _id: id }, config.secrete_Key)
        console.log(token)
        return token;
    } catch (error) {
        res.status(400).json(error.message)
    }
}

const securePassword = async (password) => {
    try {
        const passwordHash = await bcryptjs.hash(password, 10);

        return passwordHash;

    } catch (error) {
        res.send(400).send(error.message)
    }
}
// ..........................................save .................................................
export const save = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        } else {
            let check = await userSchemaModel.findOne({ email: req.body.email });
            if (check)
                res
                    .status(200)
                    .json({ sucess: false, msg: "This email is allready registered" });
            else {
                var email=req.body.email;
                var password=req.body.password
                delete req.body.cnfpassword;
                req.body.password = await securePassword(req.body.password);
                console.log(req.body.password)
                console.log(req.body)
                const userDetails = { ...req.body };
                var result = await userSchemaModel.create(userDetails);
                sendEmail(email,password)
                if (result)
                    res.status(200).send({ sucess: true, msg: "user registered succesfully" });
                else 
                res.status(500).send({ sucess: false, msg: "server error" });
            }
        }
    } catch (error) {
        res.status(400).send({ sucess: false, msg: error.message });
    }
};




// ....................................fetch .................................................

export const fetch = async (req, res) => {
    try {
        var userlist = await userSchemaModel.findOne(req.query)

        if (userlist) {
            res.status(201).json({ sucess: true, data: userlist })
        }

        else
            res.status(500).json('record not found');
    } catch (error) {
        res.status(400).json({ sucess: false, msg: error.message })
    }

}

// ........................................delete ..............................................

export var deleteUser = async (req, res) => {
    try {
        var userlist = await userSchemaModel.findOne(req.body);
        if (userlist.length != 0) {
            var del = await userSchemaModel.deleteOne(req.body);
            if (del)
                res.status(200).json({ sucess: true, msg: "Record Deleted Succesfully" })
            else
                res.status(200).json({ sucess: false, msg: "server error" })

        }
        else
            res.status(200).json({ sucess: false, msg: "Record Not Found" })
    } catch (error) {
        res.status(400).json({ sucess: false, msg: error.message })
    }
}

// ........................................update ....................................................

export var updateUser = async (req, res) => {

    try {
        // console.log(JSON.parse(req.body.condition_obj))
        var user = await userSchemaModel.findOne(JSON.parse(req.body.condition_obj));

        if (user) {
            await userSchemaModel.updateOne(JSON.parse(req.body.condition_obj), { $set: (JSON.parse(req.body.content_obj)) });

            res.status(200).json({ sucess: true, msg: "Record updated sucessfully" })
        }
        else
            res.status(200).json({ sucess: false, msg: "Record not found" })
    } catch (error) {
        res.status(400).json({ sucess: false, msg: error.message })

    }
}
// .................................................login.............................
export var login = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        var user = await userSchemaModel.findOne({ email: email })
        console.log(user.password)
        if (user)
        {var passwordMatch=await bcryptjs.compare(password,user.password)
            console.log(passwordMatch)
        if(passwordMatch)
            {
                const token = await createToken(user._id)
                user.token = token;

                res.status(200).json({ status: true, userDetails: user })
            }
            else {
                res.status(200).json({ status: false, msg: "Invalid Password" })
            }
        }

        else
            res.status(200).json({ status: false, msg: "Invalid credentials" })
    } catch (error) {
        res.status(400).json(error.message)
    }
}

