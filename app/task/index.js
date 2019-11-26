const router = require('express').Router();
const controller = require("./controller");
const helper = require('../../helper/authCheck')

router.get("/user/:id/task",helper.checkToken,controller.getAllTask)
router.post("/user/:id/task",helper.checkToken,controller.createTask)
router.get("/user/:id/task/:taskId",helper.checkToken,controller.getOneTask)
router.put("/user/:id/task/:taskId",helper.checkToken ,controller.updateTask)
router.delete("/user/:id/task/:taskId",helper.checkToken ,controller.deleteTask)



module.exports = router