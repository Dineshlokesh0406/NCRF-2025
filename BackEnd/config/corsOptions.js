
const allowedOrigins = ['https://ncrf-frontend.onrender.com', 'https://ncrf-admin.onrender.com', 'https://ncrf-superadmin.onrender.com']

const corsOptions ={
    origin: (origin,callback)=>{
        if(allowedOrigins.indexOf(origin)!== -1 || !origin){
            callback(null,true)
        }else{
            callback(new Error('Not allowed by CORS'))
        }
   },
    credentials:true,  //access-control-allow-credentials:true
    optionSuccessStatus:200
}
module.exports = corsOptions;