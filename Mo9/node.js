const expres=require("express");
const app = expres();
const PORT=30000;
const fs =require("fs");
const bodyParser = require('body-parser')
const { spawn } = require('child_process');
const arxiuPython="proj1G7/python/main.py"
const ubicacioArxius="proj1G7/fotografies"
const ubicacioGrafics="proj1G7/python/grafics"


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(PORT, function(){
    console.log("server running")
    }
)

app.get("/usuaris", function(req, res){
    const usuari = req.params.user;
    const contra = req.params.password;
    autoritzacio=false
    usuaris="insertar aqui crida a sql"
    usuariTrobat=false
    num=0;
    while(usuariTrobat==false || num<=usuaris.length){
        if(usuaris[num].usuari==usuari && usuaris[num].passw==contra){
            usuariTrobat=true;
            autoritzacio=true;
        }
        num++;
    }
    res.send(autoritzacio)
}) //donarAutoritzacio al login android


//movil a node-> enviar usuari, demanar productes i enviar comanda
//vue a node -> demanar i enviar productes i comandes