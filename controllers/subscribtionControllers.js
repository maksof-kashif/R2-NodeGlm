const bcrypt=require('bcrypt')
const mongoose=require('mongoose')

const subscribePackage=require('../services/subscribe').createSubscriptionFromCustomerProfile
const Subscribetion=mongoose.model('subscribetions')
const User=mongoose.model('users')

module.exports={
    createSubscribetion: async function(req,res){
        try{
            await Subscribetion(req.body).save()
            res.send({status:true,msg:"successfully created"})
        }catch(err){
            res.send({status:false,msg:err.message})
        }
    },
    subscribetions: async function(req,res){
        try{
            const data = await Subscribetion.paginate({},{limit:10,page:req.query.page,sort:{created_at:-1}})
            res.send({status:true,msg:"successfully fetch",data:data})
        }catch(err){
            res.send({status:false,msg:err.message})
        }
    },
    searchSubs: async function(req,res){
        try{
            const data = await Subscribetion.paginate({$text:{$search:req.body.text}},{limit:10,page:req.query.page})
            res.send({status:true,msg:"successfully fetch",data:data})
        }catch(err){
            res.send({status:false,msg:err.message})
        }
    },
    searchSubsByDate: async function(req,res){
        try{
            const data = await Subscribetion.paginate({created_at:{$lte:new Date(req.body.date)}},{limit:10,page:req.query.page})
            res.send({status:true,msg:"successfully fetch",data:data})
        }catch(err){
            res.send({status:false,msg:err.message})
        }
    },
    userSubscribetions: async function(req,res){
        try{
            const data = await Subscribetion.paginate({_user:mongoose.Types.ObjectId(req.body.id)},{limit:req.body.limit,page:req.query.page,sort:{created_at:-1}})
            res.send({status:true,msg:"successfully fetch",data:data})
        }catch(err){
            res.send({status:false,msg:err.message})
        }
    },
    userSubscribetionsSearch: async function(req,res){
        try{
            const data = await Subscribetion.paginate({_user:mongoose.Types.ObjectId(req.body.id),$text:{$search:req.body.text}},{limit:10,page:req.query.page})
            res.send({status:true,msg:"successfully fetch",data:data})
        }catch(err){
            res.send({status:false,msg:err.message})
        }
    },
    userSubscribetionsSearchByDate: async function(req,res){
        try{
            const data = await Subscribetion.paginate({_user:mongoose.Types.ObjectId(req.body.id),created_at:{$lte:new Date(req.body.date)}},{limit:10,page:req.query.page})
            res.send({status:true,msg:"successfully fetch",data:data})
        }catch(err){
            res.send({status:false,msg:err.message})
        }
    },
    deleteSubscribetion:async function(req,res){
        try{
            await Subscribetion.findByIdAndDelete(req.body.id)
            res.send({status:true,msg:"successfully deleted"})
        }catch(err){
            res.send({status:false,msg:err.message})
        }
    },
    editSubscribetion:async function(req,res){
        try{
            await Subscribetion.findByIdAndUpdate(req.body.id,req.body)
            res.send({status:true,msg:"successfully updated"})
        }catch(err){
            res.send({status:false,msg:err.message})
        }
    },
    singleSubscribtion:async function(req,res){
        try{
            const data=await Subscribetion.findById(req.body.id).lean();
            const userInfo=await User.findById(data._user,{password:0})
            res.send({status:true,msg:"successfully fetch",data:{...data,userInfo}})
        }catch(err){
            res.send({status:false,msg:err.message})
        }
    },
    subscribe:async function(req,res){
        subscribePackage(req.body.customerProfileId,req.body.customerPaymentProfileId,req.body,async(response)=>{
            if(response.getMessages().getResultCode()!="Error"){
                const data={
                    subscriptionId:response.subscriptionId,
                    amount:req.body.amount,
                    interval:req.body.interval,
                    cycle:req.body.cycle,
                    date:req.body.date
                }
                await Subscribetion.findByIdAndUpdate(req.body.id,{
                    subscribe:data
                })
                res.send({status:true,msg:'successfully Subscribe'})
            }else{
                res.send({
                    status:false,
                    msg:response.getMessages().getMessage()[0].getText()
                })
            }
        })
    },
}