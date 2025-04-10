const exp = require('express');
const mongoose  = require('mongoose');
const authorApp = require('./APIs/authorApi');
const userApp = require('./APIs/userApi');
const adminApp = require('./APIs/adminApi');
const app = exp();
require('dotenv').config(); //process.env stores the info 
const cors = require('cors')
app.use(cors())


const  port = process.env.PORT || 4000;
//give another port option to choose if 1st is not there.

//db connection 
mongoose.connect(process.env.DBURL)
.then(()=>{
    app.listen(port,()=> console.log(`server listening on port ${port}...`))
    console.log("DB connection success")
})
.catch(err => console.log("Error in DB connection",err));


//connect API routes
app.use(exp.json())
app.use('/user-api',userApp);
app.use('/author-api',authorApp);
app.use('/admin-api',adminApp);


//error handler
app.use((err,req,res,next)=>{
    console.log("err object in express error handler",err)

    res.send({message:err.message})
})