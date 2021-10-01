const express=require('express')
const dashboardControllers = require('../controllers/dashboardControllers')
const router=express.Router()



router.get('/api/dashboard',dashboardControllers.getDashboard)



module.exports=router