module.exports= (app)=>{
    console.log("route directory file")
    app.use("/api",require("./app/users/index"))
    app.use("/api",require("./app/task/index"))
}