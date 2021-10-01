const mongoose=require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const usersSchema=new mongoose.Schema({
first_name:{type:String,required:true},
email:{type:String,required:true},
number:{type:String,required:true},
password:{type:String,required:true},
address:{type:String,required:true},
role_id:{type:Number,default:2},
image:{type:String,default:'/uploads/default.jpeg'},
updated_at:{type:Date,default: new Date()},
created_at:{type:Date,default: new Date()},
last_name:{type:String,required:true},
organization:{type:String,required:true},
customerProfileId:{type:String},
customerPaymentProfileId:{type:Object}
})
usersSchema.plugin(aggregatePaginate)
mongoose.model('users',usersSchema)