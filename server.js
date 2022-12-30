require("dotenv").config()
const app = require("./app");
const { connectDatabase } = require("./config/db");
const port=process.env.PORT

//database Connection
connectDatabase()


app.listen(port,()=>{
    `Express is Running on ${port}`
})