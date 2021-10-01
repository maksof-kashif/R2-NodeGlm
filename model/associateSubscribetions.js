const mongoose=require('mongoose');


const serviceSchema=mongoose.Schema({
    name:{type:String,required:true}
})

const AssociateSubscribetionsSchema=mongoose.Schema({
    name:{type:String,required:true},
    services:[serviceSchema],
    price:{type:Number,required:true},
    cycle:{type:Number,required:true},
    _project:{type:mongoose.Types.ObjectId,required:true},
    subscribe:{type:Number,default:0},
    updated_at:{type:Date,default: new Date()},
    created_at:{type:Date,default: new Date()},
})

mongoose.model('associateSubscribetions',AssociateSubscribetionsSchema)