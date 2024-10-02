const express = require("express");
const app = express();
const bookRouter = express.Router();

const  {addBook, getBooks, getBookIndexBybookName,getDescriptionById,addStory,
    getTtilesByBookId,getStoryByBookId
} = require ('../controllers/bookControllers');
const secure = require('../middleware/security.js')


bookRouter.get("/",(req,res)=>{
    res.send("Welcome to Book API");
})
bookRouter.post("/addBook",addBook)
bookRouter.post("/addStory",addStory)
bookRouter.post("/getBookIndexBybookName",getBookIndexBybookName)
bookRouter.post("/getDescriptionById",getDescriptionById)
bookRouter.get("/getBooks",getBooks)
bookRouter.post("/gettitlesByBookId",getTtilesByBookId)
bookRouter.post("/getStoryByStroyId",getStoryByBookId)



module.exports = bookRouter;





