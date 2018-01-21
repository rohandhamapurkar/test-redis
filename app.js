const express = require('express');
const app = express();
const redis = require('redis');
const bodyParser = require('body-parser');

const client = redis.createClient();

client.on('connect',function(){
    console.log("Connected to redis")
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.put('/',(req,res)=>{
    let name = req.body.name;
    let email = req.body.email;
    client.hmset(req.body.key,[
        'name',name,
        'email',email,
    ],function(err,reply){
        if(err){
            res.json(err);
        } else {
            res.json(reply);
        }
    })
})

app.delete('/',(req,res)=>{
    client.del(req.body.key,function(err,reply){
        if(err){
            res.json(err);
        } else {
            res.json(reply);
        }
    })
})

app.get('/:key',(req,res)=>{
    client.hgetall(req.params.key,function(err,data){
        if(err){
            res.json(err);
        }
        else{
            res.json(data);
        }
    })
})

app.listen(process.env.port,function(){
    console.log("Listening on port "+process.env.port)
})