if(process.env.NODE_ENV !== "production"){
      require('dotenv').config()
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const port=8080;
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
const engine = require('ejs-mate');
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"/public")));
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const userRoute=require("./routes/user.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");






const dbUrl=process.env.ATLAS_URL;

main()
.then((res)=>{
    console.log("Successfully connected..")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl); //'mongodb://127.0.0.1:27017/lovevisit'
}

app.listen(port,()=>{
    console.log("The app is listening..");
})


const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto: {
    secret:process.env.SECRET,
  },
  touchAfter:24*3600
})

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
}); 

const sessionInfo={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
};

app.use(session(sessionInfo));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.successMsg=req.flash("success");
  res.locals.errorMsg=req.flash("error");
  res.locals.currUser=req.user;
  next();
})

// app.get("/demoUser",async(req,res)=>{
//     const fakeUser=new User({
//       email:"kumar@123",
//       username:"kumar"
//     })
//     const result=await User.register(fakeUser,"91823");
//     res.send(result);
// })

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRoute)

app.use((err,req,res,next)=>{
  let{status=400,message="Page not found"}=err;
  res.status(status).render("error.ejs",{err});
})


//  c8Vbcx0A0C4WYDHA   mongo atlas password;

 //  https://major-project-kzjr.onrender.com [final link]