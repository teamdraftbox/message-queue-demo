const mongoose = require("mongoose")
const taskSchema = new mongoose.Schema({
    name: { type: String,unique: true, required: true },
    status:{type:String,required:true}
})

module.exports = mongoose.model('Task',taskSchema)