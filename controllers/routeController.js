const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const passport = require("passport");
const jwt = require("jsonwebtoken");
 const Donation = require("../models/Donation");
 const History = require("../models/Donation_history");


const jwtExpirySeconds = 30000;


router.get("/",(req,res)=>{
    res.render("homePage");
})


router.get('/auth/google',passport.authenticate('google',{scope:'profile email'}))


router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/'}),(req,res)=>{
	const user=req.user;
	if (!user) {
		res.redirect("/login");
	}
	//console.log(user);
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
		res.redirect(`/user/${user._id}`);
	});
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
  
	const{Name,Email,mobile_no,password,password2}=req.body;
    if (password !== password2) {
		//req.flash('error_msg','Passwords did not match');
		 
		res.redirect("/login");
	} else {
        registration(Email)
			.then((user) => {
				if (user) {
				 
 					res.redirect("/login");
				} else {
					let newUser;
						newUser = new User({
							name:Name,
							email:Email,
							password:password,
							mobile_no:mobile_no
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


router.post('/users/login',(req,res,next)=>{
	//console.log(req.body);
    passport.authenticate("user",(err,user)=>{
        if (err) {
			res.send(err);
			return;
		}
		//console.log(user)

		if (!user) {
			req.flash('error_msg','Enter valid login credentials');
           
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
             
			res.redirect(`/user/${user._id}`);
		});
	})(req, res, next);
})

router.get("/users/logout", (req, res) => {
	if(req.cookies && req.cookies.hasOwnProperty("token")) {
		res.cookie("token","",{expires: new Date(0)});
	}
	req.flash('success_msg','Logged out successfully');
	res.redirect("/");
})

router.get('/donate/:id',(req,res)=>{
	Donation.findById(req.params.id,function(err,dona){
		res.render("donate",{donations:dona});
	});
})

router.get("/donations",(req,res)=>{
	Donation.find({},(err,dona)=>{
		res.render("donation_list",{donations:dona})
	})
})

router.post('/donate/:id',(req,res)=>{
	Donation.findById(req.params.id,function(err,dona){
		
		const tmp=Number(dona.received)+ Number(req.body.add_donation);
		dona.received=tmp;
		Donation.findByIdAndUpdate(req.params.id,dona)
                                    .then(data=>{
                                        if(!data)
                                        {
                                            res.status(404).send({message:`cannot update user ${id}`})
                                        }else{

											const newdonation= new History({
												donationId:req.params.id,
												doneeId:dona.userId,
												name: req.body.Name,
												amount: req.body.add_donation
											 })
											 newdonation
												 .save()
												.then((donation)=>{
													 
													res.redirect(`/donate/${req.params.id}`) 
												})
                                        }
                                    })
                                    .catch(err=>{
                                        res.status(500).send({message:`${err}`})
                                    })
                                   




		
	});
})


router.get("/payment/:id",(req,res)=>{
	res.render("payment_portal",{donation_id:req.params.id})
})
module.exports = router;