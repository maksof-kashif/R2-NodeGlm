const express=require('express')
const router=express.Router()
const authControllers=require('../controllers/authControllers')


router.post('/api/adminLogin',authControllers.adminLogin)



module.exports=router