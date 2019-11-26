var User = require("./model")
var jwt = require('jsonwebtoken');
const secret = process.env.SECRET

exports.getAlluser = function (req, res) {
    return User.find({}).exec()
        .then((users) => {
            res.status(200).json(users)
        })
        .catch((err) => {
            throw err
        })
}

exports.getOneUser = function(req,res){
    return User.findOne({_id:req.params.id})
    .then((user)=>{
        res.status(200).json({success: true, message: `Succesfully retrived user`, user})
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
        user.save(function (err, data) {
            if (err) {
                res.json({ success: false, message: "User already exsist" + err })
            } else {
                res.status(200).json({ success: true, message: `Succesfully registered`, user: data })
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
exports.update = function (req, res) {

    User.findById(req.params.id).exec()
        .then((user) => {
            if (!user) {
                let err = new Error("User does not exist")
            } else {
                var obj = {
                    username: req.body.username || user.username,
                    email: req.body.email || user.email,
                    password: req.body.password || user.password
                }
                return User.findOneAndUpdate({_id:req.body.id}, obj);
            }
        })
        .then((err, user) => {
            if (err) {
                throw error
            }
            res.status(200).json({ success: true, message: "updated user credentials", user: user })
        })
        .catch((err) => {
            throw err
        })
}

exports.delete = function (req, res) {
return  User.findOneAndDelete({_id:req.params.id})
    .then((err)=>{
        if(err){
            throw err
        }else{
            res.status(200).json({success: true, message: "Successfully removed user"})
        }
        
    })
    .catch((err)=>{
        throw err
    })
 
}


