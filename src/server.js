const express=require("express");
const routes=require("./routes/index.js");
const cors=require("cors");
require('dotenv').config()


const app = express();
const bodyParser = require('body-parser')
app.use(cors(
    {
        origin: process.env.ORIGIN_URL,
    }
));

//Set PORT in .env file
const PORT = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(process.env.PORT || 3000, ()=>{
    console.log("listening on port " + PORT);
})

app.use('/api',routes);

app.get("/", async(req, res)=>{
    // const result=await sendMail();
    res.send('Welcome to Gmail API with NodeJS')
})