var mongoose = require("mongoose")
var bcrypt = require("bcrypt-nodejs")
var userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, lowercase: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
})

userSchema.pre('save', function (next) {
    let user = this
    bcrypt.hash(user.password, null, null, function (err, hash) {
        // Store hash in your password DB.
        if (err) {
            console.log("error" + err)
        } else {
            user.password = hash
        }
    });
    next();
});

userSchema.methods.comparePassword = function (password) {
    let user = this
    return bcrypt.compareSync(password, user.password)

}

module.exports = mongoose.model("User", userSchema)
