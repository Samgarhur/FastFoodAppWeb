const expres=require("express");
const app = expres();
const PORT=30000;
const fs =require("fs");
const bodyParser = require('body-parser')
const { spawn } = require('child_process');
const arxiuPython="proj1G7/python/main.py"
const ubicacioArxius="proj1G7/fotografies"
const ubicacioGrafics="proj1G7/python/grafics"
var mysql = require("mysql2")
var con = {
    host:".inspedralbes.cat:8083",
    user:"",
    pass:"",
    db:"",
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(PORT, function(){
    console.log("server running")
    }
)

con.connect(function(err){
    if(err){ 
        error="error"
        throw err}
    else{
        console.log("Connexio realitzada")
        
    }
})
con.end(function(err){
    if (err) {
        error="error"
        return console.log("error "+err.message)
    }  
    console.log("conexio tancada")
})

//movil a node-> enviar usuari, demanar productes i enviar comanda
//vue a node -> demanar i enviar productes i comandes