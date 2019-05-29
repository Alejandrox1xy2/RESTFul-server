'use strict'

const port = process.env.PORT || 3000;
const express = require('express');
const logger = require("morgan");
const mongojs = require("mongojs");
const cors = require('cors');
const app = express();

//Middleware
var db = mongojs("SD");
var id = mongojs.ObjectID;

var allowCrossTokenHeader = (req,res,next)=>{
    res.header("Access-Control-Allow-Headers",'*')
    return next();

}

var allowCrossTokenOrigin = (req,res,next)=>{
    res.header("Access-Control-Allow-Origin",'*')
    return next();

}

app.use(cors())
app.use(allowCrossTokenHeader)
app.use(allowCrossTokenOrigin);

app.use(logger('dev'))  //Probar con el tiny,short,common,combined
app.use(express.urlencoded({extended:false}))
app.use(express.json())
//Definimos nuestro API RESTFul: rutas

// Trigger 
app.param("coleccion",(req,res,next,coleccion) =>{
    req.collection = db.collection(coleccion);
    return next();
})

//Routes
app.get('/api',(req,res,next)=>{
    db.getCollectionNames((err,colecciones)=>{
        if(err){
            return next(err);
        }
        res.json(colecciones);
    })

})

app.get('/api/:coleccion',(req,res,next) =>{
    req.collection.find((err,coleccion)=>{
        if(err){
            return next();
        }
        res.json(coleccion);
    })
})

app.get('/api/:coleccion/:id',(req,res,next)=>{
    req.collection.findOne({_id: id(req.params.id)},(err,elemento)=>{
        if(err){
            return next(err);
        }
        res.json(elemento);
    })
})

app.get('/api/product/:productID',(req,res)=>{
    res.status(200).send({products: `${req.params.productID}`})
})

app.post('/api/:coleccion',(req,res,next)=>{
    const elemento = req.body

    req.collection.save(elemento,(err,coleccionGuardada)=>
    {
        if(err){
            return next(err);
        }
        res.json(coleccionGuardada)       
    })
})

app.post('/api/product/',(req,res)=>{
    console.log(req.body);
    res.status(200).send({mensaje : 'EL producto se ha recibido y creado'})
})

app.put('/api/:coleccion/:id', function(req, res, next) {
    const elemento = req.body;

    req.collection.update({_id: id(req.params.id)}, elemento, (err, nuevo) =>{
        if(err) next(err)
        res.json(nuevo)
    })
    
})

app.delete('/api/:coleccion', function(req, res, next)  {
    const elemento = req.body;

    req.collection.remove(elemento, (err, eliminado) =>{
        if(err) next(err)
        res.json(eliminado)
    })
})


app.delete('/api/:coleccion/:id', function(req, res, next) {

    req.collection.remove({_id: id(req.params.id)}, (err, eliminado) =>{
        if(err) next(err)
        res.json(eliminado)
    })
})

app.put('/api/product/:productID',function(req,res){
    res.status(200).send({products: `${req.params.productID}`})
})


app.delete('/api/product/:productID',function(req,res) {
    res.status(200).send({products: `${req.params.productID}`})
})

app.listen(port, () =>{
    console.log(`API REST ejecutandose en http://localhost:${port}/api/:coleccion/:id`)
})