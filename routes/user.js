const {Router} = require("express");
const { courseModel , userModel, purchaseModel} = require("../db");
const zod = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {userMiddleware} = require("../middleware/user")
const { JWT_USER_PASSWORD } = require("../config");
const course = require("./course");

const userRouter = Router();

userRouter.post("/signup", async function(req, res) {

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

  await userModel.create({
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

userRouter.post("/signin", async function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const user = await userModel.findOne({
      email: email
  })

  if(!user){
      res.status(400).json({
          message: "user not found"
      })
      return;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch){
      res.status(400).json({
          message: "password does not match"
      })
  }else{
      const token = jwt.sign({
          id: user._id
      }, JWT_USER_PASSWORD);

      res.json({
          token: token
      })
  }
})

userRouter.get("/purchases",userMiddleware, async (req, res) => {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
      user_id: userId
    })
    const coursesPurchased = purchases.map((x) => x.course_id);
    const courses = await courseModel.find({
      _id : {$in : coursesPurchased}
    })
    res.json({
      purchases: purchases,
      course: courses
    })
});

module.exports = {userRouter};