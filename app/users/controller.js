var User = require("./model")
var jwt = require('jsonwebtoken');
const secret = process.env.SECRET

exports.getAlluser = function (req, res)  {
   User.find({}).exec()
   .then((users)=>{
     return users
   })
   .catch((err)=>{
       throw err
   })
}
exports.register = function (req, res) {
    var user = new User()
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    if (req.body.username === null ||
        req.body.username === "" ||
        req.body.password === null ||
        req.body.password === "" ||
        req.body.email === "" ||
        req.body.email === null) {
        res.json({ success: false, message: "invalid data" })
    } else {
        user.save(function (err) {
            if (err) {
                res.json({ success: false, message: "User already exsist" + err })
            } else {
                res.json({ success: true, message: "Succesfully registered" })
            }
        })
    }
}

exports.login = function (req, res) {
    User.findOne({ username: req.body.username }).select("email password username").exec(function (err, user) {
        if (err) { console.log("error") }
        if (!user) {
            res.json({ success: false, message: "Incorrect username or password" })
        } else if (user) {
            if (user !== null) {
                var valid = user.comparePassword(req.body.password)
                if (valid) {
                    var token = jwt.sign(
                        { username: user.username, email: user.email }, secret, { expiresIn: '24h' }
                    );
                    res.json({ success: true, message: "Successfully authenticated", token: token })
                }
                else {
                    res.json({ success: false, message: "Incorrect username or password" })
                }
            } else {
                res.json({ success: false, message: "Incorrect username or password" })
            }
        }

    })
}
exports.update = function (req, res)  {
    var obj = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    User.findById(req.params.id, obj, function (err, updatedUser) {
        if (err) {
            res.json({ success: false, message: "Unable to find data" })
        } else {
            updatedUser.username = req.body.username;
            updatedUser.password = req.body.password;
            updatedUser.email = req.body.email;
            if (req.body.username === null ||
                req.body.username === "" ||
                req.body.password === null ||
                req.body.password === "" ||
                req.body.email === "" ||
                req.body.email === null) {
                res.json({ success: false, message: "invalid data" })
            } else {
                user.save(function (err) {
                    if (err) {
                        res.json({ success: false, message: "User already exsist" + err })
                    } else {
                        res.json({ success: true, message: "Succesfully registered" })
                    }
                })
            }

        }
    })
}

exports.delete = function (req, res) {
    User.findByIdAndDelete(req.body.params, function (err) {
        if (err) {
            res.json({ success: false, message: "Unable to find user" })
        } else {
            res.json({ success: true, message: "Successfully removed user" })
        }
    })
}
