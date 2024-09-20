import connectDb from "./Db/index.js";
import 'dotenv/config'
import { app } from "./app.js";


connectDb()
.then(() => {
  app.listen(process.env.PORT || 4000,(req,res)=>{
    console.log(`Server Is Runnig On Port: 4000`)
  })
})
.catch(()=>{
    console.log("Mongo Db Connection Failed!!",error)
})