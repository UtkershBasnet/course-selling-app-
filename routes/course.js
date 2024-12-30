const {Router} = require("express");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db");
const courseRoter = Router();

courseRoter.post("/purchase", userMiddleware,async (req, res) => {
  const userId = req.userId;
  const courseId = req.body.courseId;
  
  await purchaseModel.create({
    user_id: userId,
    course_id: courseId
  })

  res.json({
    message: "course purchased"
  })
});

courseRoter.get("preview", async(req, res) => {
  const courses = await courseModel.find({});

  res.json({
    courses: courses
  })
});

module.exports = {courseRoter : courseRoter};
