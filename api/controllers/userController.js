const express = require('express');
const mongoose=require('mongoose');
const router= express.Router();
const User = require('../models/users');
const Group = require('../models/groups');
var Jimp = require('jimp');
//const bcrypt=require('bcrypt');
const jwt= require('jsonwebtoken');
var CryptoJS = require("crypto-js");
///const Cryptr = require('cryptr');
const Crypto=require('crypto')
///const cryptr = new Cryptr('myTotalySecretKey');
//const checkAuth=require('../middelware/check-auth');

exports.signUp=(req,res,next)=>{
    console.log(req.body.profiePic);
    
    

    User.find({email:req.body.email}).exec().then(result=>{
        
               if(result.length >= 1){
                   res.status(200).json({message:'already exist'})
               }
               else{
   
                   const user = new User({
                                   _id : new mongoose.Types.ObjectId(),
                                   email:req.body.email,
                                   name: req.body.name,
                                   password:req.body.password,
                                   profiePic: (req.file ? req.file.path : "uploads/default.jpg")

                                   });
                                   user.save().then(result=>{
                                       res.status(201).json({Message:'user created successfully',
                                       user:result.email,
                                       id:result._id
                                   
                                   });
                                   }).catch(err=>{
                                       res.status(500).json({error:err});
                                   });
               
               }
   
      }) 
      
      
       
   }

   exports.deleteUser=(req,res,next)=>{

    const id=req.params.userId;
   

         User.deleteOne({_id:id})
         .exec()
         .then(result=>{
                         res.status(201).json({Message:'user deleted'});
          
             })
        .catch(
        err=>{
            res.status(500).json({error:err});
        }
     )


}

exports.getUser=(req,res,next)=>{

    const id=req.params.userId;
     User.findOne({email:id})
       .populate('expenses').populate("groups")
         .then(result=>{
         res.status(201).json(result);
           })
        .catch(
        err=>{
            res.status(500).json({error:err});
        })
}
exports.getMultipleUsers=(req,res,next)=>{

   
   
   

         User.find({_id:req.body.IdArray})
         .select("email groups profiePic name")
      .populate('groups')
         .then(result=>{
            //  let data;
            //  result.map(user=>{
            //     data.push({user:user,group:user.groups})
              
            //  })
            // console.log(data);
             
                         res.status(201).json(result);
          
             })
        .catch(
        err=>{
            res.status(500).json({error:err});
        }
     )


}
   
exports.login=(req,res,next)=>{

    User.findOne({email:req.body.email}).exec()
    .then((result)=>{
        function convertUserAESToPlain(){

        var bytes  = CryptoJS.AES.decrypt(req.body.password.toString(), req.body.email);
        var plaintext =bytes.toString(CryptoJS.enc.Utf8);
        console.log('pasword',plaintext)

       return plaintext

       }
      function convertDBAESToPlain(){

        var bytesDB = CryptoJS.AES.decrypt(result.password.toString(),result.email);
        var plaintextDB = bytesDB.toString(CryptoJS.enc.Utf8);
      
        console.log('pasword',plaintextDB);

       return plaintextDB
       }


       
       

     console.log('It is form DB',convertDBAESToPlain(),'   ----------', convertUserAESToPlain());
     function generateToken(pass,pass1){

        if(pass === pass1 )
        { 
            const token=    jwt.sign({
                email:result.email,
                userID:result._id
            },
            process.env.jwt_key,
            {
                expiresIn:"1h"
            });
            return res.status(200)
            .json({
                message:'Authentication Success...',
                Token:token,
                user:req.body.email,
            });
        }
        else{
            res.status(404).json({message:'Authentication Error'});
        }


     }generateToken( convertDBAESToPlain(),convertUserAESToPlain())
      
    })
    .catch( err=>{
            res.status(500).json({error:err});
        });

}