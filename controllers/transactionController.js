const bcrypt=require('bcrypt')
const mongoose=require('mongoose')
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");


const Transaction=mongoose.model('transactions')
const User=mongoose.model('users')
const Project=mongoose.model('projects')

module.exports={
    transactions: async function(req,res){
       try{
        const tranAgg=Transaction.aggregate([
            {$lookup:{
                from:"users",
                localField:"_user",
                foreignField:"_id",
                as:'user'
            }},
            {$lookup:{
                from:"projects",
                localField:"_project",
                foreignField:"_id",
                as:'project'
            }}
        ])
        const resp=await Transaction.aggregatePaginate(tranAgg, {limit:10,page:req.query.page,sort:{created_at:-1}})
        const updatedData=resp.docs.map(item=>({
            ...item,
            user:{...item.user[0]},
            project:{...item.project[0]}
        }))
        res.send({status:true,msg:"successfully fetch",data:{...resp,docs:updatedData}})
       }
       catch(err){
        res.send({status:false,msg:err.message})
       }
    },
    userTransactions:async function(req,res){
        try{
         const apiRes=await Transaction.aggregate([
             {$match:{_user:mongoose.Types.ObjectId(req.body.id)}},
             {$lookup:{
                 from:"users",
                 localField:"_user",
                 foreignField:"_id",
                 as:'user'
             }},
             {$lookup:{
                 from:"projects",
                 localField:"_project",
                 foreignField:"_id",
                 as:'project'
             }}
         ])
         const updatedData=apiRes.map(item=>({
             ...item,
             user:{...item.user[0]},
             project:{...item.project[0]}
         }))
         res.send({status:true,msg:"successfully fetch",data:updatedData})
        }
        catch(err){
         res.send({status:false,msg:err.message})
        }
     },
     getTransaction:async function(req,res){
        try{
            const transaction=await Transaction.findById(req.body.id).lean();
            const project=await Project.findById(transaction._project)
            const user=await User.findById(transaction._user)

            res.send({status:true,msg:"successfully fetch",data:{...transaction,project,user}})
           }
           catch(err){
            res.send({status:false,msg:err.message})
           }
     },
     searchTransaction: async function(req,res){
        try{
         const tranAgg=Transaction.aggregate([
             {$lookup:{
                 from:"users",
                 localField:"_user",
                 foreignField:"_id",
                 as:'user'
             }},
             {$lookup:{
                 from:"projects",
                 localField:"_project",
                 foreignField:"_id",
                 as:'project'
             }},
             { $match: {
                 $or:[
                    {"amount":{ $regex: req.body.text, $options: "i" }},
                    {"user.first_name":{ $regex: req.body.text, $options: "i" }},
                    {"user.last_name":{ $regex: req.body.text, $options: "i" }},
                    {"project.name":{ $regex: req.body.text, $options: "i" }},
                 ]
             }}
         ])
         const resp=await Transaction.aggregatePaginate(tranAgg, {limit:10,page:req.query.page})
         const updatedData=resp.docs.map(item=>({
             ...item,
             user:{...item.user[0]},
             project:{...item.project[0]}
         }))
         res.send({status:true,msg:"successfully fetch",data:{...resp,docs:updatedData}})
        }
        catch(err){
         res.send({status:false,msg:err.message})
        }
     },
     searchTransactionByDate: async function(req,res){
        try{
         const tranAgg=Transaction.aggregate([
             {$lookup:{
                 from:"users",
                 localField:"_user",
                 foreignField:"_id",
                 as:'user'
             }},
             {$lookup:{
                 from:"projects",
                 localField:"_project",
                 foreignField:"_id",
                 as:'project'
             }},
             { $match:{created_at: { $lte: new Date(req.body.date) }}}
         ])
         const resp=await Transaction.aggregatePaginate(tranAgg, {limit:10,page:req.query.page})
         const updatedData=resp.docs.map(item=>({
             ...item,
             user:{...item.user[0]},
             project:{...item.project[0]}
         }))
         res.send({status:true,msg:"successfully fetch",data:{...resp,docs:updatedData}})
        }
        catch(err){
         res.send({status:false,msg:err.message})
        }
     },
}