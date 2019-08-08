const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
     email:{type:String,
        required:true,
        unique:true,
        match : /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    name:{type:String},
    password:{type:String,required:true},
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    expenses:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
    profiePic:{type:String},
    role:{type:String}
});



module.exports=mongoose.model('ExpenseUser',userSchema);