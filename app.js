var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
app.use(express.static('public'))//Public is the folder which has all the html,css&js files as a static resourse
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/regdb');//regdb is the DB
var db = mongoose.connection;//through this 'var db' we can comm. with Database

db.on('error', function () {
    console.log('Connection Failed!!');
});

db.on('open', function () {
    console.log('Connection is established!!');
});

var jobSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is Required!"]
    },
   
    location: {
        type: String,
        required: true

    },
    phone: {
        type: String,
        required: true
    },
    usertype: {
        type:String,
        required:true
    },
    activeUser: {
        type:Boolean,
        default:false,
        required:true
    }

});

var role = mongoose.model('jobColl',jobSchema);

app.post('/reg1',function(req,res){
    var push = new role(req.body);
    push.save();
})

app.post('/login1',function(req,res){
    // console.log(req.body);
    role.findOne({username:req.body.username},function(error,docs){
        if(!docs)
        {
            res.json({
                flag:'failed',
                
            })
        }else
        {
            if(docs.password==req.body.password)
            {
                role.findOneAndUpdate({username:req.body.username},{$set:{'activeUser':true}},function(error,data){
                    if(!error){
                        res.json({
                            flag:'success',
                            data:data
                        })
                    }
                }) 
                
            }else{
                res.json({
                    flag:'failed',
                    
                })
            }
        }
    })
})




app.get('/', function (request, response) {
    response.sendFile(__dirname + '/index.html');
})

app.listen(8000, function () {
    console.log('Middleware/Express/Node/Backend is running on localhost:8000');
});