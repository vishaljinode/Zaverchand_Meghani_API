const express = require("express")   
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv")
dotenv.config()
const bookRoutes = require('./src/routes/bookRoutes');


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/book",bookRoutes)


// if (!process.env.MONGODB_URL) {
//     console.error('MONGODB_URL is not defined in .env file');
//     process.exit(1);
//   }

mongoose.connect("mongodb+srv://vishaljinode:3Z6Gtrb0ywndiNz9@cluster0.aghwquq.mongodb.net/books")
.then(()=>{
    console.log("connected to database")
})
.catch((e)=>{
    console.log("error in Database connection : ",e)
})


app.get("/",(req,res)=>{
    res.send("Welcome to my API");
})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})

