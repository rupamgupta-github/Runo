const express=require("express");
const ErrorHandler = require("./Middleware/error");

const app=express();



app.use(ErrorHandler);

module.exports=app;