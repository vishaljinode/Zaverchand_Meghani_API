const dotenv = require("dotenv")
dotenv.config()


const secure = (req,res,next)=>{

    const security = req.headers.security;
    if(!security){
        return res.status(404).json({error : "security Is Required"})
    }
   try{
    if(process.env.SECTRET_KEY ==security){
        next();          

    }else{
            return res.status(401).json({error:"Please contact admin"})
    }  
   
   }catch(e){
    return req.status(400).json({error : "Not permission to access this api"})
   }

}

module.exports = secure;