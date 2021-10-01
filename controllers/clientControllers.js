const bcrypt=require('bcrypt')
const mongoose=require('mongoose')
const fs=require('fs')
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const createCustomerProfile=require('../services/createProfile').createCustomerProfile
const User=mongoose.model('users')
const saltRounds = 10;

module.exports={
    registerClient: async function(req,res){
        bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
            try{
                const existUser=await User.findOne({email:req.body.email})
                if(!existUser){
                    await User({
                        ...req.body,
                        password:hash,
                        updated_at:new Date(),
                        created_at:new Date(),
                        role:2
                    }).save()
                    res.send({status:true,msg:"create Successfully"})
                }else{
                    res.send({status:false,msg:"user Already exists"})
                }
            }catch(err){
                res.send({status:false,error:err._message})
            }
        })
    },
    deleteClient: async function(req,res){
        try{
            await User.findByIdAndDelete(req.body.id)
            res.send({status:true,msg:"successfully Deleted"})
        }catch(err){
            res.send({status:false,error:err._message})
        }
    },
    editUserProfile:async function(req,res){
        createCustomerProfile(req.body,async(response)=>{
            if(response.getMessages().getResultCode()!="Error"){
                try{
                    if(req.file){
                        const user=await User.findById(req.body.id);
                        if(user.image && user.image!="/uploads/default.jpeg"){
                            fs.unlinkSync("."+user.image)
                        }
                        await User.findByIdAndUpdate(req.body.id,{
                            ...req.body,
                            image:"/"+req.file.path,
                            updated_at:new Date()
                        })
                    }else{
                        await User.findByIdAndUpdate(req.body.id,{
                            ...req.body,
                            updated_at:new Date()
                        })
                    }
                    res.send({status:true,msg:"successfully Updated"})
                }catch(err){
                    res.send({status:false,error:err._message})
                }
            }else{
                res.send({
                    status:false,
                    msg:response.getMessages().getMessage()[0].getText()
                })
            }
        })
    },
    editClient: async function(req,res){
        try{
            console.log(req.file)
            if(req.file){
                const user=await User.findById(req.body.id);
                if(user.image && user.image!="/uploads/default.jpeg"){
                    fs.unlinkSync("."+user.image)
                }
                await User.findByIdAndUpdate(req.body.id,{
                    ...req.body,
                    image:"/"+req.file.path,
                    updated_at:new Date()
                })
            }else{
                await User.findByIdAndUpdate(req.body.id,{
                    ...req.body,
                    updated_at:new Date()
                })
            }
            res.send({status:true,msg:"successfully Updated"})
        }catch(err){
            res.send({status:false,error:err._message})
        }
    },
    allClients: async function(req,res){
        try{
            // const apiRes=await User.find({},{password:0}).lean()

            const userAgg= User.aggregate([
                {
                    $match:{role_id:2}
                },
                {$sort:{created_at:-1}},
                {
                    $lookup:{
                        from: 'projects',
                        localField:'_id',
                        foreignField:'_user',
                        as: 'totalProjects'
                    }
                },
                {
                    $lookup:{
                        from: 'subscribetions',
                        localField:'_id',
                        foreignField:'_user',
                        as: 'totalSubs'
                    }
                },
                { $addFields: {projects: {$size: "$totalProjects"}}},
                { $addFields: {subs: {$size: "$totalSubs"}}},
                {$project:{
                    totalProjects:0,
                    totalSubs:0,
                    password:0
                }}
            ])
            const resp=await User.aggregatePaginate(userAgg, {limit:10,page:req.query.page})
            res.send({status:true,msg:"successfully Fetched",data:resp})
        }catch(err){
            res.send({status:false,error:err._message})
        }
    },
    searchClients: async function(req,res){
        try{
            await User.collection.createIndex({'first_name':'text','last_name':'text','created_at':'text','organization':'text'})
            const userAgg= User.aggregate([
                {
                    $match:{role_id:2,$text: { $search: req.body.text } }
                },
                {
                    $lookup:{
                        from: 'projects',
                        localField:'_id',
                        foreignField:'_user',
                        as: 'totalProjects'
                    }
                },
                {
                    $lookup:{
                        from: 'subscribetions',
                        localField:'_id',
                        foreignField:'_user',
                        as: 'totalSubs'
                    }
                },
                { $addFields: {projects: {$size: "$totalProjects"}}},
                { $addFields: {subs: {$size: "$totalSubs"}}},
                {$project:{
                    totalProjects:0,
                    totalSubs:0,
                    password:0
                }}
            ])
            const resp=await User.aggregatePaginate(userAgg, {limit:10,page:req.query.page})
            res.send({status:true,msg:"successfully Fetched",data:resp})
        }catch(err){
            res.send({status:false,error:err.message})
        }
    },
    searchClientsByDate: async function(req,res){
        try{
            const userAgg= User.aggregate([
                {
                    $match:{role_id:2,created_at:{$lte:new Date(req.body.date)}}
                },
                {
                    $lookup:{
                        from: 'projects',
                        localField:'_id',
                        foreignField:'_user',
                        as: 'totalProjects'
                    }
                },
                {
                    $lookup:{
                        from: 'subscribetions',
                        localField:'_id',
                        foreignField:'_user',
                        as: 'totalSubs'
                    }
                },
                { $addFields: {projects: {$size: "$totalProjects"}}},
                { $addFields: {subs: {$size: "$totalSubs"}}},
                {$project:{
                    totalProjects:0,
                    totalSubs:0,
                    password:0
                }}
            ])
            const resp=await User.aggregatePaginate(userAgg, {limit:10,page:req.query.page})
            res.send({status:true,msg:"successfully Fetched",data:resp})
        }catch(err){
            res.send({status:false,error:err.message})
        }
    },
    clientList: async function(req,res){
        try{
            const apiRes=await User.find({},{_id:1,first_name:1,last_name:1,customerProfileId:1,customerPaymentProfileId:1})
            res.send({status:true,msg:"successfully Fetched",data:apiRes.reverse()})
        }catch(err){
            res.send({status:false,error:err._message})
        }
    },
    clientLogin: async function(req,res){
        const {email,password}=req.body
        try{
            const existUser=await User.findOne({email,role:2})
        if(existUser){
            bcrypt.compare(password, existUser.password, async function(err, result) {
                if(result){
                    res.send({
                        data:existUser,
                        message:"User login successfully.",
                        status:true
                    })
                }else{
                    res.send({message:"error",status:false,data:{error:'Password is invalid'}})
                }
            });
        }else{
            res.send({message:"error",status:false,data:{error:'Email is invalid'}})
        }
        }catch(err){
            res.send({message:"error",status:false,data:{error:err.message}})
        }
    }
}