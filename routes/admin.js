const { Router } = require("express");
const { adminModel } = require("../db");
const {courseModel} = require("../db")
const zod = require("zod");
const adminRouter = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {adminMiddleware} = require("../middleware/admin")
const { JWT_ADMIN_PASSWORD } = require("../config");

//understand the usecase of having separate jwt secrets for admin and user (32:00 -> 42:00)
adminRouter.post("/signup", async function(req, res) {

    const requiredObject = zod.object({
        name: zod.string(),
        email: zod.string().email(),
        password: zod.string(),
        first_name: zod.string(),
        last_name: zod.string()
    })

    const safelyParsedData = requiredObject.safeParse(req.body);
    if(!safelyParsedData.success){
        res.status(400).json({
            message: safelyParsedData.error
        })
        return;
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;

    const hashedPassword = await bcrypt.hash(password,5);

    await adminModel.create({
        name: name,
        email: email,
        password: hashedPassword,
        first_name: first_name,
        last_name: last_name
    })

    res.json({
        message: "signup successful"
    })
})

adminRouter.post("/signin", async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await adminModel.findOne({
        email: email
    })
    if(!user){
        res.status(400).json({
            message: "user not found"
        })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        res.status(400).json({
            message: "password does not match"
        })
    }else{
        const token = jwt.sign({
            id: user._id
        }, JWT_ADMIN_PASSWORD);

        res.json({
            token: token
        })
    }
})

adminRouter.post("/course",adminMiddleware, async function(req, res) {
    const adminId = req.adminId;
    const {title, description, price, image_url} = req.body;
    const course = await courseModel.create({
        title: title,
        description: description,
        price: price,
        image_url: image_url,
        creatorId: adminId
    })
    res.json({
        message: "course created",
        course_id: course._id
    })
})

adminRouter.put("/course", adminMiddleware,async function(req, res) {
    const adminId = req.adminId;
    const {title, description, price, image_url, course_id} = req.body;
    const course = await courseModel.updateOne({
        _id: course_id,
        creatorId: adminId,
    },{
        title: title,
        description: description,
        price: price,
        image_url: image_url
    })
    res.json({
        message: "course updated",
        course_id: course._id
    })
})
adminRouter.get("/course/bulk",adminMiddleware,async function(req, res) {
    const adminId = req.adminId;
    const courses =  await courseModel.find({
        _id: adminId
    })
    if(courses.length > 0){
        res.json({
            course: courses
        })
    }else{
        res.json({
            message: "Courses not published"
        })
    }
    
})
module.exports = {
    adminRouter: adminRouter
}