const mongoose = require("mongoose");
async function connectDb (url){
    try {
        console.log(url);
      await mongoose.connect(process.env.MONGO_URI,{dbName:'Financial_Advisor'})
        console.log("DataBase Connected")
    } catch (error) {

        console.log(' unable to connect database error')
    }
}
module.exports=connectDb;