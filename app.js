// // access env file
// dotenv integreate evn file to backend annd make accesible
// dotenv .env file ko access karne ke kaam mai aat ahai
if(process.env.NODE_ENV!="production")
{
  require('dotenv').config();
}



const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expressError = require("./ErrorHandling/expressError.js");
const engine = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');   // connect session
const flash = require("connect-flash");
// -----------------------------------------
// route require
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userrouter = require("./routes/userrouter.js");
// ---------------------------------------
const ejs = require("ejs");
const path = require("path");
const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", engine);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// const mongo_url = "mongodb://127.0.0.1:27017/RentalHome";


// mongo atlus url
const mongoAtlasurl=process.env.dburl;

// passport for authentication and authorization--------------
const passport = require("passport");
const LocalStrategies = require("passport-local");
const User = require("./models/User.js");

// --------------------------------------------------------




// mongo-session--------------------------------------------
const store= MongoStore.create({
  mongoUrl:mongoAtlasurl,
  crypto: {
    secret:process.env.SECRET,
  },
  touchAfter:24*60*60,
});

store.on("error",()=>
{
  console.log("Error in Mongo session store ",err);
})
// ---------------------------------------------------------------



// express-session--------------------------------------------------
const sessionOption = {
  store:store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // Security purpose
  },
};

app.use(session(sessionOption));
app.use(flash());
//----------------------------------------------------

// passport -----------------------------------------------------------------
// session must be there in passport
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy to signup and login
passport.use(new LocalStrategies(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser()); //  store user login data into session called serialization
passport.deserializeUser(User.deserializeUser()); // remove user data from session called deserialization at the time of log out

//---------------------------------------
// // resister a instance
// app.get("/register",async(req,res)=>
// {
//         let fakeUser=new User({
//                 email:"bibhashkumar@10014",
//                 username:"kumarbibhash4587",
//         })

//        let resisterUser= await User.register(fakeUser,"10014");
//        res.send(resisterUser);
// })

main()
  .then(() => {
    console.log("Successfully connect to database!");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoAtlasurl);
}

// flash middle-ware

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curUser = req.user; // password user store login detail in req which can acces by req.user.
  next();
});

// locals: This is a property of the res object that is used to store variables that you want to pass to the view templates. These variables are available in the view when it is rendered.

// -------------------------------
// route
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userrouter);
// --------------------------------



app.get("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 501, message = "Somethings went Wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, () => {
  console.log(`You are listing on the port number ${port}`);
});
