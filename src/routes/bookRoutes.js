const express = require("express");
const app = express();
const bookRouter = express.Router();

const  {addBook, getBooks, getBookIndexBybookName,getDescriptionById,addStory} = require ('../controllers/bookControllers');
const secure = require('../middleware/security.js')


bookRouter.get("/",(req,res)=>{
    res.send("Welcome to Book API");
})
bookRouter.post("/addBook",secure,addBook)
bookRouter.post("/addStory",secure,addStory)
bookRouter.post("/getBookIndexBybookName",secure,getBookIndexBybookName)
bookRouter.post("/getDescriptionById",secure,getDescriptionById)
bookRouter.get("/getBooks",secure,getBooks)






module.exports = bookRouter;





