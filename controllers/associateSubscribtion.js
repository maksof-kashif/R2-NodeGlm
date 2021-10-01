const bcrypt=require('bcrypt')
const mongoose=require('mongoose')


const AssociateSubscribetion=mongoose.model('associateSubscribetions')


module.exports={
    createAsSubscribetion: async function(req,res){
        try{
            await AssociateSubscribetion(req.body).save()
            res.send({status:true,msg:"successfully created"})
        }catch(err){
            res.send({status:false,msg:err.message})
        }
    },
    assubscribetions: async function(req,res){
        try{
            const data = await AssociateSubscribetion.find({})
            res.send({status:true,msg:"successfully fetch",data:data.reverse()})
        }catch(err){
            res.send({status:false,msg:err.message})
        }
    },
    deleteAsSubscribetion:async function(req,res){
        try{
            await AssociateSubscribetion.findByIdAndDelete(req.body.id)
            res.send({status:true,msg:"successfully deleted"})
        }catch(err){
            res.send({status:false,msg:err.message})
        }
    },
    editAsSubscribetion:async function(req,res){
        try{
            await AssociateSubscribetion.findByIdAndUpdate(req.body.id,req.body)
            res.send({status:true,msg:"successfully updated"})
        }catch(err){
            res.send({status:false,msg:err.message})
        }
    },
    singleAsSub:async function(req,res){
        try{
            const data=await AssociateSubscribetion.findById(req.body.id)
            res.send({status:true,msg:"successfully Fetch",data})
        }catch(err){
            res.send({status:false,msg:err.message})
        }
    },
}