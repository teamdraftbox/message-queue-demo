const router = require('express').Router();
const controller = require("./controller");
const helper = require('../../helper/authCheck')

router.get("/user",helper.checkToken,controller.getAlluser)
router.post("/user", controller.register)
router.post("/user/login", controller.login)
router.get("/user/:id",helper.checkToken ,controller.getOneUser)
router.put("/user/:id",helper.checkToken ,controller.update)
router.delete("/user/:id",helper.checkToken ,controller.delete)



module.exports = router