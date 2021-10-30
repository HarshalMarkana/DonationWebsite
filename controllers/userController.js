const { request } = require("express");

const express = require('express')
const router = express.Router();
const User = require("../models/Users");
const Donation = require("../models/Donation");



router.get("/:id",async(req,res)=>{
    console.log(req.params)
    User.findById(req.params.id)
        .then((user)=>{
            res.render("user_home",{user:user});
        })
        .catch((err)=>console.log(err))
})


router.get("/apply/:id",(req,res)=>{
    User.findById(req.params.id)
        .then((user)=>{
            res.render("Askdonation",{user:user});
        })
        .catch((err)=>console.log(err))
})

router.post("/submitDonation/:id",(req,res)=>{
    const id=req.params.id;
    const{email,name,contact,target}=req.body;
    let newDonation= new Donation({
        userId:id,
        name:name,
        email:email,
        contact:contact,
        target:target
    });
    newDonation
        .save()
        .then((donation)=>{
            console.log("donation applied")
            res.redirect(`/user/${id}`);
        })
})
module.exports = router;