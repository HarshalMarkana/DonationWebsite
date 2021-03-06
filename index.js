if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require("express")
const bodyParser = require("body-parser")
const routeController = require("./controllers/routeController");
const session = require('express-session')
const Mongoose = require('mongoose')
const passPort = require('passport')
const flash =  require('connect-flash');
const jwt = require("jsonwebtoken");
const userController = require('./controllers/userController');
const cookieParser = require("cookie-parser");


const intilizePassport = require('./config/passport');
const User = require('./models/Users');


const app = express(); 

 
Mongoose
    .connect(process.env.DBURI)
    .then(() => {
		const PORT = process.env.PORT || 3000;
		app.listen(PORT, console.log("Server Started"));
		console.log("Connected to DB");
	})
	.catch((err) => {
		console.log(err);
	});


 
	app.use(express.static('public'))

app.set('view engine','ejs');
app.use(express.urlencoded({ extended: true }));

app.use(flash());
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUnintialized: false,
}))

app.use(passPort.initialize())
app.use(passPort.session())
app.use(cookieParser());
require("./config/passport")(passPort);


app.use("/",routeController)

app.use(
	"/user",passPort.authenticate("jwt_user",{session:false}),
	userController
);

 