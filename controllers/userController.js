const { request } = require("express");

const express = require('express')
const router = express.Router();
const User = require("../models/Users");



router.get("/:id",async(req,res)=>{
    console.log(req.params)
    User.findById(req.params.id)
        .then((user)=>{
            res.render("homePage",{name:user.name});
        })
        .catch((err)=>console.log(err))
})
module.exports = router;