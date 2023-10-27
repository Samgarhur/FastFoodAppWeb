const express=require("express");
const app = express();
const cors = require("cors");
const PORT=3001;
const mysql = require('mysql2/promise');
const fs =require("fs");
const bodyParser = require('body-parser')
const { spawn } = require('child_process');
const { getUsuarisLogin, getComandes } = require("./scriptBD.js");
const { insertComanda } = require("./scriptBD.js");
/*const { getProductes } = require("./scriptBD.js");
const { getComandes } = require("./scriptBD.js");*/
const arxiuPython="/python/main.py"
const ubicacioArxius="/fotografies"
const ubicacioGrafics="/python/grafics"
//const io = require('socket.io')(server);

/*Accept all request*/
app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(PORT, function(){
    console.log("server running")
    }
)
const connection = mysql.createPool({
    host: "dam.inspedralbes.cat",
    user: "a22albcormad_botigaG7",
    password: "botigaG7",
    database: "a22albcormad_BotigaG7"
});


app.post("/usuaris", function(req, res){
    const user = req.body;

    let usuariTrobat=false;
    autoritzacio={"autoritzacio":false};
    
    usuaris= getUsuarisLogin(connection).then((usuaris) => {
    usuaris=JSON.parse(usuaris)
    
    for(var i; i<usuaris.length || usuariTrobat==false; i++){
        nom=(usuaris[1].usuario)
        contra=(usuaris[1].passwd)

        if(nom==user.usuario && contra==user.contra){
            console.log("hola")
            usuariTrobat=true;
        }
    }
    autoritzacio.autoritzacio=usuariTrobat;
    res.send(autoritzacio)}) 
   
    
}) //donarAutoritzacio al login android

app.post("/crearComanda", function(req, res){
    const comanda = req.body;
    resultat=insertComanda(connection, comanda).then((resultat)  => {
    result={"autoritzacio": resultat}
    res.send(result)})
})//crear la comanda a la bbdd


app.get("/getComandes", async function(req, res){
    try {
        const comandes = await getComandes(connection); 
        const comandesJson = JSON.parse(comandes);
        
        res.json(comandesJson);
    } catch (error) {
        console.error('Error al obtener las comandas:', error.message);
        res.status(500).send('Error al obtener datos de comandas.');
    }




});
/*const interval = 5000; // Interval de temps en milisegundos (5 segons)

setInterval(async () => {
    try {
        const ComandesJSON = await getComandes(connection); 
        io.emit('comandes', ComandesJSON); // Envia les comandes
    } catch (error) {
        console.error('Error al obtener les comandes:', error.message);
    }
}, interval);*/





//movil - node-> enviar usuari, demanar productes i enviar comanda
//vue - node -> demanar i enviar productes i comandes