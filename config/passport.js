const User = require('../models/Users');
const passportLocal = require("passport-local");
const LocalStrategy = passportLocal.Strategy;
const jwt = require("jsonwebtoken");
const passportJWT = require("passport-jwt");
const bcrypt = require("bcryptjs");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const GoogleStrategy =require('passport-google-oauth20').Strategy;


require("dotenv").config();



function userStrategy(email, password, done) {
	// Match User
	//console.log(email);
	User.findOne({ email: email })
		.then((user) => {
			//console.log(user)
			if (!user) {
				return done(null, false, { message: "Email not registered" });
			}
			// Match Password
			 

			bcrypt.compare(password, user.password, (err, isMatch) => {
				if (err) {
					throw err;
				}
				if (isMatch) {
					 
					return done(null, user, { message: "Login successful" });
				} else {
					 
					return done(null, false, { message: "Incorrect Password" });
				}
			});
		})
		.catch((err) => {
			console.log(err);
		});
}


module.exports = function(passport)
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
		//console.log(req)
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

    passport.use("user",new LocalStrategy({ usernameField: "email" }, userStrategy)
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

	passport.use(new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:'/auth/google/callback'                                                                                       
    },
    async(accessToken,refreshToken,profile,done)=>{
        //console.log(profile);
        const newUser ={
            googleId:profile.id,
            email : profile.emails[0].value,
            name: profile.displayName, 
		}
         //console.log(newUser);
        try {    
            let user= await User.findOne({googleId:profile.id})
            if(user)
            {
			 
                done(null,user)
            }
            else
            {
                user=await User.create(newUser)
					.then((res)=>{
                     
					done(null,user);
                },(err)=>{
                     
					done(null,false);
                })
						}
             
        } catch (error) {
            console.log(error);
        }
    }
    )
    )
};