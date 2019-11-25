module.exports= (app)=>{
    app.use("/api/users",require("./app/users/index"))
}