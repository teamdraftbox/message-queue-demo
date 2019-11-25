require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db_name = process.env.DB_NAME;
const db_password = process.env.DB_PASSWORD
app = express()
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "*"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
app.use(morgan("dev"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
mongoose.connect(`mongodb://${db_name}:${db_password}@ds029979.mlab.com:29979/message-queue-demo`)
mongoose.connection.once('open',()=>{
    console.log("Successfully connected to db")
})

require('./routes')(app)

app.use((err, req, res, next) => {
  console.log("error message main",err)
  if (!err) {
      return next();
  }

  res.status(500);
  res.send('500: Internal server error');
});

app.listen(process.env.PORT || 4000 , function () {
    console.log("connectec to backend server",process.env.PORT||4000)
})


// connectQueue.start()