const User = require('../models/Users');
const passportLocal = require("passport-local");
const LocalStrategy = passportLocal.Strategy;
const jwt = require("jsonwebtoken");
const passportJWT = require("passport-jwt");
const bcrypt = require("bcryptjs");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;


require("dotenv").config();



function userStrategy(Email, password, done) {
	// Match User
	console.log(Email);
	User.findOne({ email: Email })
		.then((user) => {
			console.log(user)
			if (!user) {
				console.log("not there")
				return done(null, false, { message: "Email not registered" });
			}
			// Match Password
			console.log("here")

			bcrypt.compare(password, user.password, (err, isMatch) => {
				if (err) {
					throw err;
				}
				if (isMatch) {
					console.log("right")
					return done(null, user, { message: "Login successful" });
				} else {
					console.log('wrong')
					return done(null, false, { message: "Incorrect Password" });
				}
			});
		})
		.catch((err) => {
			console.log(err);
		});
}


function initialize(passport)
{
    passport.serializeUser(function(user,done)
    {
        done(null,user.id)
    })

    passport.deserializeUser(function(id,done)
    {   
             User.findById(id,(err,user)=>done(err,user))
    })

	var usercookieExtractor = function (req) {
		var token = null;
		if (req) {
			token = req.cookies.token;
		}
		return token;
	};

	function userjwtCallback(req,token, done) {
		User.findById(token.user._id, function(err, user) {
			
			if (err) { return done(err, false); }
	  
			if (user) {
			  req.user = user; // <= Add this line
			  done(null, user);
			} else {
			  done(null, false);
			}
		  });
	}

    passport.use("local",new LocalStrategy({ usernameField: "email" }, userStrategy)
	);    

	passport.use(
		"jwt_user",
		new JWTStrategy(
			{
				secretOrKey: process.env.ACCESS_TOKEN,
				jwtFromRequest: ExtractJWT.fromExtractors([usercookieExtractor]),
				passReqToCallback: true
			},
			userjwtCallback
		)
	);
}

module.exports = initialize;