
const express = require('express');
const mongoose=require('mongoose');
const router= express.Router();
const User = require('../models/users');
const Group = require('../models/groups');
mongoose.set('useFindAndModify', false);
const Expense = require('../models/expenses');


exports.create=async(req,res,next)=>{
    console.log(req.body)
    const group = new Group({
        _id : new mongoose.Types.ObjectId(),
        users:req.body.members,
        name:req.body.name,
        usr:req.body.mm
      
           
        });
          var result= await group.save();
          console.log("created",result);
          
          req.body.members.forEach(async(id,idx)=>{
            
              
          await User.updateOne({_id: id._id},{$push:{groups:(result._id) }}).then(resp=>{
              if(idx===req.body.members.length-1){
                
                res.status(201).json({result})  
            }
            }).catch(error=>{console.log(error)}) 
            })
         
        
}

exports.checkUser=(req,res,next)=>{
    const id=req.body.member;
   console.log(id);
   

         User.findOne({email:id})
         .exec()
         .then(result=>{    
             if(result==null)
             {
                res.status(401).json(result);
             }else{
                res.status(201).json(result);
             }
                         
          
             })
        .catch(
        err=>{
            res.status(500).json({error:err});
        }
     )
}

exports.getGroup=(req,res,next)=>{
    const email=req.params.id
    console.log(email);
    
    User.findOne({email:email})
         .populate({
             path: "groups",
             populate: {
                 path: "usr expenses"
             }
         })
         .then(result=>{    
             if(result==null)
             {
                res.status(401).json(result);
             }else{
                res.status(201).json(result);
             }
                         
          
             })
        .catch(
        err=>{
            res.status(500).json({error:err});
        })
}

exports.deleteGroup=async(req,res,next)=>{
  // const email=req.params.id
  // console.log(email);
 // console.log(req.body);
 try{
 console.log(req.body);
  
   var resultOfdelete= await Expense.deleteMany({group:req.body._id});
   console.log("***************************",resultOfdelete)
    req.body.users.forEach(async(user,idx)=>{
        User.find( { expenses: { $all: expenses } } ).then(response=>{
            User.update(
                { _id: user._id },
                { $pull: { 'expenses': req.body.expenses } }
              );
        }).catch()
        

     //await User.findById(user._id,{$pull:{expenses:(req.body.expenses) }}).then().catch()

    })
    await Group.deleteOne({_id:req.body._id})
   req.body.users.forEach(async(user,idx)=>{
       console.log(user.expenses);
       console.log(user.email);

       
   await User.updateOne({email:user.email},{$pull:{groups:(req.body._id)} })
   .then(result=>{ 
       if(idx===req.body.users.length-1)
       res.status(201).json(resultOfdelete)
       
   }).catch(err=>console.log(err))
   })
  }catch(error){console.log(error);
 }
  
    
  
       
}
exports.getGroupExpences=async(req,res,next)=>{
    const id=req.params.id
    console.log(id);
    
    Group.findById({_id:id}).populate("expenses").then((result=>{
        console.log(result);
        res.status(201).json(result)
        
    }))
}
exports.editGroup=async(req,res,next)=>{

console.log(req.body);
Group.findByIdAndUpdate(req.body.group,{
    $set: {name:req.body.name}
}).then(result=>{
    res.status(201).json(result)
}).catch(err=>{
    res.status(401).json({Message:"failed",err})
})


}