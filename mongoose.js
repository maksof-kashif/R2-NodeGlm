const mongoose=require('mongoose');
const keys=require('./config/keys')

mongoose.connect(`mongodb+srv://${keys.databaseUserName}:${keys.databasePassword}@cluster0.79ekf.mongodb.net/${keys.databaseName}?retryWrites=true&w=majority`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex:false
}).then(()=>{
    console.log("connected to Database")
})