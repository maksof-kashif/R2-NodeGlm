const express=require('express')
const router=express.Router()
var path = require('path')
const multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })
  
var upload = multer({ storage: storage });

const clientControllers=require('../controllers/clientControllers')
const profileController = require('../controllers/profileController')


router.post('/api/registerClient',clientControllers.registerClient)
router.get('/api/clients',clientControllers.allClients)
router.post('/api/deleteClient',clientControllers.deleteClient)
router.post('/api/editClient',upload.single('image'),clientControllers.editClient)
router.post('/api/profile',profileController.getProfile)
router.get('/api/clientList',clientControllers.clientList)
router.post('/api/searchClients',clientControllers.searchClients)
router.post('/api/searchClientsByDate',clientControllers.searchClientsByDate)



module.exports=router