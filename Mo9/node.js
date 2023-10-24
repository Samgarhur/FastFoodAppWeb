const expres=require("express");
const app = expres();
const PORT=3000;
const fs =require("fs");
const bodyParser = require('body-parser')
const { spawn } = require('child_process');
const arxiuPython="/python/main.py"
const ubicacioArxius="/fotografies"
const ubicacioGrafics="/python/grafics"
const mo6=require("/M06/sciptRebreUsuaris.js")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(PORT, function(){
    console.log("server running")
    }
)



app.post("/usuaris", function(req, res){
    const usuari = req.params.body;

    autoritzacio={"autoritzacio":false}
    usuaris=mo6.ObtenerUsuarios()
    usuariTrobat=false,
    num=0;
    while(usuariTrobat==false || num<=usuaris.length){
        if(usuaris[num].usuari==usuari.nombre && usuaris[num].passwd==usuari.contraseña){
            usuariTrobat=true;
            autoritzacio=true;
        }
        num++;
    }
    res.send(autoritzacio)
    
}) //donarAutoritzacio al login android

app.post("/crearComanda", function(req, res){
    const comanda = req.params.body;
    result={"autoritzacio":"cridar crear comanda(comanda)"}
    json.send(result)
})//crear la comanda a la bbdd





//movil - node-> enviar usuari, demanar productes i enviar comanda
//vue - node -> demanar i enviar productes i comandes