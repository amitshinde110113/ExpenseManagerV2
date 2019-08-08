const mongoose=require('mongoose');

const expenseSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
     description:{type:String,
        required:true,
        
    },
   totalAmount:{type:Number},
   shares:[{type:Object}],
   group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
   time:{type:String}

});



module.exports=mongoose.model('Expense',expenseSchema);