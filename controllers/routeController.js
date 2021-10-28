const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const jwtExpirySeconds = 30000;


router.get("/",(req,res)=>{
    res.render("homePage");
})

router.get('/login',(req,res)=>{
    res.render("loginPage");
})

router.get("/signup",(req,res)=>{
    res.render("signUpPage");
})

async function registration(Email) {
		return User.findOne({ email: Email });
	 
}

router.post("/signup",(req,res)=>{
     const{Name,Email,password,password2}=req.body;
    if (password !== password2) {
		//req.flash('error_msg','Passwords did not match');
		console.log("did not match")
		res.redirect("/login");
	} else {
        registration(Email)
			.then((user) => {
				if (user) {
					console.log("already there")
 					res.redirect("/login");
				} else {
					let newUser;
						newUser = new User({
							name:Name,
							email:Email,
							password:password
						});
					// Hash Password
					 
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err) throw err;

							// Set Password to Hash
							newUser.password = hash;
							newUser
								.save()
								.then((user) => {
 									console.log("success is here")
 									res.redirect("/login");
								})
								.catch((err) => console.log(err));
						});
					});
				}
			})
			.catch((err) => console.log(err));
    }
})


router.post('/user/login',(req,res,next)=>{
    passport.authenticate("local",(err,user)=>{
        if (err) {
			res.send(err);
			return;
		}
		console.log(user)

		if (!user) {
			req.flash('error_msg','Enter valid login credentials');
            console.log('set he')
			res.redirect("/login");
			return;
		}

		req.login(user, { session: false }, async (error) => {
			if (error) {
				console.log(error);
			}
			//req.user=user;
			const token = jwt.sign({ user }, process.env.ACCESS_TOKEN, {
				algorithm: "HS256",
			 	expiresIn: jwtExpirySeconds,
			});
			res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });
			req.flash('success_msg','Logged in successfully');
            console.log('set he')
			res.redirect(`/user/${user._id}`);
		});
	})(req, res, next);
})


module.exports = router;