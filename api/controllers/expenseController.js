const express = require('express');
const mongoose=require('mongoose');
const router= express.Router();
const User = require('../models/users');
const Group = require('../models/groups');
const Expense = require('../models/expenses');



exports.create=async(req,res,next)=>{
  console.log("creating expense////////////////////////////////////////////////////////////////",req.body);
   
    const expense = new Expense({
        _id : new mongoose.Types.ObjectId(),
        description:req.body.description,
        shares:req.body.shares,
        totalAmount:req.body.totalAmount,
        group:req.body.group,
        time:req.body.time,
           
        });
      ///  console.log(expense);
        
          var result= await expense.save();
         
        //  console.log("created expense",result);
          
         var savedExpense= await Group.updateOne({_id:req.body.group},{$push:{expenses:(result._id) }})
        
        // console.log("saved to group",savedExpense);
         
          req.body.shares.forEach(async(share,idx)=>{
              console.log("-----------------------------------------------",share.email);
              
          await User.updateOne({_id:share.email},{$push:{expenses:(result._id) }}).then(resp=>{
              if(idx===req.body.shares.length-1){
                  console.log("response*****************",resp);
                  
                res.status(201).json({savedExpense})  
            }
            }).catch(error=>{console.log(error)}) 
            })
         
        
}

exports.getExpense=(req,res,next)=>{
    const group_id=req.params.id
    console.log("id of group", group_id);
    
    Group.findOne({_id:group_id})
         .populate("expenses")
         .then(result=>{    
             if(result===null)
             {
                res.status(401).json(result);
             }else{
                res.status(201).json(result.expenses);
             }
                         
          
             })
        .catch(
        err=>{
            res.status(500).json({error:err});
        })
}

exports.deleteExpense=async(req,res,next)=>{
 //   const email=req.params.id
  //  console.log(email);
  console.log(req.body);
  try{

    var resultOfdelete= await Expense.deleteOne({_id:req.body.id});
    console.log(resultOfdelete)
    
    req.body.emails.forEach(async(email,idx)=>{
    await User.updateOne({email:email},{$pull:{expenses:(req.body.id) }})
    .then(result=>{ 
        if(idx===req.body.emails.length-1)
        res.status(201).json(resultOfdelete)
        
    }).catch(err=>console.log(err))
    })
  }catch(error){console.log(error);
  }
  
    
   
       
}