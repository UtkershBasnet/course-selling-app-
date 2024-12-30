const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const userSchema = new Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
    first_name: String,
    last_name: String
})

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    image_url: String,
    creatorId: ObjectId
})

const purchaseSchema = new Schema({
    course_id: ObjectId,
    user_id: ObjectId
})

const adminSchema = new Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
    first_name: String,
    last_name: String
})

const userModel = mongoose.model('User',userSchema);
const courseModel = mongoose.model('Course',courseSchema);
const purchaseModel = mongoose.model('Purchase',purchaseSchema);
const adminModel = mongoose.model('Admin', adminSchema);

module.exports = {
    userModel,
    courseModel,
    purchaseModel,
    adminModel
}