const router = require('express').Router();
const controller = require("./controller");
const helper = require('../../helper/authCheck')

router.get("/",controller.getAlluser)
router.post("/", controller.register)
router.post("/login", controller.login)
router.put("/:id",helper.checkToken ,controller.update)
router.delete("/:id",helper.checkToken ,controller.delete)



module.exports = router