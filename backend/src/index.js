import { connectDB } from "./db/index.js";
import {app} from "./app.js"


connectDB().then(()=>{
    app.listen(process.env.PORT , ()=>{
        console.log(`server is listing on the port ${process.env.PORT}`)
    })
})