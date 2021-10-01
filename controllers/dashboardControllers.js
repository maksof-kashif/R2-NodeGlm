const bcrypt=require('bcrypt')
const mongoose=require('mongoose')


const Project=mongoose.model('projects')
const User=mongoose.model('users')
const AssociateSubscribetion=mongoose.model('associateSubscribetions')
const Subscribetion=mongoose.model('subscribetions')
module.exports={
    getDashboard: async function(req,res){
        const {email,password}=req.body
        try{
            const users=await User.count()
            const projects=await Project.count()
            const subs=await Subscribetion.count()
            const assSub=await AssociateSubscribetion.count()
            res.send({status:true,msg:'successfully fetch',data:{
                users,
                projects,
                assSub,
                subs
            }})
        }catch(err){
            res.send({message:"error",status:false,data:{error:err._message}})
        }
    }
}