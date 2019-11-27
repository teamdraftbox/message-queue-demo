const Task = require('./model')
const User = require("../users/model")
const publishMq = require("../../queue").publish
exports.getAllTask = function (req,res) {
    let userId = req.params.id
  return  User.findOne({ _id: userId }).populate("tasks")
        .then((user) => {
            let tasks = user.tasks
            res.status(200).json({ success: true, message: `Succesfully retrived tasks for the user`, tasks })
        })
        .catch((err)=>{
            throw err
        })

}

exports.getOneTask = function (req,res) {
    let taskId = req.params.taskId
    Task.findOne({ _id: taskId })
        .then((task) => {
            res.status(200).json({ success: true, message: 'Successfully retived task', task })
        })
        .catch((err) => {
            throw err
        })

}
exports.createTask = function (req,res) {
    let userId = req.params.id
  return  User.findOne({ _id: userId })
        .then((user) => {
            console.log("The user data is===========",user)
            let obj = {
                name:req.body.name,
                status:"In-Progress"
            }
            let task = new Task(obj)
           return task.save()
                .then((task) => {
                    console.log("The stask are",task)
                    user.tasks.push(task._id)
                    user.save()
                    let queueData=`${task._id},5`
                    publishMq("","jobs", new Buffer.from(queueData))
                    res.status(200).json({success:true,message:'successfully added  task'})
                })
                .catch((err) => {
                    throw err
                })
        })
        .catch((err) => {
            throw err
        })
}

exports.updateTask = function (req,res) {
    let taskId = req.params.taskId
    let obj = {
        status:req.body.status
    }
    Task.findOneAndUpdate({_id:taskId},obj)
    .then((task)=>{
        res.status(200).json({success:true,message:"Successfully updated",task})
    })
    .catch((err)=>{
        throw err
    })

}


exports.deleteTask = function (req,res) {
    let taskId = req.params.taskId
    Task.findOneAndDelete({_id:taskId})
    .then(()=>{
        res.status(200).json({success:true,message:"sucessfully deleted task"})
    })
    .catch((err)=>{
        throw err
    })
}