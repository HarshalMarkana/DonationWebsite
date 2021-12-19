const { request } = require("express");

const express = require('express')
const router = express.Router();
const User = require("../models/Users");
const Donation = require("../models/Donation");
const Donation_History = require("../models/Donation_history");
const bcrypt = require("bcryptjs");



router.get("/:id",async(req,res)=>{
    
    User.findById(req.params.id)
        .then((user)=>{
            res.render("user_home",{user:user});
        })
        .catch((err)=>console.log(err))
})


router.get("/apply/:id",(req,res)=>{
    User.findById(req.params.id)
        .then((user)=>{
            res.render("AskDonation",{user:user});
        })
        .catch((err)=>console.log(err))
})

router.post("/submitDonation/:id",(req,res)=>{
    const id=req.params.id;
    const{email,name,contact,target,reason}=req.body;
    var receiv=0;
    let newDonation= new Donation({
        userId:id,
        name:name,
        email:email,
        contact:contact,
        reason:reason,
        target:target,
        received: receiv
    });
    newDonation
        .save()
        .then((donation)=>{
            
            res.redirect(`/user/${id}`);
        })
})

router.get("/profile/:id",(req,res)=>{
    User.findById(req.params.id)
    .then((user)=>{
         
                res.render("user_profile",{user:user});
           
    })

    .catch((err)=>console.log(err))
})

router.get("/donations/:id",(req,res)=>{
	Donation.find({},(err,dona)=>{
		res.render("donation_list",{donations:dona})
	})
})


router.get("/update/:id",(req,res)=>{
    User.findById(req.params.id)
        .then((user)=>{
            res.render("update_profile",{user:user});
        })
        .catch((err)=>console.log(err))
})

router.post("/updated/1/:id",(req,res)=>{
    const{Name,lname,mobile_no}=req.body;
        let newUser;
        newUser =  {

            name:Name,
            mobile_no:mobile_no
        }

        const id =req.params.id;
                                User.findByIdAndUpdate(id,newUser)
                                    .then(data=>{
                                        if(!data)
                                        {
                                            res.status(404).send({message:`cannot update user ${id}`})
                                        }else{

                                            req.flash('success_msg','Details Updated Successfully');
                                            res.redirect(`/user/${id}`)
                                        }
                                    })
                                    .catch(err=>{
                                        res.status(500).send({message:`${err}`})
                                    })
                        
					
})


router.post("/updated/2/:id",(req,res)=>{
    const{password,cpassword,oldpsw}=req.body;
    if (password !== cpassword) {
		//req.flash('error_msg','Passwords did not match');
		 
		res.redirect(`user/update/${req.params.id}`);
	} else {

        let newUser;
        newUser =  {
            password:password
        }
            
					 
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err) throw err;

							// Set Password to Hash
							newUser.password = hash;
							 const id =req.params.id;
                                User.findByIdAndUpdate(id,newUser)
                                    .then(data=>{
                                        if(!data)
                                        {
                                            res.status(404).send({message:`cannot update user ${id}`})
                                        }else{

                                            req.flash('success_msg','Details Updated Successfully');
                                            res.redirect(`/user/${id}`)
                                        }
                                    })
                                    .catch(err=>{
                                        res.status(500).send({message:`${err}`})
                                    })
                                    });
    
					});		 
    }
})

router.get("/mydonation/:id",(req,res)=>{
    Donation.find({userId:req.params.id},function(err,dona){
            res.render("donation_list",{donations:dona});
    });
})





module.exports = router;